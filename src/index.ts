import type { ESLint } from 'eslint'
import { version } from '../package.json'
import noStartswithOneChar from './rules/no-startswith-one-char'
import noRegexpOnlyOneCharStart from './rules/no-regexp-only-one-char-start'
import duplicateConstructor from './rules/duplicate-constructor'
import noIndexOfAssertZero from './rules/no-index-of-assert-zero'

const plugin = {
  meta: {
		name: 'pere',
		version,
	},
	rules: {
		'no-startswith-one-char': noStartswithOneChar,
		'no-regexp-only-one-char-start': noRegexpOnlyOneCharStart,
		'duplicate-constructor': duplicateConstructor,
		'no-index-of-assert-zero': noIndexOfAssertZero,
	},
} satisfies ESLint.Plugin


export default plugin
