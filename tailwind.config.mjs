import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ['Noto Sans Variable', ...defaultTheme.fontFamily.sans],
				serif: ['Noto Serif Variable', ...defaultTheme.fontFamily.serif],
			},
		},
	},
	plugins: [],
}
