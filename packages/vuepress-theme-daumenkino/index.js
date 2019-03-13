module.exports = (options, ctx) => {
	return {
		// multiple: true,
		chainWebpack (config, isServer) {
			config.module
				.rule('js')
				.use('babel-loader')
				.tap(options => Object.assign(options, {
					plugins: ['@babel/proposal-optional-chaining']
				}))
		},
		extendMarkdown (md) {
			md.use(require('./markdown/slide.js'))
			md.use(require('markdown-it-container'), 'notes', {
				validate (params) {
					return params.trim().match(/^notes/)
				},
				render (tokens, idx) {
					if (tokens[idx].nesting === 1) {
						return '<notes>' + '\n'
					} else {
						return '</notes>\n'
					}
				}
			})
		}
	}
}
