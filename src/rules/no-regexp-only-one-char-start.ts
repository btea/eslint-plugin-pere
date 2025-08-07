import type { Rule } from "eslint"

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow using only one character starting with `RegExp`',
			recommended: true,
		},
		schema: [],
	},
	create(context) {
		return {
			CallExpression(node) {
				if (node.callee.type === 'MemberExpression' &&
					(node.callee.object.type === 'Literal' || node.callee.object.type === 'TemplateLiteral' || node.callee.object.type === 'Identifier') &&
					node.callee.property.name === 'test' &&
					node.arguments[0].type === 'Literal' &&
					node.arguments[0].regex) {
						const pattern = node.arguments[0].regex.pattern
						if (pattern.length === 2 && pattern.startsWith('^')) {
							context.report({
								node,
								message: 'Using `RegExp` to test only one character at the start is not allowed.',
							});
						}
				}
			}
		};
	}
}

export default rule;
