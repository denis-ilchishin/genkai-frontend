import { Plugin } from '@nuxt/types'
import { maxLength, minLength } from 'vuelidate/lib/validators'
import { username } from '~/validators'
import { inject } from './helpers'

type Validator = (additional?: any, required?: boolean) => object

interface IValidators {
  username: Validator
}

const ValidatorsPlugin: Plugin = (ctx) => {
  const validators: IValidators = {
    username: (additional, required) => {
      const validators = {
        invalid: username,
        maxLength: maxLength(
          ctx.store.getters.input('register.username.max_length', 255)
        ),
        minLength: minLength(
          ctx.store.getters.input('register.username.min_length', 4)
        ),
      }

      if (required) {
      }
    },
  }

  inject(ctx, 'validators', validators)
}

declare module 'vue/types/vue' {
  interface Vue {
    $validators: IValidators
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $validators: IValidators
  }

  interface Context {
    $validators: IValidators
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $validators: IValidators
  }
}

export default ValidatorsPlugin
