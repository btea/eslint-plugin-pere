import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import noStartswithOneChar from '../src/rules/no-startswith-one-char'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

describe('no-startswith-one-char', () => {
  it('should pass all tests', () => {
    ruleTester.run('no-startswith-one-char', noStartswithOneChar, {
      valid: [
        // Multi-character strings (should not trigger)
        {
          code: 'str.startsWith("hello")',
          name: 'Multi-character string'
        },
        {
          code: 'str.startsWith("ab")',
          name: 'Two character string'
        },
        {
          code: '!str.startsWith("hello")',
          name: 'Negated multi-character string'
        },
        // Empty string (should not trigger)
        {
          code: 'str.startsWith("")',
          name: 'Empty string'
        },
        // Non-literal arguments (should not trigger)
        {
          code: 'str.startsWith(variable)',
          name: 'Variable argument'
        },
        {
          code: 'str.startsWith(obj.prop)',
          name: 'Property argument'
        },
        // Different method names (should not trigger)
        {
          code: 'str.endsWith("a")',
          name: 'Different method'
        },
        {
          code: 'str.includes("a")',
          name: 'Different method includes'
        },
        // Already optimized patterns (should not trigger)
        {
          code: 'str[0] === "a"',
          name: 'Already optimized comparison'
        },
        {
          code: 'str[0] !== "a"',
          name: 'Already optimized negated comparison'
        },
      ],

      invalid: [
        // Basic single character cases
        {
          code: 'str.startsWith("a")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'CallExpression'
          }],
          output: 'str[0] === "a"',
          name: 'Single character string'
        },
        {
          code: 'str.startsWith("x")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'CallExpression'
          }],
          output: 'str[0] === "x"',
          name: 'Different single character'
        },
        {
          code: 'str.startsWith("-")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'CallExpression'
          }],
          output: 'str[0] === "-"',
          name: 'Special character dash'
        },
        {
          code: 'str.startsWith("+")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'CallExpression'
          }],
          output: 'str[0] === "+"',
          name: 'Special character plus'
        },
        {
          code: 'str.startsWith("_")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'CallExpression'
          }],
          output: 'str[0] === "_"',
          name: 'Underscore character'
        },

        // Negated cases
        {
          code: '!str.startsWith("a")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'UnaryExpression'
          }],
          output: 'str[0] !== "a"',
          name: 'Negated single character'
        },
        {
          code: '!str.startsWith("-")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'UnaryExpression'
          }],
          output: 'str[0] !== "-"',
          name: 'Negated special character'
        },

        // Complex object access
        {
          code: 'obj.prop.startsWith("a")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'CallExpression'
          }],
          output: 'obj.prop[0] === "a"',
          name: 'Object property access'
        },
        {
          code: 'this.name.startsWith("A")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'CallExpression'
          }],
          output: 'this.name[0] === "A"',
          name: 'This property access'
        },
        {
          code: 'array[0].startsWith("b")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'CallExpression'
          }],
          output: 'array[0][0] === "b"',
          name: 'Array element access'
        },

        // Negated complex cases
        {
          code: '!obj.prop.startsWith("a")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'UnaryExpression'
          }],
          output: 'obj.prop[0] !== "a"',
          name: 'Negated object property'
        },
        {
          code: '!this.name.startsWith("A")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'UnaryExpression'
          }],
          output: 'this.name[0] !== "A"',
          name: 'Negated this property'
        },

        // Function call results
        {
          code: 'getName().startsWith("J")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'CallExpression'
          }],
          output: 'getName()[0] === "J"',
          name: 'Function call result'
        },
        {
          code: '!getTitle().startsWith("T")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'UnaryExpression'
          }],
          output: 'getTitle()[0] !== "T"',
          name: 'Negated function call result'
        },

        // Numeric strings
        {
          code: 'str.startsWith("1")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'CallExpression'
          }],
          output: 'str[0] === "1"',
          name: 'Numeric character'
        },
        {
          code: 'str.startsWith("0")',
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'CallExpression'
          }],
          output: 'str[0] === "0"',
          name: 'Zero character'
        },

        // Special characters with quotes
        {
          code: "str.startsWith('a')",
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'CallExpression'
          }],
          output: "str[0] === 'a'",
          name: 'Single quotes'
        },
        {
          code: "!str.startsWith('a')",
          errors: [{
            message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
            type: 'UnaryExpression'
          }],
          output: "str[0] !== 'a'",
          name: 'Negated single quotes'
        },
      ]
    })
  })
})
