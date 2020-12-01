import { NuxtAppOptions, Plugin } from '@nuxt/types'
import { inject } from './helpers'

declare module 'vue/types/vue' {
  interface Vue {
    $wait: Wait
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $wait: Wait
  }
  interface Context {
    $wait: Wait
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $wait: Wait
  }
}

class Wait {
  app: NuxtAppOptions
  vuexNamespace: string = 'wait'

  constructor(app: NuxtAppOptions) {
    this.app = app
  }

  get any() {
    return this.app.store?.getters[`${this.vuexNamespace}/any`]
  }

  is(waiters: Waiters): boolean {
    return this.app.store?.getters[`${this.vuexNamespace}/is`](waiters)
  }

  private dispatch(action: string, value: any) {
    return this.app.store?.dispatch(`${this.vuexNamespace}/${action}`, value)
  }

  start(waiters: Waiters) {
    return this.dispatch('start', waiters)
  }

  end(waiters: Waiters) {
    return this.dispatch('end', waiters)
  }
}

const WaitPlugin: Plugin = (ctx) => {
  inject(ctx, 'wait', new Wait(ctx.app))
}

export default WaitPlugin
