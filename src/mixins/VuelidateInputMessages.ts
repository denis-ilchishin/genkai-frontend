import { getCurrentInstance } from '@nuxtjs/composition-api'
import { Validation } from 'vuelidate'

export const useVuelidateInputMessages = () => {
  const vm = getCurrentInstance()

  const hasMessageText = (data: Object, validator: string): boolean => {
    return validator in data
  }

  const getErrorMessage = (data: Object, validator: string): string => {
    if (hasMessageText(data, validator)) {
      // @ts-ignore
      return data[validator] as string
    } else if (
      typeof vm?.$t(`default.inputs.errors.${validator}`) !== 'undefined'
    ) {
      return vm?.$t(`default.inputs.errors.${validator}`) as string
    } else {
      return vm?.$t('default.inputs.errors.invalid') as string
    }
  }

  const getInputErrorMessage = (
    vuelidate: Validation,
    data: string | Object
  ) => {
    if (!vuelidate.$error) return

    if (typeof data === 'string') {
      return data
    } else if (data instanceof Object) {
      for (const validator in vuelidate.$params) {
        if (Object.prototype.hasOwnProperty.call(vuelidate, validator)) {
          // @ts-ignore
          if (!vuelidate[validator]) {
            return getErrorMessage(data, validator)
          }
        }
      }
    }
  }

  return {
    getInputErrorMessage,
  }
}
