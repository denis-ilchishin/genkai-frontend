import { Plugin } from '@nuxt/types'
// import MobileDetect from 'mobile-detect'

declare module 'vue/types/vue' {
  interface Vue {
    $isDev: boolean
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $isDev: boolean
  }
  interface Context {
    $isDev: boolean
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $isDev: boolean
  }
}

const InitPlugin: Plugin = ({ store, req }, inject) => {
  const pattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

  if (process.server) {
    store.commit(
      'SET_MOBILE',
      pattern.test(req.headers['user-agent'] as string)
    )
  } else {
    store.commit('SET_MOBILE', pattern.test(navigator.userAgent))
  }

  store.dispatch('nuxtServerInit')

  inject('isDev', process.env.NODE_ENV !== 'production')
}
export default InitPlugin
