import { Plugin } from '@nuxt/types'
import Vue from 'vue'
import VueGtagPlugin, { PluginOptions, VueGtag } from 'vue-gtag'
import { inject } from './helpers'

declare module 'vue/types/vue' {
  interface Vue {
    $gtag: VueGtag
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $gtag: VueGtag
  }
  interface Context {
    $gtag: VueGtag
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $gtag: VueGtag
  }
}

const GTagPlugin: Plugin = (ctx) => {
  Vue.use(
    VueGtagPlugin,
    {
      config: { id: ctx.$settings.GOOGLE_ANALYTICS_ID },
      enabled: !ctx.$isDev,
    } as PluginOptions,
    ctx.app.router
  )
  inject(ctx, 'gtag', Vue.prototype.$gtag)
}

export default GTagPlugin
