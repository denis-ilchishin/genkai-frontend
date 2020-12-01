import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { mutations as ConfigMutations } from './config'
import { mutations as ToastMutations } from './toasts'
import { mutations as UserMutations } from './user'

const storeModules = {
  toasts: ToastMutations,
  config: ConfigMutations,
  user: UserMutations,
}

const mutationsToShare: string[] = [
  'auth/SET',
  'wait/END',
  'wait/PROGRESS',
  'wait/START',
]

for (const storeModuleName in storeModules) {
  // @ts-ignore
  const mutations = storeModules[storeModuleName]
  for (const mutation in mutations) {
    mutationsToShare.push(`${storeModuleName}/${mutation}`)
  }
}
let _plugins: any[] = []

if (process.client) {
  const createMutationsSharer = require('vuex-shared-mutations').default
  _plugins = [createMutationsSharer({ predicate: mutationsToShare })]
}

export const plugins = _plugins

export const state = () => ({
  isMobile: true,
  showSearchMenu: false,
  // showSideMenu: false,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  isMobile: (state) => state.isMobile,
  showSearchMenu: (state) => state.showSearchMenu,
  // showSideMenu: (state) => state.showSideMenu,
}

export const mutations: MutationTree<RootState> = {
  SET_MOBILE(state, isMobile) {
    state.isMobile = isMobile
  },
  SET_SHOW_SEARCH_MENU(state, is: boolean) {
    state.showSearchMenu = is
  },
  // SET_SHOW_SIDE_MENU(state, is: boolean) {
  //   state.showSideMenu = is
  // },
}

export const actions: ActionTree<RootState, RootState> = {
  nuxtServerInit({ commit }) {
    return this.$axios
      .$get('frontend/config/')
      .then((res) => {
        commit('config/SET_DATA', res)
      })
      .catch(() => {})
  },
}

export const strict = false
