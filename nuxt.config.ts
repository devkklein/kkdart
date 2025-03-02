// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  runtimeConfig: {
    public:{
      
      SUPABASE_URL: process.env.SUPABASE_URL
    },
    private:{
      SUPABASE_KEY: process.env.SUPABASE_KEY
    }
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@formkit/auto-animate",
    "@nuxt/icon",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxtjs/supabase",
    "nuxt-echarts",
  ],
  nitro: {
    experimental: {
      websocket: true,
    },
  },
  supabase: {
    redirectOptions: {
      exclude: ["/login", "/register"],
    },
  },
  devServer: {
    https: {
      key: "./assets/certificate/localhost-key.pem",
      cert: "./assets/certificate/localhost.pem",
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