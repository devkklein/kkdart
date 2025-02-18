/** @type {import('tailwindcss').Config} */
export default {
  content: ["./pages/**/*.{vue,ts}", "./components/**/*.{vue,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        herobg: "url('/darthome.jpeg')",
        boardbg: "url('/dartt20.jpeg')",
      },
      colors: {
        primary: "#222222",

        secondary: {
          100: "#E2E2D5",
          200: "#888883",
          300: "#151515",
        },
        blue: {
          500: "#3333cc",
          400: "#81caf9",
        },
        yellow: {
          500: "#f2db34",
          600: "#ee9d17",
        },
        green: {
          500: "#53d05e",
        },
        red: {
          500: "#ec573f",
        },
      },
      fontFamily: {
        sans: ["SF PRO", "sans-serif"],
      },

      plugins: [],
    },
  },
};
