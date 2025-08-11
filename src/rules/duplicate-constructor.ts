import type { Rule } from "eslint";
import type * as ESTree from "estree"

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
    const isLiteral = (node: Rule.Node | ESTree.Expression) => {
      return node.type === 'Literal'
    }
    const isPropertyLiteral = (property: ESTree.Property): boolean => {
      return property.key?.type === 'Literal' && property.value?.type === 'Literal'
    }
    const isInLoop = (node: Rule.Node): boolean => {
      if (!node.parent) {
        return false
      }
      if (['ForStatement', 'WhileStatement', 'DoWhileStatement', 'ForInStatement', 'ForOfStatement'].includes(node.parent.type)) {
        return true
      }
      return isInLoop(node.parent)
    }
    const isArrayExpression = (type: string): boolean => {
      return type === 'ArrayExpression'
    }
    const isPureArray = (node: ESTree.ArrayExpression): boolean => {
      return isArrayExpression(node.type) && node.elements.length > 0 && node.elements.every((e) => isLiteral(e as ESTree.Expression))
    }
    const isObjectExpression = (type: string): boolean => {
      return type === 'ObjectExpression'
    }
    const isPureObject = (node: ESTree.ObjectExpression): boolean => {
      return isObjectExpression(node.type) && node.properties.every((p) => isPropertyLiteral(p as ESTree.Property))
    }

    const report = (node: ESTree.Node, message: string) => {
      context.report({
        node,
        message,
      });
    };

		return {
      CallExpression(node) {
        if (node.callee.type === 'NewExpression') {
          const args = node.arguments;
          if (args.length === 0) {
            return; // Skip if no arguments are provided
          }
          if (args.every((arg) => {
            return isLiteral(arg as ESTree.Expression);
          }) && isInLoop(node)) {
            report(node, `Repetitive construction of '${node.callee.type}' detected.`);
          }
        } else if (node.callee.type === 'MemberExpression' && node.callee.object.type === 'ArrayExpression') {
          const array = node.callee.object;
          if (isPureArray(array) && isInLoop(node)) {
            report(node, `Repetitive construction of 'Array' detected.`);
          }
        } else if (node.callee.type === 'MemberExpression' && node.callee.object.type === 'ObjectExpression') {
          const object = node.callee.object;
          if (isPureObject(object) && isInLoop(node)) {
            report(node, `Repetitive construction of 'Object' detected.`)
          }
        }
      },
      VariableDeclarator(node) {
        if (node.init) {
          if (isArrayExpression(node.init.type) && isPureArray(node.init as ESTree.ArrayExpression) && isInLoop(node)) {
            report(node, `Repetitive construction of 'Array' detected.`);
            return
          }
          if (isObjectExpression(node.init.type) && isPureObject(node.init as ESTree.ObjectExpression) && isInLoop(node)) {
            report(node, `Repetitive construction of 'Object' detected.`);
            return
          }
        }
      }
    };
	}
}

export default rule;
