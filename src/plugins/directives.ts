import Vue from 'vue'
import { VNode } from 'vue/types/vnode'

const startEvents = ['mousedown', 'touchstart']

const cancelEvents = [
  'click',
  'mouseout',
  'touchend',
  'touchcancel',
  'touchmove',
]

interface IOptions {
  handler: Function
  timeout: number
}

const defaults: IOptions = { handler: () => {}, timeout: 500 }

Vue.directive('longpress', {
  bind(el, binding, vNode: VNode) {
    if (binding.value && typeof binding.value !== 'object') {
      const warn = `[longpress:] provided expression '${binding.expression}' is not an object, but has to be`
      vNode.context?.$isDev && console.warn(warn)
    }

    const options = Object.assign(defaults, binding.value)

    // Define variable
    let pressTimer: NodeJS.Timeout | null = null

    // Define funtion handlers
    const start = (e: Event) => {
      if (e.type === 'click') {
        return
      }

      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          // Run function
          const event = new Event('longpress')
          el.dispatchEvent(event)
        }, options.timeout)
      }
    }

    // Cancel Timeout
    const cancel = (e: Event) => {
      // Check if timer has a value or not
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }

    for (const event of startEvents) {
      el.addEventListener(event, start)
    }

    for (const event of cancelEvents) {
      el.addEventListener(event, cancel)
    }
  },
})
