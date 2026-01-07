import { visit } from "unist-util-visit"
import type { Pluggable } from "unified"

// Type definitions for Quartz plugin interface
interface BuildCtx {
  allSlugs: string[]
  cfg: Record<string, any> // Quartz configuration object
  argv: Record<string, any> // Command-line arguments
}

interface QuartzTransformerPluginInstance {
  name: string
  textTransform?: (ctx: BuildCtx, src: string) => string
  markdownPlugins?: (ctx: BuildCtx) => Pluggable[]
  htmlPlugins?: (ctx: BuildCtx) => Pluggable[]
  externalResources?: (ctx: BuildCtx) => Partial<StaticResources>
}

interface StaticResources {
  css: Array<{ content?: string; src?: string; inline?: boolean }>
  js: Array<{
    src?: string
    loadTime?: "beforeDOMReady" | "afterDOMReady"
    contentType?: "external" | "inline"
    script?: string
  }>
}

type QuartzTransformerPlugin<T = undefined> = (
  opts?: T,
) => QuartzTransformerPluginInstance

// Type definitions for AST nodes
interface Root {
  type: "root"
  children: any[]
}

/**
 * Options for MMLABCTransformer plugin
 */
interface MMLABCOptions {
  /** Enable transformation of MML code blocks (default: true) */
  enableMML?: boolean
  /** Enable transformation of chord code blocks (default: true) */
  enableChord?: boolean
  /** Enable transformation of ABC code blocks (default: true) */
  enableABC?: boolean
}

const defaultOptions: MMLABCOptions = {
  enableMML: true,
  enableChord: true,
  enableABC: true,
}

/**
 * Quartz transformer plugin for converting MML (Music Macro Language), chord progression,
 * and ABC notation code blocks into interactive sheet music using abcjs.
 * 
 * This plugin operates in two stages:
 * 1. Build-time: Transforms markdown code blocks into HTML divs with data attributes
 * 2. Browser runtime: Loads CDN libraries, converts notation, and renders interactive SVG
 * 
 * @param userOpts - Configuration options for enabling/disabling specific notation types
 * @returns A Quartz transformer plugin instance
 * 
 * @example
 * ```typescript
 * // quartz.config.ts
 * import { QuartzConfig } from "./quartz/cfg"
 * import * as Plugin from "./quartz/plugins"
 * import { MMLABCTransformer } from "quartz-transformer-mmlabc"
 * 
 * const config: QuartzConfig = {
 *   configuration: {
 *     // ... your Quartz configuration (siteTitle, theme, etc.)
 *   },
 *   plugins: {
 *     transformers: [
 *       // Built-in Quartz transformers
 *       Plugin.FrontMatter(),
 *       Plugin.TableOfContents(),
 *       // Add the MML/Chord/ABC transformer
 *       MMLABCTransformer({
 *         enableMML: true,
 *         enableChord: true,
 *         enableABC: true,
 *       }),
 *     ],
 *     filters: [
 *       // ... your filters
 *     ],
 *     emitters: [
 *       // ... your emitters
 *     ],
 *   },
 * }
 * 
 * export default config
 * ```
 */
