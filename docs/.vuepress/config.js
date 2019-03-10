const webpack = require('webpack')

module.exports = {
	title: 'buntpapier',
	description: 'yet another component library',
	base: '/buntpapier/',
	dest: 'dist',
	head: [
		['link', {href: 'https://fonts.googleapis.com/css?family=Oswald:200,300,400,500,600,700|Quicksand:300,400,500,700|Source+Sans+Pro:300,300i,400,400i,600,700,900', rel: 'stylesheet'}]
	],
	configureWebpack: {
		plugins: [
			new webpack.EnvironmentPlugin(['BUILD'])
		]
	},
	chainWebpack: (config, isServer) => {
		config.module
		.rule('js')
			.use('babel-loader')
			.tap(options => Object.assign(options, {
				plugins: ["@babel/proposal-optional-chaining"]
			}))
	}
}
