import type { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
		type: 'problem',
		docs: {
			description: 'Disallow using `startsWith` with a single character',
			recommended: true,
		},
		schema: [],
	},
	create(context) {
		return {
			CallExpression(node) {
				if (node.callee.type === 'MemberExpression' &&
					node.callee.property.name === 'startsWith' &&
					(node.callee.object.type === 'Literal' || node.callee.object.type === 'TemplateLiteral' || node.callee.object.type === 'Identifier') &&
					node.arguments[0].type === 'Literal' &&
					String(node.arguments[0].value)?.length === 1) {
						context.report({
						node,
						message: 'Using `startsWith` with a single character is not allowed.',
					});
				}
			}
		};
	}
}

export default rule;
