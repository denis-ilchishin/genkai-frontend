import { Plugin } from '@nuxt/types'

export enum EToastTypes {
  DEFAULT = 'default',
  ERROR = 'error',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
}

type TToastMethod = (text: string, options?: IToastOptions) => void

type TToastsMethods = {
  [key in EToastTypes]: TToastMethod
}

type TToastsQueue = Toast[]

export interface IToastsState {
  queue: TToastsQueue
  active: Toast | null
}

interface IToastType {
  name: EToastTypes
  color: string
}

const types: IToastType[] = [
  /* eslint no-undef: 'off' */
  { name: EToastTypes.DEFAULT, color: '' },
  { name: EToastTypes.ERROR, color: 'error' },
  { name: EToastTypes.SUCCESS, color: 'success' },
  { name: EToastTypes.INFO, color: 'info' },
  { name: EToastTypes.WARNING, color: 'warning' },
]

export class Toast implements IToast {
  text: string
  options: IToastOptions = {
    closeable: true,
    color: '',
    queue: true,
    timeout: 6500,
  }

  constructor(text: string, options?: IToastOptions) {
    this.text = text
  }
}

const ToastsPlugin: Plugin = ({ store }, inject) => {
  const $toasts = Object()

  types.forEach((t) => {
    $toasts[t.name] = (text: string, options?: IToastOptions) => {
      const _options: IToastOptions = {
        color: t.color,
      }

      Object.assign(_options, options)

      store.commit(`toasts/ADD_TOAST`, new Toast(text, _options))
    }
  })

  inject('toast', $toasts)
}

declare module 'vue/types/vue' {
  interface Vue {
    $toast: TToastsMethods
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $toast: TToastsMethods
  }

  interface Context {
    $toast: TToastsMethods
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $toast: TToastsMethods
  }
}

export default ToastsPlugin
