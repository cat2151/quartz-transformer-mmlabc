import { describe, it, expect } from 'vitest'
import { MMLABCTransformer } from './index'

// Mock BuildCtx for testing
const mockBuildCtx = {
  allSlugs: [],
  cfg: {},
  argv: {},
}

describe('MMLABCTransformer', () => {
  describe('Plugin initialization', () => {
    it('should create a plugin with default options', () => {
      const plugin = MMLABCTransformer()
      expect(plugin).toBeDefined()
      expect(plugin.name).toBe('MMLABCTransformer')
    })

    it('should have markdownPlugins function', () => {
      const plugin = MMLABCTransformer()
      expect(plugin.markdownPlugins).toBeDefined()
      expect(typeof plugin.markdownPlugins).toBe('function')
    })

    it('should have externalResources function', () => {
      const plugin = MMLABCTransformer()
      expect(plugin.externalResources).toBeDefined()
      expect(typeof plugin.externalResources).toBe('function')
    })

    it('should accept custom options', () => {
      const plugin = MMLABCTransformer({ enableMML: false, enableChord: false })
      expect(plugin).toBeDefined()
      expect(plugin.name).toBe('MMLABCTransformer')
    })

    it('should load browser runtime script from separate file', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)
      
      // Find the inline script resource
      const inlineScript = resources.js?.find(
        js => js.contentType === 'inline' && js.loadTime === 'afterDOMReady'
      )
      
      expect(inlineScript).toBeDefined()
      expect(inlineScript?.script).toBeDefined()
      
      // Verify the script contains expected browser runtime content
      const script = inlineScript?.script || ''
      expect(script).toContain('MML-ABC-Transformer')
      expect(script).toContain('initializeMusicNotation')
      expect(script).toContain('ABCJS')
      expect(script).toContain('visualObjMap')
      
      // Verify it's a non-empty, substantial script (should be ~18KB)
      expect(script.length).toBeGreaterThan(10000)
    })
  })

  describe('External resources', () => {
    it('should include abcjs library from CDN', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      expect(resources.js).toBeDefined()
      expect(resources.js!.length).toBeGreaterThan(0)
      
      const abcjsScript = resources.js!.find(js => js.src?.includes('abcjs'))
      expect(abcjsScript).toBeDefined()
      expect(abcjsScript?.loadTime).toBe('afterDOMReady')
      expect(abcjsScript?.contentType).toBe('external')
    })

    it('should include CSS for abc-notation class', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      expect(resources.css).toBeDefined()
      expect(resources.css!.length).toBeGreaterThan(0)
      
      const css = resources.css![0]
      expect(css.content).toContain('.abc-notation')
      expect(css.inline).toBe(true)
    })

    it('should include inline afterDOMReady script', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      const inlineScript = resources.js!.find(js => js.contentType === 'inline' && js.loadTime === 'afterDOMReady')
      expect(inlineScript).toBeDefined()
      expect(inlineScript?.script).toContain('ABCJS')
      expect(inlineScript?.script).toContain('mml2abc')
      expect(inlineScript?.script).toContain('chord2mml')
      expect(inlineScript?.script).toContain('renderAbc')
    })

    it('should use mml2abc from CDN without version tag', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      const inlineScript = resources.js!.find(js => js.contentType === 'inline')
      expect(inlineScript?.script).toContain('cat2151/mml2abc/dist/mml2abc.mjs')
      expect(inlineScript?.script).not.toContain('mml2abc@')
    })

    it('should use chord2mml from CDN without version tag', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      const inlineScript = resources.js!.find(js => js.contentType === 'inline')
      expect(inlineScript?.script).toContain('cat2151/chord2mml/dist/chord2mml.js')
      expect(inlineScript?.script).not.toContain('chord2mml@')
    })

    it('should include theme detection and switching code', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      const inlineScript = resources.js!.find(js => js.contentType === 'inline')
      expect(inlineScript?.script).toContain('updateNotationTheme')
      expect(inlineScript?.script).toContain('getQuartzTheme')
      expect(inlineScript?.script).toContain('themechange')
      expect(inlineScript?.script).toContain('theme-dark')
      expect(inlineScript?.script).toContain('theme-light')
    })

    it('should not contain TypeScript syntax in inline script', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      const inlineScript = resources.js!.find(js => js.contentType === 'inline')
      
      // Check for TypeScript type annotations that would cause browser errors
      // More comprehensive pattern that matches:
      // - Type assertions: (\w+\s+as\s+[A-Z]\w*[^a-z])
      //   Matches "node as Element" but not "as a" or "as playing" in comments
      //   Requires: word before 'as', capitalized type, and non-lowercase after
      // - Type annotations: :\s*(string|number|boolean|any|void|Element|Node|[A-Z]\w*)\s*(\)|;|=|,)
      //   Matches variable, parameter, and return type annotations
      //   Examples: "const x: string =", "(param: number)", "function(): void;"
      // Note: Uses word boundaries and character class checks to avoid false positives
      const typeAnnotationPattern = /(\w+\s+as\s+[A-Z]\w*[^a-z])|:\s*(string|number|boolean|any|void|Element|Node|[A-Z]\w*)\s*(\)|;|=|,)/
      
      expect(inlineScript?.script).toBeDefined()
      expect(typeAnnotationPattern.test(inlineScript!.script!)).toBe(false)
      
      // Specifically check for the problematic patterns from issues
      expect(inlineScript?.script).not.toContain('(source: string)')
      expect(inlineScript?.script).not.toContain('as Element')
    })

    it('should include dynamic theme classes in CSS', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      const css = resources.css![0]
      expect(css.content).toContain('.abc-notation.theme-dark')
      expect(css.content).toContain('.abc-notation.theme-light')
      expect(css.content).toContain('Dynamic theme classes')
    })

    it('should include MutationObserver for popup support', () => {
      const plugin = MMLABCTransformer()
      const resources = plugin.externalResources!(mockBuildCtx)

      const inlineScript = resources.js?.find(
        js => js.contentType === 'inline' && js.loadTime === 'afterDOMReady'
      )
      const script = inlineScript?.script || ''

      // MutationObserver should be present and actively observing Quartz popups (Issue #81)
      // Ensure a MutationObserver instance is created
      expect(script).toContain('new MutationObserver')
      // Ensure it observes document.body
      expect(script).toContain('.observe(document.body')
      // Ensure observe options include childList/subtree so popup changes are detected
      expect(script).toContain('childList')
      expect(script).toContain('subtree')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty MML code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: ''
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-mml=""')
    })

    it('should handle code blocks without lang property', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            value: 'no language'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('code')
    })

    it('should handle complex MML with all special characters', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const complexMml = 't120 l4\ncdefg<ab>c\n& "test" \'quote\'\r\n\ttab'
      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: complexMml
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&lt;')
      expect(tree.children[0].value).toContain('&gt;')
      expect(tree.children[0].value).toContain('&amp;')
      expect(tree.children[0].value).toContain('&quot;')
      expect(tree.children[0].value).toContain('&#039;')
      expect(tree.children[0].value).toContain('&#10;')
      expect(tree.children[0].value).toContain('&#13;')
      expect(tree.children[0].value).toContain('&#9;')
    })
  })
})
