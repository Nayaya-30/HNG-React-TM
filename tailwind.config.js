/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class', // enable class-based dark mode
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				brand: {
					light: '#f5f5f5', // new light background
					DEFAULT: '#1f2937', // default dark gray
					dark: '#111827', // current dark
				},
			},
			animation: {
				'slide-in': 'slideIn 0.2s ease-out',
			},
			keyframes: {
				slideIn: {
					'0%': { transform: 'translateY(-10px)', opacity: 0 },
					'100%': { transform: 'translateY(0)', opacity: 1 },
				},
			},
		},
		plugins: [],
  }
}