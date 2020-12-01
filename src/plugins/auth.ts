import { Plugin } from '@nuxt/types'

const AuthPlugin: Plugin = ({ $auth }) => {
  // $auth.onError(() => {})
  // @ts-ignore
  $auth.options.resetOnError = (err) =>
    err.response && parseInt(err.response.status) === 401
}
export default AuthPlugin
