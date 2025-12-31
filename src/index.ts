import { visit } from "unist-util-visit"

// Type definitions for Quartz plugin interface
interface BuildCtx {
  allSlugs: string[]
  cfg: any
  argv: any
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
}

const defaultOptions: MMLABCOptions = {
  enableMML: true,
  enableChord: true,
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

              // Handle MML blocks
              if (opts.enableMML && lang === "mml") {
                const mmlCode = node.value as string
                try {
                  // Lazy load mml2abc
                  const mml2abc = require("mml2abc")
                  const abcNotation = mml2abc(mmlCode)

                  // Replace the code block with an HTML block containing abcjs rendering
                  node.type = "html"
                  node.value = `<div class="abc-notation mml-block" data-abc="${escapeHtml(
                    abcNotation,
                  )}"></div>`
                  delete node.lang
                } catch (error) {
                  console.error("Error converting MML to ABC:", error)
                  // Keep original code block on error
                }
              }

              // Handle chord blocks
              if (opts.enableChord && lang === "chord") {
                const chordCode = node.value as string
                try {
                  // Lazy load chord2mml and mml2abc
                  const chord2mml = require("chord2mml")
                  const mml2abc = require("mml2abc")

                  // Convert chord -> MML -> ABC
                  const mmlCode = chord2mml(chordCode)
                  const abcNotation = mml2abc(mmlCode)

                  // Replace the code block with an HTML block containing abcjs rendering
                  node.type = "html"
                  node.value = `<div class="abc-notation chord-block" data-abc="${escapeHtml(
                    abcNotation,
                  )}"></div>`
                  delete node.lang
                } catch (error) {
                  console.error("Error converting Chord to ABC:", error)
                  // Keep original code block on error
                }
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
if (typeof ABCJS !== 'undefined') {
  document.querySelectorAll('.abc-notation').forEach(function(element) {
    const abcData = element.getAttribute('data-abc');
    if (abcData) {
      try {
        ABCJS.renderAbc(element, abcData, {
          responsive: 'resize',
          staffwidth: 600,
          scale: 1.0
        });
      } catch (error) {
        console.error('Error rendering ABC notation:', error);
        element.textContent = 'Error rendering music notation';
      }
    }
  });
}
        `.trim(),
      }
    },
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
