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
        body: ['var(--font-body)'],
        display: ['var(--font-body)'],
        note: ['var(--font-note)'],
        scribble: ['var(--font-scribble)'],
        marker: ['var(--font-marker)'],
      },
      boxShadow: {
        petal: '0 18px 44px rgba(157, 109, 130, 0.14)',
        float: '0 26px 70px rgba(120, 84, 102, 0.17)',
        paper: '0 12px 30px rgba(82, 54, 64, 0.12)',
      },
      backgroundImage: {
        'petal-grid': 'linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), linear-gradient(rgba(247, 187, 212, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(247, 187, 212, 0.15) 1px, transparent 1px)',
      },
      backgroundSize: {
        'petal-grid': '100% 100%, 22px 22px, 22px 22px',
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
