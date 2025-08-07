import type { Rule } from "eslint"

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow using `indexOf` finding the first element',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      BinaryExpression(node) {
        if (node.operator === '===' &&
            node.left.type === 'CallExpression' &&
            node.left.callee.type === 'MemberExpression' &&
            node.left.callee.property.name === 'indexOf' &&
            node.callee.right.type === 'Literal' &&
            node.callee.right.value === 0) {
          context.report({
            node,
            message: 'Using `indexOf` to find the first element is not allowed.',
          });
        }
      }
    };
  }
}

export default rule;

