/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    screens: {
      'lg': {'max': '992px'},
      'md': {'max': '768px'},
      'sm': {'max': '480px'},
      'xs': {'max': '348px'}
    },
    fontSize: {
      'xl': '2.2rem',
      'lg': '1.5rem',
      'base': '1.3rem',
      'md': '1.2rem',
      'sm': '1.1rem',
    },
    colors: {
      'grey': '#8E9CBB',
      'grey-light': '#D3D8DF',
      'red': '#dc2626',
      'blue': '#0066FF'
    },
    container: {
      padding: '20px',
      center: true,
    },
  },
  plugins: [],
}
