/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1921px',
      },
      keyframes: {
        pinRight: {
          '0%': { marginLeft: "-50px" },
          '100%': { margin: 0 },
        }
      },
      animation: {
        pinRight: 'pinRight 1s ease-in-out',
      },
      fontFamily: {
        'roboto': ['Roboto'],
      },
    },
  },
  plugins: [],
}

