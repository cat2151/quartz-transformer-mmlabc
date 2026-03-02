import { describe, it, expect } from 'vitest'
import { MMLABCTransformer } from './index'

// Mock BuildCtx for testing
const mockBuildCtx = {
  allSlugs: [],
  cfg: {},
  argv: {},
}

describe('MMLABCTransformer', () => {
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
})
