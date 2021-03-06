const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				grayscale: {
					50: 'hsl(0, 0%, 96.90%)',
					100: 'hsl(0, 0%, 94.90%)',
					200: 'hsl(0, 0%, 91.80%)',
					300: 'hsl(0, 0%, 86.70%)',
					400: 'hsl(0, 0%, 78.80%)',
					500: 'hsl(0, 0%, 66.70%)',
					600: 'hsl(0, 0%, 53.70%)',
					700: 'hsl(0, 0%, 42.40%)',
					800: 'hsl(0, 0%, 32.50%)',
					900: 'hsl(0, 0%, 27.10%)'
				},
				accent2: {
					50: 'hsl(305, 77.30%, 97.60%)',
					100: 'hsl(305, 77.30%, 96.03%)',
					200: 'hsl(305, 77.30%, 93.77%)',
					300: 'hsl(305, 77.30%, 89.82%)',
					400: 'hsl(305, 77.30%, 83.38%)',
					500: 'hsl(305, 77.30%, 72.36%)',
					600: 'hsl(305, 77.30%, 56.70%)',
					700: 'hsl(305, 77.30%, 42.49%)',
					800: 'hsl(305, 77.30%, 32.94%)',
					900: 'hsl(305, 77.30%, 27.65%)'
				},
				accent1: {
					50: 'hsl(185, 76.80%, 96.70%)',
					100: 'hsl(185, 76.80%, 93.39%)',
					200: 'hsl(185, 76.80%, 87.91%)',
					300: 'hsl(185, 76.80%, 78.13%)',
					400: 'hsl(185, 76.80%, 60.79%)',
					500: 'hsl(185, 76.80%, 44.72%)',
					600: 'hsl(185, 76.80%, 36.35%)',
					700: 'hsl(185, 76.80%, 28.45%)',
					800: 'hsl(185, 76.80%, 22.23%)',
					900: 'hsl(185, 76.80%, 18.18%)'
				},
				warning: {
					50: 'hsl(64, 100.00%, 90.86%)',
					100: 'hsl(64, 100.00%, 73.40%)',
					200: 'hsl(64, 100.00%, 49.60%)',
					300: 'hsl(64, 100.00%, 45.71%)',
					400: 'hsl(64, 100.00%, 41.77%)',
					500: 'hsl(64, 100.00%, 35.29%)',
					600: 'hsl(64, 100.00%, 28.26%)',
					700: 'hsl(64, 100.00%, 22.53%)',
					800: 'hsl(64, 100.00%, 17.05%)',
					900: 'hsl(64, 100.00%, 13.91%)'
				},
				success: {
					50: 'hsl(159, 92.10%, 94.57%)',
					100: 'hsl(159, 92.10%, 89.67%)',
					200: 'hsl(159, 92.10%, 80.51%)',
					300: 'hsl(159, 92.10%, 64.97%)',
					400: 'hsl(159, 92.10%, 46.75%)',
					500: 'hsl(159, 92.10%, 39.60%)',
					600: 'hsl(159, 92.10%, 31.85%)',
					700: 'hsl(159, 92.10%, 25.31%)',
					800: 'hsl(159, 92.10%, 19.60%)',
					900: 'hsl(159, 92.10%, 16.33%)'
				},
				error: {
					50: 'hsl(24, 30.20%, 96.67%)',
					100: 'hsl(24, 30.20%, 94.85%)',
					200: 'hsl(24, 30.20%, 91.82%)',
					300: 'hsl(24, 30.20%, 86.66%)',
					400: 'hsl(24, 30.20%, 78.57%)',
					500: 'hsl(24, 30.20%, 66.33%)',
					600: 'hsl(24, 30.20%, 52.70%)',
					700: 'hsl(24, 30.20%, 41.78%)',
					800: 'hsl(24, 30.20%, 32.17%)',
					900: 'hsl(24, 30.20%, 26.63%)'
				},
				primary: {
					50: 'hsl(203, 30.40%, 96.64%)',
					100: 'hsl(203, 30.40%, 94.92%)',
					200: 'hsl(203, 30.40%, 91.56%)',
					300: 'hsl(203, 30.40%, 86.49%)',
					400: 'hsl(203, 30.40%, 78.45%)',
					500: 'hsl(203, 30.40%, 65.78%)',
					600: 'hsl(203, 30.40%, 52.27%)',
					700: 'hsl(203, 30.40%, 41.42%)',
					800: 'hsl(203, 30.40%, 31.88%)',
					900: 'hsl(203, 30.40%, 26.39%)'
				}
			}
		}
	},

	plugins: [require('@tailwindcss/typography')]
};

module.exports = config;
