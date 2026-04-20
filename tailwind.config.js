/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './lib/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        petal: {
          50: '#fff7fb',
          100: '#ffeef5',
          200: '#ffddea',
          300: '#ffc4dc',
          400: '#ff9ec3',
          500: '#f777ab',
          600: '#ea5a97',
          700: '#c9447b',
          800: '#9e3661',
          900: '#702746',
        },
        jam: '#8d3f62',
        shell: '#fff7fb',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        scribble: ['var(--font-scribble)'],
      },
      boxShadow: {
        petal: '0 20px 60px rgba(191, 86, 136, 0.16)',
        float: '0 24px 64px rgba(164, 88, 124, 0.18)',
      },
      backgroundImage: {
        'petal-grid': 'radial-gradient(circle at 20% 10%, rgba(255, 201, 224, 0.85), transparent 28%), radial-gradient(circle at 85% 14%, rgba(255, 238, 245, 0.95), transparent 20%), linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(255,245,250,0.92) 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 280ms ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
