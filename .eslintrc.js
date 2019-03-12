module.exports = {
		root: true,
		parserOptions: {
			source_type: 'module',
			parser: 'babel-eslint'
		},

		plugins: [
			'babel',
			'vue',
		],

		// add your custom rules here
		rules: {
			'arrow-parens': 0,
			'generator-star-spacing': 0,
			'no-debugger': 'off',
			indent: [2, 'tab', {SwitchCase: 1}],
			'no-tabs': 0,
			'comma-dangle': 0,
			curly: 0,
			'no-return-assign': 0,
			'no-cond-assign': 0,
			'no-console': 'off',
			'vue/require-default-prop': 0,
			'object-curly-spacing': 0,
			// replace with babel rules
			'camelcase': 0,
			'babel/camelcase': ['error', {properties: 'never', ignoreDestructuring: true}],
			'no-unused-expressions': 0,
			'babel/no-unused-expressions': 1,
			'vue/name-property-casing': 0
		},

		globals: {
			localStorage: false
		},

		env: {
			node: true
		},

		'extends': [
			'plugin:vue/recommended',
			'@vue/standard'
		]
}
