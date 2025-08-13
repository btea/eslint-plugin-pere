import { RuleTester } from 'eslint'
import { describe, it, expect } from 'vitest'
import plugin from '../src/index'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

describe('eslint-plugin-pere integration', () => {
  it('should export all rules correctly', () => {
    expect(plugin.rules).toBeDefined()
    expect(plugin.rules['no-startswith-one-char']).toBeDefined()
    expect(plugin.rules['no-indexof-match-zero']).toBeDefined()
    expect(plugin.rules['duplicate-constructor']).toBeDefined()
  })

  it('should have correct meta information', () => {
    expect(plugin.meta).toBeDefined()
    expect(plugin.meta.name).toBe('pere')
    expect(plugin.meta.version).toBeDefined()
  })

  it('should run multiple rules together', () => {
    // Test that multiple rules can be applied to the same code
    const code = `
      for (let i = 0; i < 10; i++) {
        const arr = [1, 2, 3];
        if (str.startsWith("a")) {
          console.log("starts with a");
        }
        if (str.indexOf("b") === 0) {
          console.log("starts with b");
        }
      }
    `

    // Test no-startswith-one-char rule
    ruleTester.run('integration-no-startswith-one-char', plugin.rules['no-startswith-one-char'], {
      valid: [],
      invalid: [{
        code,
        errors: [{
          message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
          type: 'CallExpression'
        }]
      }]
    })

    // Test no-indexof-match-zero rule
    ruleTester.run('integration-no-indexof-match-zero', plugin.rules['no-indexof-match-zero'], {
      valid: [],
      invalid: [{
        code,
        errors: [{
          message: 'Using `indexOf` to find the first element is not allowed.',
          type: 'BinaryExpression'
        }]
      }]
    })

    // Test duplicate-constructor rule
    ruleTester.run('integration-duplicate-constructor', plugin.rules['duplicate-constructor'], {
      valid: [],
      invalid: [{
        code,
        errors: [{
          message: "Repetitive construction of 'Array' detected.",
          type: 'VariableDeclarator'
        }]
      }]
    })
  })

  describe('real-world examples', () => {
    it('should handle complex scenarios', () => {
      const complexCode = `
        function processItems(items) {
          const results = [];

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const config = { processed: true, index: i }; // Should trigger duplicate-constructor

            if (item.name.startsWith("A")) { // Should trigger no-startswith-one-char
              config.priority = "high";
            }

            if (item.description.indexOf("!") === 0) { // Should trigger no-indexof-match-zero
              config.urgent = true;
            }

            results.push(config);
          }

          return results;
        }
      `

      // Test each rule individually
      ruleTester.run('complex-no-startswith-one-char', plugin.rules['no-startswith-one-char'], {
        valid: [],
        invalid: [{
          code: complexCode,
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'CallExpression'
          }]
        }]
      })

      ruleTester.run('complex-no-indexof-match-zero', plugin.rules['no-indexof-match-zero'], {
        valid: [],
        invalid: [{
          code: complexCode,
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }]
        }]
      })

      ruleTester.run('complex-duplicate-constructor', plugin.rules['duplicate-constructor'], {
        valid: [],
        invalid: [{
          code: complexCode,
          errors: [{
            message: "Repetitive construction of 'Object' detected.",
            type: 'VariableDeclarator'
          }]
        }]
      })
    })

    it('should handle optimized code correctly', () => {
      const optimizedCode = `
        function processItemsOptimized(items) {
          const results = [];
          const defaultConfig = { processed: true }; // Moved outside loop

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const config = { ...defaultConfig, index: i };

            if (item.name[0] === "A") { // Optimized
              config.priority = "high";
            }

            if (item.description[0] === "!") { // Optimized
              config.urgent = true;
            }

            results.push(config);
          }

          return results;
        }
      `

      // These should not trigger any rules
      ruleTester.run('optimized-no-startswith-one-char', plugin.rules['no-startswith-one-char'], {
        valid: [{ code: optimizedCode }],
        invalid: []
      })

      ruleTester.run('optimized-no-indexof-match-zero', plugin.rules['no-indexof-match-zero'], {
        valid: [{ code: optimizedCode }],
        invalid: []
      })

      // This should still trigger because we're creating objects in loop
      ruleTester.run('optimized-duplicate-constructor', plugin.rules['duplicate-constructor'], {
        valid: [],
        invalid: [{
          code: optimizedCode,
          errors: [{
            message: "Repetitive construction of 'Object' detected.",
            type: 'VariableDeclarator'
          }]
        }]
      })
    })
  })
})
