/** @type {import('tailwindcss').Config} */
export default {
  content: ["./pages/**/*.{vue,ts}", "./components/**/*.{vue,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        herobg: "url('/darthome.jpeg')",
      },
      colors: {
        primary: "#d71730",
        secondary: {
          100: "#E2E2D5",
          200: "#888883",
        },
      },
     
    plugins: [],
  },
}
}