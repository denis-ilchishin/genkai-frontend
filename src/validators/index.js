import { helpers } from 'vuelidate/lib/validators'

export const username = helpers.regex('username', /^[\wа-яА-Я.@+-]+$/)

// export const usernamev = { re}
