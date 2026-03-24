/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#16161e',
        primary: '#7c3aed',
        'primary-light': '#a78bfa',
        secondary: '#f472b6',
        card: '#16161e',
        panel: '#111118',
        border: '#2a2a3a',
        'text-dim': '#6b6b8a',
        'text-muted': '#9d9db5'
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        brand: ['Righteous', 'cursive'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #7c3aed, #f472b6)',
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
