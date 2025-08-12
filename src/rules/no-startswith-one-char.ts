import type { Rule } from "eslint"
import type * as ESTree from "estree"

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
    const commonHandler = (callNode: ESTree.CallExpression, parentNode?: ESTree.UnaryExpression) => {
      const callee = callNode.callee as ESTree.MemberExpression
      if (!callee || callee.type !== 'MemberExpression') return
      if (callee.property.type !== 'Identifier' || callee.property.name !== 'startsWith') return

      // Check if we have at least one argument and it's a single character literal
      if (!callNode.arguments || callNode.arguments.length === 0) return
      const firstArg = callNode.arguments[0]
      if (firstArg.type !== 'Literal') return
      if (typeof firstArg.value !== 'string' || firstArg.value.length !== 1) return

      const isUnary = !!parentNode
      const nodeToReport = isUnary ? parentNode : callNode
      const nodeToReplace = isUnary ? parentNode : callNode

      context.report({
        node: nodeToReport,
        message: 'Using `startsWith` with a single character is not allowed. Use `===` instead.',
        fix: fixer => {
          const raw = (firstArg as any).raw
          const sourceCode = context.sourceCode ?? context.getSourceCode()
          const objectText = sourceCode.getText(callee.object)

          if (isUnary) {
            // replace unary expression: !a.startsWith('a') -> a[0] !== 'a'
            return fixer.replaceText(nodeToReplace, `${objectText}[0] !== ${raw}`)
          } else {
            // replace call expression: a.startsWith('a') -> a[0] === 'a'
            return fixer.replaceText(nodeToReplace, `${objectText}[0] === ${raw}`)
          }
        }
      })
    }

		return {
			'CallExpression[callee.property.name="startsWith"]:not(UnaryExpression[operator="!"] > CallExpression)': (node: ESTree.CallExpression) => {
        commonHandler(node)
			},
      'UnaryExpression[operator="!"]': (node: ESTree.UnaryExpression) => {
        const unaryParent = node
        const arg = node.argument as ESTree.CallExpression
        if (arg.callee && arg.callee.type === 'MemberExpression' && arg.callee.property.type === 'Identifier' && arg.callee.property.name === 'startsWith') {
          commonHandler(arg, unaryParent)
        }
      }
		}
	}
}

export default rule;
