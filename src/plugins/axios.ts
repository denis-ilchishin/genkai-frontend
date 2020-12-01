import { Plugin } from '@nuxt/types'
import https from 'https'

const AxiosPlugin: Plugin = (ctx) => {
  /* eslint no-fallthrough: off, no-console: off */
  const agent = new https.Agent({
    rejectUnauthorized: false,
  })
  if (process.server) {
    ctx.$axios.setBaseURL(ctx.$settings.API_URL_SERVER)
    ctx.$axios.onError((err) => {
      const code = err.response && err.response.status
      switch (code) {
        case 401:
          ctx.$auth.logout()
      }
      if (ctx.isDev) console.error(err)
    })
  } else {
    ctx.$axios.setBaseURL(ctx.$settings.API_URL_CLIENT)
    ctx.$axios.onError((err) => {
      const code = err.response && err.response.status
      if (err.config.displayToasts) {
        switch (code) {
          case 401:
            ctx.$toast.error(ctx.app.i18n.t('errors.401') as string)
            break
          case 403:
            ctx.$toast.error(ctx.app.i18n.t('errors.403') as string)
          case 500:
            ctx.$toast.error(ctx.app.i18n.t('errors.500') as string)
            break
          default:
            ctx.$toast.error(ctx.app.i18n.t('errors.default') as string)
            break
        }
      }
      const propagete = err.config.propagateError ?? [400, 404]
      if (
        propagete &&
        (typeof propagete === 'boolean' ||
          (code &&
            ((typeof propagete === 'number' && code === propagete) ||
              (Array.isArray(propagete) && propagete.includes(code)))))
      ) {
        throw err
      }
    })
  }

  ctx.$axios.onRequest((config) => {
    if (process.server) {
      // Remove ssl verification for serverside requests,
      // because through we do localhost requests
      config.httpsAgent = agent
    }
    if (ctx.isDev)
      console.log(
        `Making request to ${config.baseURL}/${config.url}`.replace('//', '/')
      )
  })
}

export default AxiosPlugin

declare module 'axios/index' {
  interface AxiosRequestConfig {
    propagateError?: boolean | number | number[]
    displayToasts?: boolean
  }
}
