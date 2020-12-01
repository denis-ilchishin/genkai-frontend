import fs from 'fs'
export default {
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  env: {
    API_URL_CLIENT: process.env.API_URL_CLIENT,
    API_URL_SERVER: process.env.API_URL_SERVER,
    RECAPTCHA_PUBLIC_KEY: process.env.RECAPTCHA_PUBLIC_KEY,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    PUSH_NOTIFICATIONS_APPLICATION_SERVER_KEY:
      process.env.PUSH_NOTIFICATIONS_APPLICATION_SERVER_KEY,
  },
  hooks: {
    ready({ options: { server } }) {
      // Cleanup server socket if exists from previous load
      if (server && server.socket) {
        const file = server.socket
        if (fs.existsSync(file)) fs.unlinkSync(file)
      }
    },
    listen(server, { socket }) {
      // Grant 777 permissions to newly opened socket
      if (socket) {
        const file = socket
        if (fs.existsSync(file)) fs.chmodSync(file, 0o777)
      }
    },
  },
  router: {
    trailingSlash: true,
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'account',
        path: '/account/',
        redirect: { name: 'account-notifications' },
      })
    },
  },
  redirect: [
    {
      from: '^(\\/[^\\?]*[^\\/])(\\?.*)?$',
      to: '$1/$2',
    },
  ],
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s',
    title: 'Genkai',
    htmlAttrs: {
      lang: 'ru',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: '/fonts/material-icons.css',
      },
      {
        rel: 'stylesheet',
        href: '/fonts/fonts.css',
      },
      {
        rel: 'prefetch',
        href: '/logo.png',
      },
    ],
  },
  pwa: {
    manifest: {
      name: 'Genkai',
      short_name: 'Genkai',
      description: null,
      display: 'standalone',
      lang: 'ru',
      background_color: '#333343',
      theme_color: '#ac7b84',
      start_url: '/',
    },
    workbox: {
      enabled: false,
      dev: false,
      importScripts: ['/sw.notification.js'],
    },
    icon: {
      fileName: 'icon-rounded-512.png',
    },
  },
  pageTransition: {
    name: 'fade-transition',
    mode: 'out-in',
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#ac7b84' },
  /*
   ** Global CSS
   */
  css: ['~/assets/scss/main'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/functions.ts',
    '~/plugins/settings.ts',
    '~/plugins/i18n.ts',
    { src: '~/plugins/toast.ts', mode: 'client' },
    '~/plugins/axios.ts',
    '~/plugins/init.ts',
    '~/plugins/wait.ts',
    '~/plugins/breakpoint.ts',
    '~/plugins/vuelidate.ts',
    '~/plugins/helpers.ts',
    '~/plugins/directives.ts',
    '~/plugins/vibrate.ts',
    // '~/plugins/vuetify.ts',
    { src: '~/plugins/feature-discovery.ts', mode: 'client' },
    { src: '~/plugins/recaptcha.ts', mode: 'client' },
    ...[process.env.GOOGLE_ANALYTICS_ID ? { src: '~/plugins/gtag.ts', mode: 'client' } : undefined].filter(_ => _),
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: [
    '~/components/',
    { path: '~/components/navigation', prefix: 'navigation' },
    { path: '~/components/home', prefix: 'home' },
    { path: '~/components/title', prefix: 'title' },
    { path: '~/components/updates', prefix: 'updates' },
    { path: '~/components/catalog', prefix: 'catalog' },
    { path: '~/components/account', prefix: 'account' },
    { path: '~/components/login', prefix: 'login' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api',
    [
      'nuxt-purgecss',
      {
        paths: [
          '/node_modules/vuetify/src/**/*.ts',
          'components/**/*.vue',
          'layouts/**/*.vue',
          'pages/**/*.vue',
          'plugins/**/*.js',
          'nuxt.config.js',
        ],
        whitelist: [
          'body',
          'html',
          'nuxt-progress',
          '__nuxt',
          '__layout',
          'v-application',
          'v-application--wrap',
        ],
        whitelistPatterns: [
          /-(leave|enter|appear)(|-(to|from|active))$/, // Normal transitions
          /^nuxt-link(|-exact)-active$/, // Nuxt link classes
          /^(?!cursor-move).+-move$/, // Move transitions
          /data-v-.*/, // Keep scoped styles
          /^v-((?!application).)*$/,
          /^theme--*/,
          /.*-transition/,
          /^col-*/,
          /^text--*/,
          /^(.*)--text/,
          /grecaptcha-badge/,
          /^elevation-*/,
          /^cropper*/,
          /^line-*/,
          /^point-*/,
          /^flickity-*/,
          /^tap-target$/,
          /^tap-target-*/,
        ],
        whitelistPatternsChildren: [
          /^v-((?!application).)*$/,
          /^theme--*/,
          /data-v-.*/,
        ],
      },
    ],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    'nuxt-i18n',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    [
      '@nuxtjs/auth-next',
      {
        plugins: [
          { src: '~/plugins/axios.ts', ssr: true },
          '~/plugins/auth.ts',
          { src: '~/plugins/sw.ts', ssr: false },
        ],
      },
    ],
    '@nuxtjs/redirect-module',
  ],
  i18n: {
    vueI18n: '~/plugins/i18n.ts',
    locales: ['ru'],
    defaultLocale: 'ru',
    strategy: 'no_prefix',
  },
  auth: {
    redirect: {
      home: false,
      login: false,
      callback: false,
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'access',
          maxAge: 60 * 30,
          type: 'Token',
        },
        refreshToken: {
          property: 'refresh',
          data: 'refresh',
          maxAge: 60 * 60 * 24 * 30,
        },
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          login: { url: '/auth/token/', method: 'post' },
          refresh: { url: '/auth/refresh/', method: 'post' },
          user: { url: '/auth/user/', method: 'get' },
          logout: false,
        },
        tokenType: 'Token',
        autoFetchUser: false,
      },
    },
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    optionsPath: '~/plugins/vuetify.ts',
    customVariables: ['~/assets/scss/variables.scss'],
    defaultAssets: false,
    treeShake: true,
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    extractCSS: process.env.NODE_ENV !== 'development',
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
  },
}
