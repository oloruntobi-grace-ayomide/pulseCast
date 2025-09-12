/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
			"primary-color": {
				DEFAULT: "#3B82F6",
				light: "#3B82F6",
				dark: "#1E3A8A",
				},
			"hover-primary-color":{
				DEFAULT: "#2563EB",
				light: "#2563EB",
				dark: "#1E3A8A",
			},
			"white":"#ffffff",
			"anti-flash-white":"#f1f4f6",
  			"black-color":"#000000", 
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
			keyframes: {
				'sk-three-bounce': {
				'0%, 80%, 100%': { transform: 'scale(0)' },
				'40%': { transform: 'scale(1)' },
				},
			},
			animation: {
				'sk-three-bounce': 'sk-three-bounce 1.4s ease-in-out infinite both',
			},
  		},
		screens: {
			'xxsm': '280px',  
			'xsm': '400px',
			'sm': '600px',
			'md': '800px',  
			'slg':'1024px',
      	},
  	},
  },
  plugins: [require("tailwindcss-animate")],
}

