import type { Rule } from "eslint"
import type * as ESTree from "estree"

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow using `indexOf` finding the first element',
      recommended: true,
    },
    schema: [],
    fixable: 'code',
  },
  create(context) {
    return {
      BinaryExpression(node: ESTree.BinaryExpression) {
        if (node.operator === '===' &&
          node.left.type === 'CallExpression' &&
          node.left.callee.type === 'MemberExpression' &&
          node.left.callee.property.type === 'Identifier' &&
          node.left.callee.property.name === 'indexOf' &&
          node.right.type === 'Literal' &&
          node.right.value === 0) {
              const left = node.left as ESTree.CallExpression;
              const right = node.right as ESTree.Literal;
              const leftCallee = left.callee as ESTree.MemberExpression;
            context.report({
              node,
              message: 'Using `indexOf` to find the first element is not allowed. Use `===` instead.',
              fix: fixer => {
                const sourceCode = context.sourceCode ?? context.getSourceCode();
                const objectText = sourceCode.getText(leftCallee.object);
                return fixer.replaceText(node, `${objectText}[0] === ${right.raw}`);
              }
            });
        }
      }
    };
  }
}

export default rule;

