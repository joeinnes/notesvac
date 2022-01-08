const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				notesvac: {
					primary: '#6b9ac4',
					'primary-focus': '#4059ad',
					'primary-content': '#fffff',
					secondary: '#97d8c4',
					'secondary-focus': '#47ba97',
					'secondary-content': '#ffffff',
					accent: '#f4b942',
					'accent-focus': '#cd8d0c',
					'accent-content': '#ffffff',
					neutral: '#3d4451',
					'neutral-focus': '#2a2e37',
					'neutral-content': '#ffffff',
					'base-100': '#ffffff',
					'base-200': '#f9fafb',
					'base-300': '#d1d5db',
					'base-content': '#1f2937',
					info: '#2094f3',
					success: '#009485',
					warning: '#ff9900',
					error: '#ff5724'
				}
			}
		]
	}
};

module.exports = config;
