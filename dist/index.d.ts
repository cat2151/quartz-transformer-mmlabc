import type { Pluggable } from "unified";
interface BuildCtx {
    allSlugs: string[];
    cfg: Record<string, any>;
    argv: Record<string, any>;
}
interface QuartzTransformerPluginInstance {
    name: string;
    textTransform?: (ctx: BuildCtx, src: string) => string;
    markdownPlugins?: (ctx: BuildCtx) => Pluggable[];
    htmlPlugins?: (ctx: BuildCtx) => Pluggable[];
    externalResources?: (ctx: BuildCtx) => Partial<StaticResources>;
}
interface StaticResources {
    css: Array<{
        content?: string;
        src?: string;
        inline?: boolean;
    }>;
    js: Array<{
        src?: string;
        loadTime?: "beforeDOMReady" | "afterDOMReady";
        contentType?: "external" | "inline";
        script?: string;
    }>;
}
type QuartzTransformerPlugin<T = undefined> = (opts?: T) => QuartzTransformerPluginInstance;
/**
 * Options for MMLABCTransformer plugin
 */
interface MMLABCOptions {
    /** Enable transformation of MML code blocks (default: true) */
    enableMML?: boolean;
    /** Enable transformation of chord code blocks (default: true) */
    enableChord?: boolean;
    /** Enable transformation of ABC code blocks (default: true) */
    enableABC?: boolean;
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
export declare const MMLABCTransformer: QuartzTransformerPlugin<MMLABCOptions | undefined>;
export {};
