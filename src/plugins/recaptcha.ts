import { Plugin } from '@nuxt/types'
import { load } from 'recaptcha-v3'
import { inject } from './helpers'

type Recaptcha = () => Promise<string>

declare module 'vue/types/vue' {
  interface Vue {
    $recaptcha: Recaptcha
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $recaptcha: Recaptcha
  }
  interface Context {
    $recaptcha: Recaptcha
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $recaptcha: Recaptcha
  }
}

const RecaptchaPlugin: Plugin = (ctx) => {
  inject(
    ctx,
    'recaptcha',
    () =>
      new Promise((resolve, reject) => {
        load(ctx.$settings.RECAPTCHA_PUBLIC_KEY, {
          useRecaptchaNet: true,
          autoHideBadge: true,
        })
          .then((recaptcha) =>
            recaptcha
              .execute('submit')
              .then((token) => resolve(token))
              .catch(() => {
                ctx.$toast.error(ctx.app.i18n.t('errors.captcha') as string)
                reject(new Error('submit'))
              })
          )
          .catch(() => {
            ctx.$toast.error(ctx.app.i18n.t('errors.captcha') as string)
            reject(new Error('load'))
          })
      })
  )
}

export default RecaptchaPlugin
