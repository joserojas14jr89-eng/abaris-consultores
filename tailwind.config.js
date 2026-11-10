/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        abaris: {
          blue: '#0B132B',
          gold: '#C5A059',
          purple: '#6B4B9A',
        }
      }
    },
  },
  plugins: [],
}
