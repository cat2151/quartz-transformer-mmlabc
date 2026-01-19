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
            script: `
// Initialize abcjs rendering for all ABC notation blocks
// Supports Quartz v4 SPA navigation by listening for "nav" events
// Note: Uses regular function wrapper (not async IIFE) to avoid blocking page load.
// The async initializeMusicNotation() function is called with error handling.
(function() {
  // Plugin version for debugging
  const PLUGIN_VERSION = '0.1.0-debug';
  console.log('[MML-ABC-Transformer] Plugin loaded. Version:', PLUGIN_VERSION);
  
  // Check if ABCJS is available
  if (typeof ABCJS === 'undefined') {
    console.error('[MML-ABC-Transformer] ABCJS library not loaded');
    return;
  }

  // Global state that persists across SPA navigations
  // Cache the mml2abc module to avoid duplicate imports
  let mml2abcModule = null;
  
  // Cache the chord2mml loading promise to avoid race conditions
  let chord2mmlLoadPromise = null;
  
  // Global synth instance for audio playback
  let currentSynth = null;
  let currentPlayingElement = null;
  
  // Shared AudioContext (create once and reuse across navigations)
  let sharedAudioContext = null;
  
  // WeakMap to store visual objects for each element
  const visualObjMap = new WeakMap();
  
  // Track processed elements to avoid duplicate initialization
  // WeakSet automatically removes references when elements are garbage collected,
  // which is perfect for SPA navigation where DOM elements are dynamically created/destroyed
  const processedElements = new WeakSet();

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

  // Helper to detect Quartz's theme from document attributes or classes
  const getQuartzTheme = function() {
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

  // ===== nav デバッグ可視化 =====

  function logNavDebug(where: string) {
    return function (e: Event) {
      const ce = e as any

      const abcNodes = document.querySelectorAll('.abc-notation')
      const processed = document.querySelectorAll('[data-mmlabc-processed]')

      console.groupCollapsed('[nav @ ' + where + ']')

      console.log('event:', e)
      console.log('detail:', ce && ce.detail)
      console.log('target:', e.target)
      console.log('currentTarget:', e.currentTarget)

      console.log('abc-notation count:', abcNodes.length)
      console.log('processed count:', processed.length)

      if (abcNodes.length > 0) {
        const el = abcNodes[0] as HTMLElement
        console.log('sample abc element:', el)
        console.log(
          'sample processed?',
          el.hasAttribute('data-mmlabc-processed')
        )
      }

      console.groupEnd()
    }
  }

  // capture → bubble → window
  document.addEventListener('nav', logNavDebug('document-capture'), true)
  document.addEventListener('nav', logNavDebug('document'))
  window.addEventListener('nav', logNavDebug('window'))

  // ===== 以上、nav デバッグ可視化 =====
  
  // Main initialization function - called on initial load and SPA navigation
  const initializeMusicNotation = async function() {
    console.log('[MML-ABC-Transformer] 五線譜表示処理を開始します');
    const startTime = performance.now();
    
    // Apply current theme
    const currentTheme = getQuartzTheme();
    updateNotationTheme(currentTheme === 'dark');

    // Process all abc-notation blocks
    const blocks = document.querySelectorAll('.abc-notation');
    console.log('[MML-ABC-Transformer] 処理対象の楽譜ブロック数:', blocks.length);
    
    for (const element of blocks) {
      // Skip if this element was already processed (idempotent initialization)
      if (processedElements.has(element)) {
        console.log('[MML-ABC-Transformer] スキップ: 既に処理済みの要素');
        continue;
      }
      
      // Mark as processed
      processedElements.add(element);
      console.log('[MML-ABC-Transformer] 新しい楽譜要素を処理します。Type:', element.getAttribute('data-type'));
      
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
                // abcjs CreateSynth's start() may return a promise that resolves when complete
                const playbackPromise = currentSynth.start();
                
                // If start() returns a promise, use it to detect completion
                if (playbackPromise && typeof playbackPromise.then === 'function') {
                  playbackPromise.then(function() {
                    // Playback completed successfully
                    cleanup();
                  }).catch(function(error) {
                    // Playback error or stopped
                    console.error('Playback ended or error:', error);
                    cleanup();
                  });
                } else {
                  // If start() doesn't return a promise, we have no way to detect completion
                  // This is actually fine - the user can stop playback by clicking again
                  // The cleanup will happen when they click to play something else or stop
                  console.debug('Playback started (no completion detection available)');
                }
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
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log('[MML-ABC-Transformer] 五線譜表示処理が完了しました。処理時間:', duration, 'ms');
  };

  // Listen for Quartz theme changes
  document.addEventListener('themechange', (e) => {
    const theme = e.detail?.theme;
    if (theme === 'dark' || theme === 'light') {
      updateNotationTheme(theme === 'dark');
    }
  });

  // Flag to prevent duplicate initialization from multiple event sources
  let isInitializing = false;
  
  // Flag to track if initial load has completed
  let initialLoadComplete = false;
  
  // Wrapper function to handle navigation with debouncing
  const handleNavigation = (source) => {
    console.log('[MML-ABC-Transformer] ナビゲーションを検知しました。ソース:', source);
    
    // Prevent concurrent initializations
    if (isInitializing) {
      console.log('[MML-ABC-Transformer] 初期化が既に実行中のためスキップします');
      return;
    }
    
    isInitializing = true;
    
    // Call async initialization and handle any errors
    initializeMusicNotation()
      .catch(err => {
        console.error('[MML-ABC-Transformer] Error initializing music notation after navigation:', err);
      })
      .finally(() => {
        isInitializing = false;
      });
  };

  // Listen for Quartz SPA navigation events
  // Multiple event sources to ensure we catch navigation in different Quartz configurations
  console.log('[MML-ABC-Transformer] イベントリスナーを登録します');
  
  // Primary: Quartz v4 "nav" event
  window.addEventListener('nav', () => {
    handleNavigation('nav event');
  });
  console.log('[MML-ABC-Transformer] "nav" イベントリスナーを登録しました');
  
  // Fallback: popstate event for browser back/forward
  // Note: In some browsers, popstate fires on initial page load. We delay registration
  // to avoid redundant initialization with the initial load call.
  setTimeout(() => {
    window.addEventListener('popstate', () => {
      if (initialLoadComplete) {
        handleNavigation('popstate event');
      }
    });
    console.log('[MML-ABC-Transformer] "popstate" イベントリスナーを登録しました（遅延登録）');
  }, 100);
  
  // Initial render on page load
  console.log('[MML-ABC-Transformer] 初期ページ読み込み時の処理を開始します');
  initializeMusicNotation()
    .catch(err => {
      console.error('[MML-ABC-Transformer] Error initializing music notation on page load:', err);
    })
    .finally(() => {
      initialLoadComplete = true;
      
      // Fallback: Observe DOM changes to detect when new content is loaded
      // Set up MutationObserver after initial load to avoid detecting our own initial rendering
      const observer = new MutationObserver((mutations) => {
        // Check if any new .abc-notation elements were added
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            const addedNodes = Array.from(mutation.addedNodes);
            const hasNewNotation = addedNodes.some(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node;
                return element.classList?.contains('abc-notation') || 
                       element.querySelector?.('.abc-notation');
              }
              return false;
            });
            
            if (hasNewNotation) {
              handleNavigation('MutationObserver');
              break; // Only handle once per batch of mutations
            }
          }
        }
      });
      
      // Observe the body for childList changes (content swaps during SPA navigation)
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      console.log('[MML-ABC-Transformer] MutationObserver を設定しました');
      
      // Register cleanup function for SPA navigation
      // This prevents memory leaks when navigating away
      if (typeof window.addCleanup === 'function') {
        window.addCleanup(() => {
          // Stop any playing audio
          if (currentSynth && typeof currentSynth.stop === 'function') {
            currentSynth.stop();
          }
          if (currentPlayingElement) {
            currentPlayingElement.classList.remove('playing');
          }
          currentSynth = null;
          currentPlayingElement = null;
          
          // Disconnect the MutationObserver to prevent memory leaks
          if (observer) {
            observer.disconnect();
          }
          
          // Note: We keep sharedAudioContext, mml2abcModule, and chord2mmlLoadPromise
          // cached across navigations for performance
        });
      }
    });
})();
            `.trim(),
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

