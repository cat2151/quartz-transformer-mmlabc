import { visit } from "unist-util-visit"

// Type definitions for Quartz plugin interface
interface BuildCtx {
  allSlugs: string[]
  cfg: Record<string, any> // Quartz configuration object
  argv: Record<string, any> // Command-line arguments
}

interface QuartzTransformerPluginInstance {
  name: string
  textTransform?: (ctx: BuildCtx, src: string) => string
  markdownPlugins?: (ctx?: BuildCtx) => any[]
  htmlPlugins?: (ctx?: BuildCtx) => any[]
  externalResources?: (ctx?: BuildCtx) => Partial<StaticResources>
}

interface StaticResources {
  css: Array<{ content?: string; src?: string; inline?: boolean }>
  js: Array<{
    src?: string
    loadTime?: "beforeDOMReady" | "afterDOMReady"
    contentType?: "external" | "inline"
    script?: string
  }>
  afterDOMLoaded?: string
}

type QuartzTransformerPlugin<T = undefined> = (
  opts?: T,
) => QuartzTransformerPluginInstance

// Type definitions for AST nodes
interface Root {
  type: "root"
  children: any[]
}

interface MMLABCOptions {
  enableMML?: boolean
  enableChord?: boolean
  enableABC?: boolean
}

const defaultOptions: MMLABCOptions = {
  enableMML: true,
  enableChord: true,
  enableABC: true,
}

/**
 * Quartz transformer plugin for converting MML and chord notation to ABC notation
 * and rendering with abcjs
 */
export const MMLABCTransformer: QuartzTransformerPlugin<MMLABCOptions | undefined> = (
  userOpts?: MMLABCOptions,
) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "MMLABCTransformer",
    markdownPlugins() {
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
                )}" data-type="mml"></div>`
                delete node.lang
              }

              // Handle chord blocks - replace with HTML that will be processed in browser
              if (opts.enableChord && lang === "chord") {
                const chordCode = node.value as string

                // Replace the code block with an HTML block containing the chord data
                node.type = "html"
                node.value = `<div class="abc-notation chord-block" data-chord="${escapeHtml(
                  chordCode,
                )}" data-type="chord"></div>`
                delete node.lang
              }

              // Handle ABC blocks - replace with HTML that will be processed in browser
              if (opts.enableABC && lang === "abc") {
                const abcCode = node.value as string

                // Replace the code block with an HTML block containing the ABC data
                node.type = "html"
                node.value = `<div class="abc-notation abc-block" data-abc="${escapeHtml(
                  abcCode,
                )}" data-type="abc"></div>`
                delete node.lang
              }
            })
          }
        },
      ]
    },
    externalResources() {
      return {
        js: [
          {
            src: "https://cdn.jsdelivr.net/npm/abcjs@6.4.0/dist/abcjs-basic-min.js",
            loadTime: "afterDOMReady",
            contentType: "external",
          },
        ],
        css: [
          {
            content: `
.abc-notation {
  margin: 1em 0;
  padding: 1em;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow-x: auto;
  cursor: pointer;
  position: relative;
}

.abc-notation svg {
  max-width: 100%;
  height: auto;
}

.abc-notation.playing {
  background-color: #e8f5e9;
}

.abc-notation::before {
  content: "▶ Click to play";
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  font-size: 0.8em;
  color: #666;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.3em 0.6em;
  border-radius: 3px;
  pointer-events: none;
}

.abc-notation.playing::before {
  content: "⏸ Playing...";
  color: #2e7d32;
}
            `.trim(),
            inline: true,
          },
        ],
        afterDOMLoaded: `
// Initialize abcjs rendering for all ABC notation blocks
(async function() {
  // Wait for ABCJS to be available
  if (typeof ABCJS === 'undefined') {
    console.error('ABCJS library not loaded');
    return;
  }

  // Cache the mml2abc module to avoid duplicate imports
  let mml2abcModule = null;
  
  // Global synth instance for audio playback
  let currentSynth = null;
  let currentPlayingElement = null;
  
  // Shared AudioContext (create once and reuse)
  let sharedAudioContext = null;
  
  // WeakMap to store visual objects for each element
  const visualObjMap = new WeakMap();

  // Process all abc-notation blocks
  const blocks = document.querySelectorAll('.abc-notation');
  
  for (const element of blocks) {
    const type = element.getAttribute('data-type');
    
    try {
      let abcNotation = '';
      
      if (type === 'mml') {
        const mmlData = element.getAttribute('data-mml');
        if (mmlData) {
          // Dynamically import mml2abc ES module from CDN (pinned to specific commit)
          if (!mml2abcModule) {
            mml2abcModule = await import('https://cdn.jsdelivr.net/gh/cat2151/mml2abc@c32f3f36022201547b68d76e0307a62a4c2b173b/dist/mml2abc.mjs');
          }
          abcNotation = mml2abcModule.parse(mmlData);
        }
      } else if (type === 'chord') {
        const chordData = element.getAttribute('data-chord');
        if (chordData) {
          // Dynamically import chord2mml ES module from CDN (pinned to version v0.0.4)
          const chord2mmlModule = await import('https://cdn.jsdelivr.net/gh/cat2151/chord2mml@v0.0.4/dist/chord2mml.mjs');
          const mmlData = chord2mmlModule.parse(chordData);
          // Then convert MML to ABC (reuse cached module)
          if (!mml2abcModule) {
            mml2abcModule = await import('https://cdn.jsdelivr.net/gh/cat2151/mml2abc@c32f3f36022201547b68d76e0307a62a4c2b173b/dist/mml2abc.mjs');
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
        // Render the ABC notation with abcjs
        const visualObj = ABCJS.renderAbc(element, abcNotation, {
          responsive: 'resize',
          staffwidth: 600,
          scale: 1.0
        });
        
        // Store the visual object using WeakMap
        visualObjMap.set(element, visualObj);
        
        // Add click handler for audio playback
        element.addEventListener('click', async function(e) {
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
                visualObj: visualObj[0]
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
                  currentSynth = null;
                }
              };
              
              // Start playback
              currentSynth.start();
              
              // Check playback status with safety limit
              let pollCount = 0;
              const maxPolls = 6000; // Max 10 minutes (6000 * 100ms)
              
              const checkPlaybackStatus = function() {
                pollCount++;
                
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
            }
          } catch (error) {
            console.error('Error playing music:', error);
            element.classList.remove('playing');
            currentPlayingElement = null;
            currentSynth = null;
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
        `.trim(),
      }
    },
  }
}

/**
 * Escape HTML special characters including newlines and whitespace
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

