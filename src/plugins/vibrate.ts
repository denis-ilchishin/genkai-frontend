import { Plugin } from '@nuxt/types'

export enum EDurations {
  long = 300,
  medium = 150,
  short = 50,
  tap = 15,
}

type TVibrate = (duration: number) => void

const VibratePlugin: Plugin = (ctx, inject) => {
  const vibrate: TVibrate = (duration: number = EDurations.medium) => {
    if (window && 'navigator' in window && 'vibrate' in navigator) {
      if (duration) {
        navigator.vibrate(duration)
      } else {
        console.warn(`Vibration failed. Duration "${duration}" is not valid `)
      }
    } else {
      console.log('Device does not support vibration')
    }
  }

  inject('vibrate', vibrate)
}

declare module 'vue/types/vue' {
  interface Vue {
    $vibrate: TVibrate
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $vibrate: TVibrate
  }

  interface Context {
    $vibrate: TVibrate
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $vibrate: TVibrate
  }
}

export default VibratePlugin
