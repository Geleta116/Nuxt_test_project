// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  target: 'static',
  router: {
    base: '/Nuxt_test_project/'
  },
  
  modules: ['@nuxt/image', '@nuxt/icon']
})