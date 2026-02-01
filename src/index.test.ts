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

  describe('AST transformation - MML blocks', () => {
    it('should transform MML code blocks to HTML', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 't120 l4 cdefgab>c'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('class="abc-notation mml-block"')
      expect(tree.children[0].value).toContain('data-mml=')
      expect(tree.children[0].value).toContain('data-type="mml"')
      expect(tree.children[0].value).toContain('t120 l4 cdefgab&gt;c')
    })

    it('should escape HTML special characters in MML code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: '<script>alert("xss")</script>'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&lt;script&gt;')
      expect(tree.children[0].value).toContain('&quot;xss&quot;')
      expect(tree.children[0].value).not.toContain('<script>')
    })

    it('should escape newlines in MML code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 'line1\nline2\nline3'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&#10;')
      expect(tree.children[0].value).toMatch(/data-mml="[^"]*&#10;[^"]*"/)
    })

    it('should escape tabs and carriage returns in MML code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 'tab\there\rcarriage'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&#9;')
      expect(tree.children[0].value).toContain('&#13;')
    })

    it('should escape ampersands and quotes in MML code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 'test & "quote" \'single\''
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&amp;')
      expect(tree.children[0].value).toContain('&quot;')
      expect(tree.children[0].value).toContain('&#039;')
    })

    it('should handle case-insensitive language tags', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'MML',
            value: 't120 l4 c'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-type="mml"')
    })

    it('should include ARIA attributes for accessibility', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 't120 l4 c'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('role="button"')
      expect(tree.children[0].value).toContain('tabindex="0"')
      expect(tree.children[0].value).toContain('aria-label="Play music notation"')
    })

    it('should not transform MML blocks when enableMML is false', () => {
      const plugin = MMLABCTransformer({ enableMML: false })
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 't120 l4 cdefgab>c'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('code')
      expect(tree.children[0].lang).toBe('mml')
    })
  })

  describe('AST transformation - Chord blocks', () => {
    it('should transform chord blocks to HTML', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'chord',
            value: 'C Dm7 G7 C'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('class="abc-notation chord-block"')
      expect(tree.children[0].value).toContain('data-chord=')
      expect(tree.children[0].value).toContain('data-type="chord"')
      expect(tree.children[0].value).toContain('C Dm7 G7 C')
    })

    it('should escape HTML special characters in chord code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'chord',
            value: 'C<maj7> D&m "test"'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&lt;maj7&gt;')
      expect(tree.children[0].value).toContain('&amp;m')
      expect(tree.children[0].value).toContain('&quot;test&quot;')
    })

    it('should handle case-insensitive chord language tags', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'CHORD',
            value: 'C Am F G'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-type="chord"')
    })

    it('should not transform chord blocks when enableChord is false', () => {
      const plugin = MMLABCTransformer({ enableChord: false })
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'chord',
            value: 'C Dm7 G7 C'
          }
        ]
      }

      transformer(tree, null)

      // Chord blocks should remain as code blocks when enableChord is false
      expect(tree.children[0].type).toBe('code')
      expect(tree.children[0].lang).toBe('chord')
    })

    it('should not process chord blocks when enableChord is false', () => {
      const plugin = MMLABCTransformer({ enableChord: false })
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'chord',
            value: 'C Dm7 G7 C'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('code')
      expect(tree.children[0].lang).toBe('chord')
    })

    it('should handle empty chord code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'chord',
            value: ''
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-chord=""')
    })

    it('should escape newlines in chord code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'chord',
            value: 'C Am\nF G\nC'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&#10;')
    })
  })

  describe('AST transformation - ABC blocks', () => {
    it('should transform ABC blocks to HTML', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'abc',
            value: 'X:1\nT:Simple Scale\nM:4/4\nL:1/4\nK:C\nC D E F|G A B c|'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('class="abc-notation abc-block"')
      expect(tree.children[0].value).toContain('data-abc=')
      expect(tree.children[0].value).toContain('data-type="abc"')
    })

    it('should escape HTML special characters in ABC code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'abc',
            value: 'X:1\nT:Test<Title>\nK:C\n"C"cdef|'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&lt;Title&gt;')
      expect(tree.children[0].value).toContain('&quot;C&quot;')
    })

    it('should escape newlines in ABC code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'abc',
            value: 'X:1\nT:Title\nM:4/4\nK:C'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('&#10;')
    })

    it('should handle case-insensitive ABC language tags', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'ABC',
            value: 'X:1\nK:C\ncdef|'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-type="abc"')
    })

    it('should not transform ABC blocks when enableABC is false', () => {
      const plugin = MMLABCTransformer({ enableABC: false })
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'abc',
            value: 'X:1\nK:C\ncdef|'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('code')
      expect(tree.children[0].lang).toBe('abc')
    })

    it('should handle empty ABC code', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'abc',
            value: ''
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-abc=""')
    })
  })

  describe('AST transformation - Multiple blocks', () => {
    it('should transform multiple MML blocks in the same tree', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 't120 l4 c'
          },
          {
            type: 'code',
            lang: 'mml',
            value: 't140 l8 defg'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('t120 l4 c')
      expect(tree.children[1].type).toBe('html')
      expect(tree.children[1].value).toContain('t140 l8 defg')
    })

    it('should transform multiple chord blocks in the same tree', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'chord',
            value: 'C Am F G'
          },
          {
            type: 'code',
            lang: 'chord',
            value: 'Dm7 G7 Cmaj7'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('C Am F G')
      expect(tree.children[1].type).toBe('html')
      expect(tree.children[1].value).toContain('Dm7 G7 Cmaj7')
    })

    it('should transform both MML and chord blocks in the same tree', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 't120 l4 c'
          },
          {
            type: 'code',
            lang: 'chord',
            value: 'C Am F G'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-type="mml"')
      expect(tree.children[1].type).toBe('html')
      expect(tree.children[1].value).toContain('data-type="chord"')
    })

    it('should transform MML, chord, and ABC blocks in the same tree', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'mml',
            value: 't120 l4 c'
          },
          {
            type: 'code',
            lang: 'chord',
            value: 'C Am F G'
          },
          {
            type: 'code',
            lang: 'abc',
            value: 'X:1\nK:C\ncdef|'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('html')
      expect(tree.children[0].value).toContain('data-type="mml"')
      expect(tree.children[1].type).toBe('html')
      expect(tree.children[1].value).toContain('data-type="chord"')
      expect(tree.children[2].type).toBe('html')
      expect(tree.children[2].value).toContain('data-type="abc"')
    })

    it('should not transform non-MML code blocks', () => {
      const plugin = MMLABCTransformer()
      const markdownPlugins = plugin.markdownPlugins!(mockBuildCtx)
      const transformer = markdownPlugins[0]()

      const tree = {
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'javascript',
            value: 'console.log("hello")'
          },
          {
            type: 'code',
            lang: 'mml',
            value: 't120 l4 c'
          }
        ]
      }

      transformer(tree, null)

      expect(tree.children[0].type).toBe('code')
      expect(tree.children[0].lang).toBe('javascript')
      expect(tree.children[1].type).toBe('html')
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
