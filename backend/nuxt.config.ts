// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-12",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxthub/core", "nuxt-auth-utils", "@nuxt/image"],
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  // Plugin de base de datos
  plugins: ['~/src/shared/database/plugin'],
  
  // AUTO-IMPORT DE COMPONENTES ACTIVADO
  components: [
    {
      path: "~/components",
      pathPrefix: true,
    },
  ],
  runtimeConfig: {
    session: {
      name: "nuxt-session",
      password: process.env.NUXT_SESSION_PASSWORD || "password-that-should-be-changed",
      cookie: {
        maxAge: 60 * 60 * 18, // 18 hours in seconds
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        path: "/",
      },
    },
    // Database configuration
    database: {
      type: process.env.DB_TYPE || "sqlite",
      url: process.env.DATABASE_URL || "./data/albas.db",
      postgresUrl: process.env.NUXT_POSTGRES_URL,
    },
  },
});
