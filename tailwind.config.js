/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{vue,ts}',
    './components/**/*.{vue,ts}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'herobg': "url('/darthome.jpeg')",

    },
  },
  plugins: [],
}
}
