import type { Rule } from "eslint";

// for (let i = 0; i < 10; i++) {
//  1、const a = /a/
//  2、/a/.test('a) 'a'.replace(/a/, 'b')
//  3、const v = new Date() / new Object() / new Map() / new Set() / new WeakMap() / new WeakSet() / new Array() ...
//  4、[1, 2, 3].includes(1)
// }

const rule: Rule.RuleModule = {
  meta: {
		type: 'problem',
		docs: {
			description: 'Prohibit repeatedly building the same instance within the loop',
			recommended: true,
		},
		schema: [],
	},
	create(context) {
    const isLiteral = (node: Rule.Node) => {
      return node.type === 'Literal';
    }
    const isInLoop = (node: Rule.Node): boolean => {
      if (!node.parent) {
        return false;
      }
      if (['ForStatement', 'WhileStatement', 'DoWhileStatement', 'ForInStatement', 'ForOfStatement'].includes(node.parent.type)) {
        return true;
      }
      return isInLoop(node.parent);
    }
		return {
      CallExpression(node) {
        if (node.callee.type === 'NewExpression' && node.callee.callee.type === 'Identifier') {
          const args = node.arguments;
          if (args.length === 0) {
            return; // Skip if no arguments are provided
          }
          if (args.every(() => {
            // @ts-expect-error
            return isLiteral(args[0]);
          }) && isInLoop(node)) {
            const className = node.callee.callee.name;
            context.report({
              node,
              message: `Repetitive construction of '${className}' detected.`,
            });
          }
        }
      },
    };
	}
}

export default rule;
