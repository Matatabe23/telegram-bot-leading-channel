module.exports = {
	plugins: [
		require('postcss-import'),
		// @ts-ignore
		require('tailwindcss/nesting')(require('postcss-nesting')),
		require('tailwindcss'),
		require('autoprefixer'),
		require('postcss-gap')({ method: 'duplicate' })
	]
}
