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
}

.abc-notation svg {
  max-width: 100%;
  height: auto;
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
  let mml2abcModule: any = null;

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
        ABCJS.renderAbc(element, abcNotation, {
          responsive: 'resize',
          staffwidth: 600,
          scale: 1.0
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

