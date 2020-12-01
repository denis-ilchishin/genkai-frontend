import { GetterTree, MutationTree } from 'vuex'
import { IToastsState, Toast } from '~/plugins/toast'
export const state = () =>
  ({
    queue: [],
    active: null,
  } as IToastsState)

type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  queue: (state: IToastsState) => state.queue,
}

export const mutations: MutationTree<RootState> = {
  ADD_TOAST(state: IToastsState, toast: Toast) {
    if (toast.options.queue) {
      state.queue.push(toast)
    } else {
      state.queue = [toast, ...state.queue]
    }
  },
  CLOSE_TOAST(state: IToastsState): void {
    state.queue.shift()
  },
}
