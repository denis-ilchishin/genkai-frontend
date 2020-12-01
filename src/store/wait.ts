/* eslint camelcase: 'off' */
import Vue from 'vue'
import { ActionTree, GetterTree, MutationTree } from 'vuex'

export const strict = false

export const state = () => ({
  waitings: [] as Waiter[],
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  any: (state) => Boolean(state.waitings.length),
  is: (state) => (waiters: Waiters) => {
    if (Array.isArray(waiters)) {
      for (const waiter of waiters) {
        if (state.waitings.includes(waiter)) return true
      }
    } else if (state.waitings.includes(waiters)) return true
    else {
      return false
    }
  },
}
export const mutations: MutationTree<RootState> = {
  ADD_WAITER(state, waiter: Waiter) {
    if (!state.waitings.includes(waiter)) state.waitings.push(waiter)
  },
  REMOVE_WAITER(state, waiter: Waiter) {
    if (state.waitings.includes(waiter))
      Vue.delete(
        state.waitings,
        state.waitings.findIndex((w) => w === waiter)
      )
  },
}

export const actions: ActionTree<RootState, RootState> = {
  start({ commit }, waiters: Waiters) {
    if (!Array.isArray(waiters)) {
      waiters = [waiters]
    }
    for (const waiter of waiters) {
      commit('ADD_WAITER', waiter)
    }
  },
  end({ commit }, waiters: Waiters) {
    if (!Array.isArray(waiters)) {
      waiters = [waiters]
    }
    for (const waiter of waiters) {
      commit('REMOVE_WAITER', waiter)
    }
  },
}
