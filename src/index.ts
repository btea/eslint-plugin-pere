import type { ESLint } from 'eslint'
import { version } from '../package.json'
import noStartswithOneChar from './rules/no-startswith-one-char'
import duplicateConstructor from './rules/duplicate-constructor'
import noIndexOfMatchZero from './rules/no-indexof-match-zero'

const plugin = {
  meta: {
		name: 'pere',
		version,
	},
	rules: {
		'no-startswith-one-char': noStartswithOneChar,
		'duplicate-constructor': duplicateConstructor,
		'no-indexof-match-zero': noIndexOfMatchZero,
	},
} satisfies ESLint.Plugin


export default plugin
