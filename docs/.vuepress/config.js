const webpack = require('webpack')

module.exports = {
	title: 'daumenkino',
	description: 'yet another presentation framework',
	base: '/daumenkino/',
	dest: 'dist',
	theme: 'daumenkino',
	markdown: {
		extendMarkdown (md) {
			md.use(require('markdown-it-container'), 'slide', {
				validate (params) {
					return params.trim().match(/^slide$/)
				},
				render (tokens, idx) {
					// const m = tokens[idx].info.trim().match(/^slide\s*(.*)$/)
					if (tokens[idx].nesting === 1) {
						// opening tag
						return '<slide>' + '\n'
					} else {
						// closing tag
						return '</slide>\n'
					}
				}
			})
		}
	}
}
