const htmlmin = require('html-minifier')
const buildDir = '_site'

const shouldTransformHTML = (outputPath) =>
	outputPath &&
	outputPath.endsWith('.html') &&
	process.env.ELEVENTY_ENV === 'production'

const isHomePage = (outputPath) => outputPath === `${buildDir}/index.html`

process.setMaxListeners(Infinity)

module.exports = {
	htmlmin: function (content, outputPath) {
		if (shouldTransformHTML(outputPath)) {
			return htmlmin.minify(content, {
				useShortDoctype: false,
				removeComments: true,
				collapseWhitespace: true
			})
		}
		return content
	}
}
