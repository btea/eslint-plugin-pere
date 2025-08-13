import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import noIndexOfMatchZero from '../src/rules/no-indexof-match-zero'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

describe('no-indexof-match-zero', () => {
  it('should pass all tests', () => {
    ruleTester.run('no-indexof-match-zero', noIndexOfMatchZero, {
      valid: [
        // Different comparison values (should not trigger)
        {
          code: 'str.indexOf("a") === 1',
          name: 'indexOf equals 1'
        },
        {
          code: 'str.indexOf("hello") === 0',
          name: 'indexOf with multi-character string'
        },
        {
          code: 'str.indexOf("a") === -1',
          name: 'indexOf equals -1'
        },
        {
          code: 'str.indexOf("a") !== 0',
          name: 'indexOf not equals 0'
        },
        {
          code: 'str.indexOf("a") > 0',
          name: 'indexOf greater than 0'
        },
        {
          code: 'str.indexOf("a") >= 0',
          name: 'indexOf greater than or equal 0'
        },
        {
          code: 'str.indexOf("a") < 0',
          name: 'indexOf less than 0'
        },
        // Different operators (should not trigger)
        {
          code: 'str.indexOf("a") == 0',
          name: 'Loose equality'
        },
        {
          code: '0 === str.indexOf("a")',
          name: 'Reversed operands'
        },
        // Different methods (should not trigger)
        {
          code: 'str.lastIndexOf("a") === 0',
          name: 'lastIndexOf method'
        },
        {
          code: 'str.search("a") === 0',
          name: 'search method'
        },
        {
          code: 'str.includes("a")',
          name: 'includes method'
        },
        // Non-literal search values (should not trigger)
        {
          code: 'str.indexOf(variable) === 0',
          name: 'Variable search value'
        },
        {
          code: 'str.indexOf(obj.prop) === 0',
          name: 'Property search value'
        },
        // Already optimized patterns (should not trigger)
        {
          code: 'str[0] === "a"',
          name: 'Already optimized'
        },
        {
          code: 'str.startsWith("a")',
          name: 'Using startsWith'
        },
      ],

      invalid: [
        // Basic indexOf cases
        {
          code: 'str.indexOf("a") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'str[0] === "a"',
          name: 'Basic indexOf single character'
        },
        {
          code: 'str.indexOf("x") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'str[0] === "x"',
          name: 'Different single character'
        },
        {
          code: 'str.indexOf("-") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'str[0] === "-"',
          name: 'Special character dash'
        },
        {
          code: 'str.indexOf("+") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'str[0] === "+"',
          name: 'Special character plus'
        },
        {
          code: 'str.indexOf("_") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'str[0] === "_"',
          name: 'Underscore character'
        },

        // Complex object access
        {
          code: 'obj.prop.indexOf("a") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'obj.prop[0] === "a"',
          name: 'Object property access'
        },
        {
          code: 'this.name.indexOf("A") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'this.name[0] === "A"',
          name: 'This property access'
        },
        {
          code: 'array[0].indexOf("b") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'array[0][0] === "b"',
          name: 'Array element access'
        },

        // Function call results
        {
          code: 'getName().indexOf("J") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'getName()[0] === "J"',
          name: 'Function call result'
        },
        {
          code: 'getTitle().indexOf("T") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'getTitle()[0] === "T"',
          name: 'Function call result with different character'
        },

        // Numeric strings
        {
          code: 'str.indexOf("1") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'str[0] === "1"',
          name: 'Numeric character'
        },
        {
          code: 'str.indexOf("0") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'str[0] === "0"',
          name: 'Zero character'
        },

        // Different quote styles
        {
          code: "str.indexOf('a') === 0",
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: "str[0] === 'a'",
          name: 'Single quotes'
        },

        // Unicode characters
        {
          code: 'str.indexOf("€") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'str[0] === "€"',
          name: 'Unicode character'
        },
        {
          code: 'str.indexOf("中") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'str[0] === "中"',
          name: 'Chinese character'
        },

        // Whitespace characters
        {
          code: 'str.indexOf(" ") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'str[0] === " "',
          name: 'Space character'
        },
        {
          code: 'str.indexOf("\\t") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'str[0] === "\\t"',
          name: 'Tab character'
        },
        {
          code: 'str.indexOf("\\n") === 0',
          errors: [{
            message: 'Using `indexOf` to find the first element is not allowed.',
            type: 'BinaryExpression'
          }],
          output: 'str[0] === "\\n"',
          name: 'Newline character'
        },
      ]
    })
  })
})
