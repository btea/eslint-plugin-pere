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
        const isLiternal = () => node.callee.object.type === 'Literal' || node.callee.object.type === 'TemplateLiteral' || node.callee.object.type === 'Identifier'
        const isMemberExpression = () => node.callee.object.type === 'MemberExpression'
				if (node.callee.type === 'MemberExpression' &&
					node.callee.property.name === 'startsWith' &&
					(isLiternal() || isMemberExpression()) &&
					node.arguments[0].type === 'Literal' &&
					String(node.arguments[0].value)?.length === 1) {
						context.report({
              node,
              message: 'Using `startsWith` with a single character is not allowed.',
              fix: fixer => {
                if (isLiternal() || node.callee.object.type === 'Identifier') {
                  return fixer.replaceText(node, `${node.callee.object.raw}[0] === "${node.arguments[0].value}"`)
                }
                if (isMemberExpression()) {
                  if (node.callee.object.object) {
                    return fixer.replaceText(node, `${node.callee.object.object.name}[${node.callee.object.property.name}][0] === "${node.arguments[0].value}"`)
                  }
                }
                return null
              }
            })
					}
			}
		}
	}
}

export default rule;
