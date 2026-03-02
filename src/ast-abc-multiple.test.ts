import { describe, it, expect } from 'vitest'
import { MMLABCTransformer } from './index'

// Mock BuildCtx for testing
const mockBuildCtx = {
  allSlugs: [],
  cfg: {},
  argv: {},
}

describe('MMLABCTransformer', () => {
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
})