export const MMLABCTransformer: QuartzTransformerPlugin<MMLABCOptions | undefined> = (
  userOpts?: MMLABCOptions,
) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "MMLABCTransformer",
    markdownPlugins(_ctx: BuildCtx) {
      return [
        () => {
          return (tree: Root, _file: any) => {
            visit(tree, "code", (node: any) => {
              const lang = node.lang?.toLowerCase()

              // Handle MML blocks - replace with HTML that will be processed in browser
              if (opts.enableMML && lang === "mml") {
                const mmlCode = node.value as string

                // Replace the code block with an HTML block containing the MML data
                node.type = "html"
                node.value = `<div class="abc-notation mml-block" data-mml="${escapeHtml(
                  mmlCode,
                )}" data-type="mml" role="button" tabindex="0" aria-label="Play music notation"></div>`
                delete node.lang
              }

              // Handle chord blocks - replace with HTML that will be processed in browser
              if (opts.enableChord && lang === "chord") {
                const chordCode = node.value as string

                // Replace the code block with an HTML block containing the chord data
                node.type = "html"
                node.value = `<div class="abc-notation chord-block" data-chord="${escapeHtml(
                  chordCode,
                )}" data-type="chord" role="button" tabindex="0" aria-label="Play music notation"></div>`
                delete node.lang
              }

              // Handle ABC blocks - replace with HTML that will be processed in browser
              if (opts.enableABC && lang === "abc") {
                const abcCode = node.value as string

                // Replace the code block with an HTML block containing the ABC data
                node.type = "html"
                node.value = `<div class="abc-notation abc-block" data-abc="${escapeHtml(
                  abcCode,
                )}" data-type="abc" role="button" tabindex="0" aria-label="Play music notation"></div>`
                delete node.lang
              }
            })
          }
        },
      ]
    },
    externalResources(_ctx: BuildCtx) {
      return {
        js: [
          {
            src: "https://cdn.jsdelivr.net/npm/abcjs@6/dist/abcjs-basic-min.min.js",
            loadTime: "afterDOMReady",
            contentType: "external",
          },
          {
            // Large inline script is intentional for distribution simplicity
            // This ensures the plugin works as a standalone npm package without additional asset management
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: `//<![CDATA[
// Initialize abcjs rendering for all ABC notation blocks
(async function() {
  // Wait for ABCJS to be available
  if (typeof ABCJS === 'undefined') {
    console.error('ABCJS library not loaded');
    return;
  }

  // Cache the mml2abc module to avoid duplicate imports
  let mml2abcModule = null;
  
  // Cache the chord2mml loading promise to avoid race conditions
  let chord2mmlLoadPromise = null;
  
  // Global synth instance for audio playback
  let currentSynth = null;
  let currentPlayingElement = null;
  
  // Shared AudioContext (create once and reuse)
  let sharedAudioContext = null;
  
  // WeakMap to store visual objects for each element
  const visualObjMap = new WeakMap();

  // Theme detection and switching for Quartz dark mode integration
  const updateNotationTheme = function(isDark) {
    const blocks = document.querySelectorAll('.abc-notation');
    blocks.forEach(block => {
      if (isDark) {
        block.classList.add('theme-dark');
        block.classList.remove('theme-light');
      } else {
        block.classList.add('theme-light');
        block.classList.remove('theme-dark');
      }
    });
  };

  // 1) Initial theme detection
  // First try to detect Quartz's theme from document attributes or classes
  const getQuartzTheme = function() {
    // Check for Quartz-specific theme indicators
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Check data-theme attribute (common in Quartz)
    const dataTheme = htmlElement.getAttribute('data-theme') || bodyElement.getAttribute('data-theme');
    if (dataTheme === 'dark') return 'dark';
    if (dataTheme === 'light') return 'light';
    
    // Check for dark class on html or body
    if (htmlElement.classList.contains('dark') || bodyElement.classList.contains('dark')) {
      return 'dark';
    }
    
    // Fallback to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };

  const initialTheme = getQuartzTheme();
  const initialIsDark = initialTheme === 'dark';
  
  // Apply initial theme
  updateNotationTheme(initialIsDark);

  // 2) Listen for Quartz theme changes
  document.addEventListener('themechange', (e) => {
    const theme = e.detail?.theme;
    if (theme === 'dark' || theme === 'light') {
      updateNotationTheme(theme === 'dark');
    }
  });

  // Process all abc-notation blocks
  const blocks = document.querySelectorAll('.abc-notation');
  
  for (const element of blocks) {
    const type = element.getAttribute('data-type');
    
    try {
      let abcNotation = '';
      
      if (type === 'mml') {
        const mmlData = element.getAttribute('data-mml');
        if (mmlData) {
          // Dynamically import mml2abc ES module from CDN
          // Version specified by @cat2151 based on verified compatibility in easychord2mml
          if (!mml2abcModule) {
            mml2abcModule = await import('https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs');
          }
          abcNotation = mml2abcModule.parse(mmlData);
        }
      } else if (type === 'chord') {
        const chordData = element.getAttribute('data-chord');
        if (chordData) {
          // Load chord2mml as a script (UMD bundle, not ES module)
          // Version specified by @cat2151 based on verified compatibility in easychord2mml
          if (typeof window.chord2mml === 'undefined') {
            if (!chord2mmlLoadPromise) {
              chord2mmlLoadPromise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/gh/cat2151/chord2mml/dist/chord2mml.js';
                script.integrity = 'sha384-s0MWjnJMkG/kT19h1SE4UrQ7YZ0eSnBKYgzstrrpAsrHer1g6ZqgCJJbmj0zTIcz';
                script.crossOrigin = 'anonymous';
                script.onload = resolve;
                script.onerror = () => reject(new Error('Failed to load chord2mml script'));
                document.head.appendChild(script);
              });
            }
            await chord2mmlLoadPromise;
          }
          const mmlData = window.chord2mml.parse(chordData);
          // Then convert MML to ABC (reuse cached module)
          if (!mml2abcModule) {
            mml2abcModule = await import('https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs');
          }
          abcNotation = mml2abcModule.parse(mmlData);
        }
      } else if (type === 'abc') {
        // For ABC notation, no conversion needed - use directly
        const abcData = element.getAttribute('data-abc');
        if (abcData) {
          abcNotation = abcData;
        }
      }
      
      if (abcNotation) {
        // コンテナのサイズに基づいて五線譜の幅をレスポンシブに計算
        const containerWidth = element.offsetWidth || element.clientWidth || 600;
        // .abc-notation の padding: 1em は左右で合計2em（約32px）
        // フォントサイズが16pxと仮定すると、2em ≈ 32px + 安全マージン約8px = 40px
        const availableWidth = containerWidth - 40;
        // 最小300px、最大800pxの範囲に制限
        const staffWidth = Math.min(Math.max(availableWidth, 300), 800);
        
        // Render the ABC notation with abcjs
        const visualObj = ABCJS.renderAbc(element, abcNotation, {
          responsive: 'resize',
          staffwidth: staffWidth,
          scale: 1.0
        });
        
        // Store the visual object using WeakMap
        visualObjMap.set(element, visualObj);
        
        // Define the playback handler function
        const handlePlayback = async function(e) {
          e.preventDefault();
          
          // Stop any currently playing music
          if (currentSynth) {
            currentSynth.stop();
            if (currentPlayingElement) {
              currentPlayingElement.classList.remove('playing');
            }
          }
          
          // If clicking the same element that's playing, just stop
          if (currentPlayingElement === element) {
            currentPlayingElement = null;
            currentSynth = null;
            return;
          }
          
          try {
            // Create audio context once (requires user gesture for first time)
            if (!sharedAudioContext) {
              const AudioContextClass = window.AudioContext || window.webkitAudioContext;
              if (AudioContextClass) {
                sharedAudioContext = new AudioContextClass();
              } else {
                console.error('Web Audio API not supported');
                return;
              }
            }
            
            // Ensure audio context is running (some browsers start it in a suspended state)
            if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
              await sharedAudioContext.resume();
            }
            
            // Get the visual object for this element
            const visualObj = visualObjMap.get(element);
            if (!visualObj || !visualObj[0]) {
              console.error('Visual object not found for element');
              return;
            }
            
            // Create synth
            if (ABCJS.synth.CreateSynth) {
              currentSynth = new ABCJS.synth.CreateSynth();
              
              // Initialize synth
              await currentSynth.init({
                audioContext: sharedAudioContext,
                visualObj: visualObj[0],
                options: {}
              });
              
              // Prime the synth with the tune
              await currentSynth.prime();
              
              // Mark as playing
              element.classList.add('playing');
              currentPlayingElement = element;
              
              // Set up event listener for when playback finishes
              const cleanup = function() {
                if (currentPlayingElement === element) {
                  element.classList.remove('playing');
                  currentPlayingElement = null;
                  if (currentSynth && typeof currentSynth.stop === 'function') {
                    currentSynth.stop();
                  }
                  currentSynth = null;
                }
              };
              
              // Start playback
              currentSynth.start();
              
              // Store a unique ID for this playback to handle race conditions
              const playbackId = Date.now();
              element.setAttribute('data-playback-id', playbackId.toString());
              
              // Check playback status with safety limit
              let pollCount = 0;
              const maxPolls = 6000; // Max 10 minutes (6000 * 100ms)
              
              const checkPlaybackStatus = function() {
                pollCount++;
                
                // Check if this playback has been superseded
                const currentPlaybackId = element.getAttribute('data-playback-id');
                if (currentPlaybackId !== playbackId.toString()) {
                  return; // Stop polling for this playback
                }
                
                // Safety check: stop after max polls
                if (pollCount >= maxPolls) {
                  console.warn('Playback check timeout reached');
                  cleanup();
                  return;
                }
                
                // Check if synth is still playing
                if (currentSynth && currentSynth.isRunning && !currentSynth.isRunning()) {
                  cleanup();
                } else if (currentSynth) {
                  // Check again in 100ms
                  setTimeout(checkPlaybackStatus, 100);
                }
              };
              
              // Start checking after a short delay
              setTimeout(checkPlaybackStatus, 100);
            } else {
              console.error('ABCJS synth API not available');
              const errorParagraph = document.createElement('p');
              errorParagraph.style.color = 'orange';
              errorParagraph.style.fontSize = '0.9em';
              errorParagraph.textContent = 'Audio playback is not available in this version of abcjs.';
              element.appendChild(errorParagraph);
            }
          } catch (error) {
            console.error('Error playing music:', error);
            element.classList.remove('playing');
            currentPlayingElement = null;
            currentSynth = null;
          }
        };
        
        // Add click handler for audio playback
        element.addEventListener('click', handlePlayback);
        
        // Add keyboard handler for accessibility (Enter and Space keys)
        element.addEventListener('keydown', async function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            await handlePlayback(e);
          }
        });
      }
    } catch (error) {
      console.error('Error rendering notation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorParagraph = document.createElement('p');
      errorParagraph.style.color = 'red';
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('import')) {
        errorParagraph.textContent = 'Error loading music notation library. Please check your internet connection.';
      } else if (errorMessage.includes('parse')) {
        const notationType = type === 'chord' ? 'chord' : type === 'abc' ? 'ABC' : 'MML';
        errorParagraph.textContent = 'Error parsing ' + notationType + ' notation. Please check the syntax.';
      } else {
        errorParagraph.textContent = 'Error rendering music notation';
      }
      element.innerHTML = '';
      element.appendChild(errorParagraph);
    }
  }
})();
//]]>`.trim(),
          },
        ],
        css: [
          {
            content: `
.abc-notation {
  margin: 1em 0;
  padding: 1em;
  background-color: var(--abc-bg, #f5f5f5);
  border-radius: 4px;
  overflow-x: auto;
  cursor: pointer;
  position: relative;
  max-width: 95%;
}

/* Let SVG use full container width */
.abc-notation svg {
  max-width: 100%;
  height: auto;
}

/* Override abcjs default colors for dark mode compatibility */
.abc-notation svg path,
.abc-notation svg text {
  fill: var(--abc-svg-color, #000);
}

.abc-notation.playing {
  background-color: var(--abc-playing-bg, #e8f5e9);
}

.abc-notation::before {
  content: "▶ Click to play";
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  font-size: 0.8em;
  color: var(--abc-label-color, #666);
  background-color: var(--abc-label-bg, rgba(255, 255, 255, 0.9));
  padding: 0.3em 0.6em;
  border-radius: 3px;
  pointer-events: none;
}

.abc-notation.playing::before {
  content: "🔊 Playing...";
  color: var(--abc-playing-label-color, #2e7d32);
}

/* Dark mode support */
/* Note: CSS variable definitions are intentionally duplicated to support both:
   1. System-level dark mode via media query (prefers-color-scheme)
   2. Quartz-specific dark mode implementations (data-theme, .dark class)
   3. Dynamic class-based theme switching via JavaScript
   This ensures compatibility with different Quartz configurations.
   
   The duplication is intentional rather than using root-level custom properties because:
   - Higher specificity ensures theme styles override defaults reliably
   - Each method (media query, data-theme, class-based) may be used independently
   - Simpler to maintain as a self-contained plugin without affecting global styles */
@media (prefers-color-scheme: dark) {
  .abc-notation {
    --abc-bg: #2d2d2d;
    --abc-playing-bg: #1a3a1a;
    --abc-label-color: #aaa;
    --abc-label-bg: rgba(50, 50, 50, 0.9);
    --abc-playing-label-color: #4caf50;
    --abc-svg-color: #e0e0e0;
  }
}

/* Quartz-specific dark mode support (if Quartz uses data-theme or class) */
:root[data-theme="dark"] .abc-notation,
.dark .abc-notation,
html.dark .abc-notation {
  --abc-bg: #2d2d2d;
  --abc-playing-bg: #1a3a1a;
  --abc-label-color: #aaa;
  --abc-label-bg: rgba(50, 50, 50, 0.9);
  --abc-playing-label-color: #4caf50;
  --abc-svg-color: #e0e0e0;
}

/* Dynamic theme classes (applied by JavaScript for Quartz theme integration) */
.abc-notation.theme-dark {
  --abc-bg: #2d2d2d;
  --abc-playing-bg: #1a3a1a;
  --abc-label-color: #aaa;
  --abc-label-bg: rgba(50, 50, 50, 0.9);
  --abc-playing-label-color: #4caf50;
  --abc-svg-color: #e0e0e0;
}

.abc-notation.theme-light {
  --abc-bg: #f5f5f5;
  --abc-playing-bg: #e8f5e9;
  --abc-label-color: #666;
  --abc-label-bg: rgba(255, 255, 255, 0.9);
  --abc-playing-label-color: #2e7d32;
  --abc-svg-color: #000;
}
            `.trim(),
            inline: true,
          },
        ],
      }
    },
  }
}

/**
 * Escape HTML special characters including newlines and whitespace
 * to prevent XSS vulnerabilities and ensure proper data attribute encoding
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
    "\n": "&#10;",
    "\r": "&#13;",
    "\t": "&#9;",
  }
  return text.replace(/[&<>"'\n\r\t]/g, (m) => map[m])
}

