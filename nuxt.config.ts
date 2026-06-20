// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-auth-utils'],
  runtimeConfig: {
    // server-only secret, read from DATABASE_URL env (.env / DO secret)
    databaseUrl: process.env.DATABASE_URL,
  },
})
