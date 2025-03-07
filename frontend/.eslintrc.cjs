/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	root: true,
	'extends': [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'@vue/eslint-config-typescript',
		'@vue/eslint-config-prettier/skip-formatting'
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
    ignorePatterns: ['package.json'],
	env: {
		node: true,
	},
	rules: {
		'vue/multi-word-component-names': 'off',
        'no-console': 'warn',
        'vue/valid-v-slot': ['error', { allowModifiers: true }],
	}
}
