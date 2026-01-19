// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false, // We don't like SSR over here
  devtools: { enabled: true },

  modules: [
    '@vueuse/nuxt'
  ],

  // Performance optimizations
  experimental: {
    payloadExtraction: false, // Disable if not needed since SSR is off
  },

  app: {
    head: {
      title: 'LinChat',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#4F46E5' }, // Primary color
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'application-name', content: 'LinChat' },
        { name: 'apple-mobile-web-app-title', content: 'LinChat' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ],
      htmlAttrs: {
        lang: 'en'
      }
    }
  },

  // Optimize build and runtime
  css: [
    // If you have global CSS files
  ],

  // Optimize modules and features
  features: {
    inlineStyles: true, // For client-side rendered apps
  },

  runtimeConfig: {
    // Private config that only the server can access
    // Environment variables: NUXT_OPENAI_API_KEY and NUXT_OPENAI_API_BASE
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY || '',
    openaiApiBase: process.env.NUXT_OPENAI_API_BASE ,
    // Public config that is exposed to the client
    public: {
      // Add any public config here
    }
  }
})
