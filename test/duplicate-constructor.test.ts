import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import duplicateConstructor from '../src/rules/duplicate-constructor'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

describe('duplicate-constructor', () => {
  it('should pass all tests', () => {
    ruleTester.run('duplicate-constructor', duplicateConstructor, {
      valid: [
        // Outside of loops (should not trigger)
        {
          code: `
            const arr = [1, 2, 3];
            const obj = { a: 1, b: 2 };
            const date = new Date();
          `,
          name: 'Outside loop - literals'
        },
        {
          code: `
            function test() {
              const arr = [1, 2, 3];
              const obj = { a: 1, b: 2 };
            }
          `,
          name: 'Inside function but not loop'
        },

        // Dynamic values (should not trigger)
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const arr = [i, i + 1];
            }
          `,
          name: 'Array with dynamic values'
        },
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const obj = { key: variable, value: i };
            }
          `,
          name: 'Object with dynamic values'
        },
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const date = new Date(timestamp);
            }
          `,
          name: 'Constructor with dynamic arguments'
        },

        // Empty collections (should not trigger)
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const arr = [];
            }
          `,
          name: 'Empty array in loop'
        },
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const obj = {};
            }
          `,
          name: 'Empty object in loop'
        },

        // Pre-defined variables (should not trigger)
        {
          code: `
            const arr = [1, 2, 3];
            for (let i = 0; i < 10; i++) {
              arr.push(i);
            }
          `,
          name: 'Using pre-defined array'
        },
        {
          code: `
            const obj = { a: 1 };
            for (let i = 0; i < 10; i++) {
              obj.b = i;
            }
          `,
          name: 'Using pre-defined object'
        },

        // Different loop types without issues
        {
          code: `
            while (condition) {
              doSomething(variable);
            }
          `,
          name: 'While loop without constructors'
        },
        {
          code: `
            for (const item of items) {
              console.log(item);
            }
          `,
          name: 'For-of loop without constructors'
        },
      ],

      invalid: [
        // Array literals in loops
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const arr = [1, 2, 3];
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Array' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Array literal in for loop'
        },
        {
          code: `
            while (condition) {
              const numbers = [1, 2, 3, 4, 5];
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Array' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Array literal in while loop'
        },
        {
          code: `
            do {
              const items = ["a", "b", "c"];
            } while (condition);
          `,
          errors: [{
            message: "Repetitive construction of 'Array' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Array literal in do-while loop'
        },
        {
          code: `
            for (const key in obj) {
              const arr = [1, 2];
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Array' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Array literal in for-in loop'
        },
        {
          code: `
            for (const item of items) {
              const arr = ["x", "y"];
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Array' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Array literal in for-of loop'
        },

        // Object literals in loops
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const obj = { a: 1, b: 2 };
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Object' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Object literal in for loop'
        },
        {
          code: `
            while (condition) {
              const config = { x: 10, y: 20, z: 30 };
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Object' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Object literal in while loop'
        },
        {
          code: `
            for (const item of items) {
              const settings = { enabled: true, count: 5 };
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Object' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Object literal in for-of loop'
        },

        // Mixed numeric and string values
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const mixed = [1, "two", 3, "four"];
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Array' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Mixed type array literal'
        },
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const data = { id: 1, name: "test", active: true };
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Object' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Mixed type object literal'
        },

        // Nested loops
        {
          code: `
            for (let i = 0; i < 10; i++) {
              for (let j = 0; j < 5; j++) {
                const arr = [1, 2, 3];
              }
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Array' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Array in nested loop'
        },
        {
          code: `
            for (let i = 0; i < 10; i++) {
              for (let j = 0; j < 5; j++) {
                const obj = { x: 1, y: 2 };
              }
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Object' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Object in nested loop'
        },

        // Array method calls on literals
        {
          code: `
            for (let i = 0; i < 10; i++) {
              [1, 2, 3].forEach(callback);
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Array' detected.",
            type: 'CallExpression'
          }],
          name: 'Array method call on literal'
        },
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const result = [1, 2, 3].map(x => x * 2);
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Array' detected.",
            type: 'CallExpression'
          }],
          name: 'Array map on literal'
        },
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const filtered = ["a", "b", "c"].filter(x => x !== "b");
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Array' detected.",
            type: 'CallExpression'
          }],
          name: 'Array filter on literal'
        },

        // Object method calls on literals
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const keys = { a: 1, b: 2 }.hasOwnProperty("a");
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Object' detected.",
            type: 'CallExpression'
          }],
          name: 'Object method call on literal'
        },

        // Different literal types
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const booleans = [true, false, true];
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Array' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Boolean array literal'
        },
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const nulls = [null, null];
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Array' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Null array literal'
        },
        {
          code: `
            for (let i = 0; i < 10; i++) {
              const config = { debug: false, timeout: null };
            }
          `,
          errors: [{
            message: "Repetitive construction of 'Object' detected.",
            type: 'VariableDeclarator'
          }],
          name: 'Object with boolean and null'
        },
      ]
    })
  })
})
