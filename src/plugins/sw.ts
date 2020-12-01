/* eslint prefer-promise-reject-errors: 'off' */
import { NuxtAppOptions, Plugin } from '@nuxt/types'
import { urlBase64ToUint8Array } from '~/plugins/functions'

declare module 'vue/types/vue' {
  interface Vue {
    $sw: ServiceWorkerService
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $sw: ServiceWorkerService
  }
  interface Context {
    $sw: ServiceWorkerService
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $sw: ServiceWorkerService
  }
}

class ServiceWorkerService {
  private app: NuxtAppOptions

  constructor(app: NuxtAppOptions) {
    this.app = app

    if (ServiceWorkerService.isSupported()) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.app.$store.commit('SET_NOTIFICATIONS_COUNT', event.data)
      })
    }
  }

  static isSupported = () =>
    window && 'navigator' in window && 'Notification' in window

  static getDevice = () =>
    'navigator' in window ? navigator.userAgent : 'Unknown'

  private showError = (message: string) => {
    message && this.app.$toast.error(message)
  }

  private requestPermission = (): Promise<ServiceWorkerRegistration> => {
    return new Promise((resolve, reject) => {
      if (!this.app.$auth.loggedIn) {
        this.showError(
          this.app.$i18n.t('notifications.errors.notAuth') as string
        )
        reject(new Error('not authenticated'))
      }

      if (!ServiceWorkerService.isSupported()) {
        if (
          !this.app.$auth.$storage.getLocalStorage(
            this.app.$settings.CACHE_KEYS.NOTIFICATION_NOT_SUPPORTED
          )
        ) {
          this.app.$auth.$storage.setLocalStorage(
            this.app.$settings.CACHE_KEYS.NOTIFICATION_NOT_SUPPORTED,
            true
          )
          this.showError(
            this.app.$i18n.t('notifications.errors.noSupported') as string
          )
        }
        reject(new Error('not supported'))
      }

      Notification.requestPermission()
        .then((result) => {
          if (result === 'granted') {
            navigator.serviceWorker.ready.then((registration) => {
              resolve(registration)
            })
          } else {
            reject(new Error('not granted'))
          }
        })
        .catch(() => {
          // this.showError(this.app.i18n.t('notifications.errors.notGranted'))
          reject(new Error('grant error'))
        })
    })
  }

  private addSubscription = (subscription: PushSubscription) => {
    this.app.$axios.post(
      'push-notifications/subscribe/',
      {
        subscription,
        device: ServiceWorkerService.getDevice(),
      },
      { progress: false }
    )
  }

  subscribe() {
    this.requestPermission().then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        if (subscription === null) {
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                this.app.$settings.PUSH_NOTIFICATIONS_APPLICATION_SERVER_KEY
              ),
            })
            .then((subscription) => {
              this.addSubscription(subscription)
            })
        }
      })
    })
  }
}

const ServiceWorkerPlugin: Plugin = (ctx, inject) => {
  const sw = new ServiceWorkerService(ctx.app)
  inject('sw', sw)
}

export default ServiceWorkerPlugin
