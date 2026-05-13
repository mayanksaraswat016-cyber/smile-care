/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#EEF2FA',
          100: '#D5DFF2',
          200: '#ABBFE5',
          300: '#7C9BD4',
          400: '#4F78C3',
          500: '#2E5AB5',
          600: '#1B3A6B',
          700: '#152D54',
          800: '#0F2040',
          900: '#091528',
        },
        teal: {
          50: '#ECFCFD',
          100: '#C8F5F8',
          200: '#92EBF1',
          300: '#52D9E4',
          400: '#1EC4D4',
          500: '#0EA5B0',
          600: '#0B8490',
          700: '#096470',
          800: '#064850',
          900: '#032E33',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(27, 58, 107, 0.08)',
        'card-hover': '0 12px 40px rgba(27, 58, 107, 0.14)',
        'modal': '0 24px 80px rgba(27, 58, 107, 0.2)',
        'nav': '0 2px 16px rgba(27, 58, 107, 0.1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};