/** @type {import('tailwindcss').Config} */
export default {
  content: ["./pages/**/*.{vue,ts}", "./components/**/*.{vue,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        herobg: "url('/darthome.jpeg')",
        boardbg: "url('/dartt20.jpeg')",
        dartboard: "url('/dartboard.png')",
      },
      colors: {
        primary: "#222222",
        secondary: {
          100: "#E2E2D5",
          200: "#888883",
          300: "#151515",
          400: "#ffffff1a",
        },
        blue: {
          400: "#81caf9",
          500: "#192a56",
          600: "#3333cc",
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
        purple: {
          400: "#9f7aea",
        },
        teal: {
          400: "#4fd1c5",
        },
        pink: {
          400: "#ed64a6",
        },
        black: "#0f0f0f",
      },
      fontFamily: {
        sans: ["SF PRO", "sans-serif"],
      },
      boxShadow: {
        'glass': '0 4px 6px rgba(255, 255, 255, 0.05), 0 1px 3px rgba(255, 255, 255, 0.1)',
        'neon': '0 0 5px rgba(129, 202, 249, 0.5), 0 0 20px rgba(129, 202, 249, 0.3)',
      },

      plugins: [],
    },
  },
};
