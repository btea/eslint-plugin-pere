import type { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
		type: 'problem',
		docs: {
			description: 'Disallow using `startsWith` with a single character',
			recommended: true,
		},
		schema: [],
    fixable: 'code',
	},
	create(context) {
		return {
			CallExpression(node) {
        const callee = node.callee as any

        const isLiternal = () => callee.object.type === 'Literal' || callee.object.type === 'TemplateLiteral' || callee.object.type === 'Identifier'

        const isMemberExpression = () => callee.object.type === 'MemberExpression'

        if (callee.type === 'MemberExpression' &&
					callee.property.name === 'startsWith' &&
					(isLiternal() || isMemberExpression()) &&
					node.arguments[0].type === 'Literal' &&
					String(node.arguments[0].value)?.length === 1) {
						context.report({
              node,
              message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
              fix: fixer => {
                // @ts-expect-error
                const raw = node.arguments[0].raw
                const sourceCode = context.sourceCode ?? context.getSourceCode()
                const objectText = sourceCode.getText(callee.object)
                if (isLiternal()) {
                  return fixer.replaceText(node, `${objectText}[0] === ${raw}`)
                }
                if (isMemberExpression()) {
                  return fixer.replaceText(node, `${objectText} === ${raw}`)
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
