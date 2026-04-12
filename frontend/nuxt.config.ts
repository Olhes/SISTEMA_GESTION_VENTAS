// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-11-12",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image"
  ],
  pinia: {
    storesDirs: ['./src/infrastructure/stores/**'],
  },
  runtimeConfig: {
    // Backend API URL
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3001',
      apiVersion: process.env.API_VERSION || 'v1'
    }
  },
  // Auto-imports
  imports: [
    {
      dirs: ['./src/application/composables/**'],
      prefix: 'use'
    }
  ]
});
