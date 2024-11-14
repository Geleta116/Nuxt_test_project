// https://nuxt.com/docs/api/configuration/nuxt-config
export default {
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  ssr: true,
  target: 'static',
  router: {
    base: '/Nuxt_test_project/'
  },
  
  modules: ['@nuxt/image', '@nuxt/icon']
}