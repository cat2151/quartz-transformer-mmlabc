"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMLABCTransformer = void 0;
const unist_util_visit_1 = require("unist-util-visit");
const fs_1 = require("fs");
const path_1 = require("path");
const defaultOptions = {
    enableMML: true,
    enableChord: true,
    enableABC: true,
};
/**
 * Load the browser runtime script from the separate JavaScript file.
 * This separation follows the single responsibility principle:
 * - index.ts: Build-time AST transformation (TypeScript)
 * - browser-runtime.js: Browser-side rendering logic (JavaScript)
 *
 * @throws {Error} If the browser-runtime.js file cannot be found
 */
function loadBrowserRuntime() {
    // For CommonJS build (tsc compiles to CommonJS by default)
    const scriptPath = (0, path_1.join)(__dirname, 'browser-runtime.js');
    return (0, fs_1.readFileSync)(scriptPath, 'utf-8');
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
const MMLABCTransformer = (userOpts) => {
    const opts = { ...defaultOptions, ...userOpts };
    return {
        name: "MMLABCTransformer",
        markdownPlugins(_ctx) {
            return [
                () => {
                    return (tree, _file) => {
                        (0, unist_util_visit_1.visit)(tree, "code", (node) => {
                            const lang = node.lang?.toLowerCase();
                            // Handle MML blocks - replace with HTML that will be processed in browser
                            if (opts.enableMML && lang === "mml") {
                                const mmlCode = node.value;
                                // Replace the code block with an HTML block containing the MML data
                                node.type = "html";
                                node.value = `<div class="abc-notation mml-block" data-mml="${escapeHtml(mmlCode)}" data-type="mml" role="button" tabindex="0" aria-label="Play music notation"></div>`;
                                delete node.lang;
                            }
                            // Handle chord blocks - replace with HTML that will be processed in browser
                            if (opts.enableChord && lang === "chord") {
                                const chordCode = node.value;
                                // Replace the code block with an HTML block containing the chord data
                                node.type = "html";
                                node.value = `<div class="abc-notation chord-block" data-chord="${escapeHtml(chordCode)}" data-type="chord" role="button" tabindex="0" aria-label="Play music notation"></div>`;
                                delete node.lang;
                            }
                            // Handle ABC blocks - replace with HTML that will be processed in browser
                            if (opts.enableABC && lang === "abc") {
                                const abcCode = node.value;
                                // Replace the code block with an HTML block containing the ABC data
                                node.type = "html";
                                node.value = `<div class="abc-notation abc-block" data-abc="${escapeHtml(abcCode)}" data-type="abc" role="button" tabindex="0" aria-label="Play music notation"></div>`;
                                delete node.lang;
                            }
                        });
                    };
                },
            ];
        },
        externalResources(_ctx) {
            return {
                js: [
                    {
                        src: "https://cdn.jsdelivr.net/npm/abcjs@6/dist/abcjs-basic-min.min.js",
                        loadTime: "afterDOMReady",
                        contentType: "external",
                    },
                    {
                        // Browser runtime script loaded from separate file
                        // This separation follows the single responsibility principle to prevent
                        // TypeScript/JavaScript mixing errors
                        loadTime: "afterDOMReady",
                        contentType: "inline",
                        script: loadBrowserRuntime(),
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
            };
        },
    };
};
exports.MMLABCTransformer = MMLABCTransformer;
/**
 * Escape HTML special characters including newlines and whitespace
 * to prevent XSS vulnerabilities and ensure proper data attribute encoding
 */
function escapeHtml(text) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
        "\n": "&#10;",
        "\r": "&#13;",
        "\t": "&#9;",
    };
    return text.replace(/[&<>"'\n\r\t]/g, (m) => map[m]);
}
