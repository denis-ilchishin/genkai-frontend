import { Plugin } from '@nuxt/types'
import Vue from 'vue'
import {
  Breakpoint,
  BreakpointName,
  BreakpointThresholds,
} from 'vuetify/types/services/breakpoint'

declare module 'vue/types/vue' {
  interface Vue {
    $breakpoint: Breakpoint
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $breakpoint: Breakpoint
  }
  interface Context {
    $breakpoint: Breakpoint
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $breakpoint: Breakpoint
  }
}

const scrollBarWidth: number = 10

const mobileBreakpoint: BreakpointName = 'md'

const thresholds: BreakpointThresholds = {
  xs: 0,
  sm: 0,
  md: 0,
  lg: 0,
}

const defaultsMobile: Breakpoint = {
  name: 'xs',
  xs: true,
  xsOnly: true,
  sm: false,
  smOnly: false,
  smAndDown: true,
  smAndUp: false,
  md: false,
  mdOnly: false,
  mdAndDown: true,
  mdAndUp: false,
  lg: false,
  lgOnly: false,
  lgAndDown: true,
  lgAndUp: false,
  xl: false,
  xlOnly: false,
  width: 0,
  height: 0,
  mobile: true,
  mobileBreakpoint,
  scrollBarWidth,
  thresholds,
}

const defaultsDesktop: Breakpoint = {
  name: 'lg',
  xs: false,
  xsOnly: false,
  sm: false,
  smOnly: false,
  smAndDown: false,
  smAndUp: true,
  md: false,
  mdOnly: false,
  mdAndDown: false,
  mdAndUp: true,
  lg: true,
  lgOnly: true,
  lgAndDown: true,
  lgAndUp: true,
  xl: false,
  xlOnly: false,
  width: 0,
  height: 0,
  mobile: false,
  mobileBreakpoint,
  scrollBarWidth,
  thresholds,
}

const BreakpointsPlugin: Plugin = ({ store, app, $vuetify }, inject) => {
  const isMobile = store.getters.isMobile

  const defaults: Breakpoint = isMobile ? defaultsMobile : defaultsDesktop

  inject(
    'breakpoint',
    new Vue({
      data: () => defaults,
    })
  )

  app.mixins = app.mixins || []
  app.watch = app.watch || {}

  for (const prop in defaults) {
    app.watch[`$vuetify.breakpoint.${prop}`] = function (this: Vue, value) {
      this.$breakpoint[prop as never] = value as never
    }
  }

  app.mixins.push({
    mounted(this: Vue) {
      for (const prop in defaults) {
        this.$breakpoint[prop as never] = $vuetify.breakpoint[prop as never]
      }
    },
  })
}

export default BreakpointsPlugin
