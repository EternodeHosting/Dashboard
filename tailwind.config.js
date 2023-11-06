/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ["/home/container/themes/default/*.ejs"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'green': colors.green,
      'sky': colors.sky, 
      'red': colors.red,
      'pylex': {
        100: '#B1AFBE',
        200: '#B1AFBE',
        300: '#B1AFBE',
        400: '#B1AFBE',
        500: '#343c47',
        600: '#262b33',
        700: '#191c21',
        800: '#171a1f',
        900: '#171a1f'
      },
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
