/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#516679',
          600: '#4a5a6a',
          700: '#3e4c59',
          800: '#323e47',
          900: '#263035',
        },
        secondary: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#B3BAC0',
          600: '#a1a8ae',
          700: '#8f969c',
          800: '#7d848a',
          900: '#6b7278',
        }
      },
      fontFamily: {
        'sans': ['Poppins-Regular', 'system-ui', 'sans-serif'],
        'light': ['Poppins-Light', 'system-ui', 'sans-serif'],
        'normal': ['Poppins-Regular', 'system-ui', 'sans-serif'],
        'medium': ['Poppins-Medium', 'system-ui', 'sans-serif'],
        'semibold': ['Poppins-SemiBold', 'system-ui', 'sans-serif'],
        'bold': ['Poppins-Bold', 'system-ui', 'sans-serif'],
        'sf-pro': ['SF Pro Display', 'system-ui', 'sans-serif'],
        'sf-pro-text': ['SF Pro Text', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
