// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@formkit/auto-animate",
    "@prisma/nuxt",
    "@nuxt/icon",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxtjs/supabase"
  ],
  supabase: {
    redirectOptions: {
      exclude: ["/login", "/register"],
    }
  },
  css: ["~/assets/css/main.css"],
  icon: {
    serverBundle: {
      collections: ["game-icons"],
    },
  },
  fonts: {
    experimental: {
      processCSSVariables: true,
    },
    
  },
});