// tailwind.config.js
import gridAreas from '@savvywombat/tailwindcss-grid-areas';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		screens: {
			sm: '320px',
			m: '525px',
			md: '768px',
			lg: '1366px',
			xl: '1920px'
		}
	},
	plugins: [gridAreas]
};
