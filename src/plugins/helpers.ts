import { Context, Plugin } from '@nuxt/types'
import Vue from 'vue'

export const capitalize = (value: any) => {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export const uppercase = (value: any) => {
  return value.toString().toUpperCase()
}

export const getNextHighest = (
  arr: number[],
  value: number,
  def: number | null = null
) => {
  const _arr = arr.slice(0)
  _arr.sort((a, b) => a - b)
  const length = arr.length
  let i = length
  while (_arr[--i] > value);
  if (i === length) {
    return def
  } else {
    return _arr[++i]
  }
}

export const getNextLowest = (
  arr: number[],
  value: number,
  def: number | null = null
) => {
  const _arr = arr.slice(0)
  _arr.sort((a, b) => a - b)

  let result = value

  for (const _value of _arr) {
    if (_value < result) {
      result = _value
    }
  }

  if (result === value) {
    return def
  } else {
    return result
  }
}

export const range = (start: number, count: number) => {
  return Array.apply(0, Array(count)).map((element, index) => index + start)
}

export const getCookie = (name: string) => {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

export const isEquivalent = (a: any, b: any, soft: boolean = false) => {
  /* eslint eqeqeq: "off" */

  // Create arrays of property names
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false
  }

  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i]

    // If values of same property are not equal,
    // objects are not equivalent
    if (soft) {
      if (a[propName] != b[propName]) {
        return false
      }
    } else if (a[propName] !== b[propName]) {
      return false
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true
}

export const toCamelCase = (str: string) => {
  return str.replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2, offset) {
    if (p2) return p2.toUpperCase()
    return p1.toLowerCase()
  })
}

export const shuffleArray = (array: any[]) => {
  const _array = array.slice(0)
  for (let i = _array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = _array[i]
    _array[i] = _array[j]
    _array[j] = temp
  }
  return _array
}

export const copyObject = (object: object) => {
  const newObject = {}
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key as never]
      newObject[key as never] = value
    }
  }
  return newObject
}

export const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const chunk = (array: any, size: number) => {
  const chunked = []
  const copied = [...array]
  const numOfChild = Math.ceil(copied.length / size)
  for (let i = 0; i < numOfChild; i++) {
    chunked.push(copied.splice(0, size))
  }
  return chunked
}

const helpers = {
  capitalize,
  c: capitalize, // alias to capitilize
  uppercase,
  u: uppercase, // alias to uppervase
  getNextLowest,
  getNextHighest,
  urlBase64ToUint8Array,
  copyObject,
  shuffleArray,
  toCamelCase,
  isEquivalent,
  getCookie,
  range,
  chunk,
}

type HelpersType = typeof helpers

const HelpersPlugin: Plugin = (ctx) => {
  inject(ctx, 'helpers', helpers)
}

export default HelpersPlugin

export const inject = (
  ctx: Context,
  accessorName: string,
  value: any,
  addToVue: boolean = true
) => {
  accessorName = accessorName.startsWith('$')
    ? accessorName
    : `$${accessorName}`
  // @ts-ignore
  ctx[accessorName] = value
  ctx.app[accessorName] = value
  // @ts-ignore
  ctx.store[accessorName] = value
  // @ts-ignore
  if (addToVue) {
    Vue.prototype[accessorName] = value
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $helpers: HelpersType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $helpers: HelpersType
  }
  interface Context {
    $helpers: HelpersType
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $helpers: HelpersType
  }
}
