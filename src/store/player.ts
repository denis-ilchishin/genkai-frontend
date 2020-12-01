/* eslint camelcase: 'off' */
import { ActionTree, GetterTree, MutationTree, Store } from 'vuex'
import {
  LastEpisodeResponse,
  PlayerHistory,
  PlayerHistoryRecord
} from '~/types/player'
import { ITitle } from '~/types/title'

export const state = () => ({
  title: null as null | ITitle,
  history: null as PlayerHistoryRecord | null,
  minimized: false,
  isOpening: false as any,
  pendingHistory: null as PlayerHistoryRecord | null,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  playing: (state) => state.title,
  history: (state) => state.history,
  isMinimized: (state) => state.minimized,
  isMaximized: (state) => !state.minimized,
  isOpening: (state) => state.isOpening,
}

export const mutations: MutationTree<RootState> = {
  SET_TITLE(this: Store<any>, state, title: ITitle) {
    if (state.title?.slug !== title.slug) {
      state.title = title
      this.$gtag.event(this.$settings.GTAG.PLAYER.EVENTS.OPEN, {
        event_category: this.$settings.GTAG.PLAYER.TEXT,
      })
    }
    state.minimized = false
  },
  SET_HISTORY(state, history: PlayerHistoryRecord) {
    state.history = history
  },
  CLOSE_PLAYER(state) {
    setTimeout(() => {
      state.minimized = false
    }, 100)
  },
  MINIMIZE_PLAYER(this: Store<any>, state) {
    this.$gtag.event(this.$settings.GTAG.PLAYER.EVENTS.MINIMIZE, {
      event_category: this.$settings.GTAG.PLAYER.TEXT,
    })
    state.minimized = true
  },
  MAXIMIZE_PLAYER(state) {
    state.minimized = false
  },
  RESET_STATE(state) {
    state.title = state.history = null
  },
  SET_LOADING(state, value: any) {
    state.isOpening = value
  },
}

export const actions: ActionTree<RootState, RootState> = {
  play({ commit }, title: ITitle) {
    commit('RESET_STATE')

    if (this.$auth.loggedIn) {
      commit('SET_LOADING', title)
      this.$axios
        .$get(`/users/last-viewed-episode/${title.slug}/`)
        .then((data: LastEpisodeResponse) => {
          commit('SET_TITLE', title)
          if (data) {
            commit('SET_HISTORY', {
              episode: data.episode ?? null,
              translation: data.translation ?? null,
              startFrom: data.start_from ?? null,
            })
          }
        })
        .finally(() => {
          commit('SET_LOADING', false)
        })
    } else {
      commit('SET_TITLE', title)
      const history: PlayerHistory =
        this.$auth.$storage.getLocalStorage(
          this.$settings.CACHE_KEYS.PLAYER_HISTORY
        ) ?? {}

      if (title.slug in history) {
        const historyRecord = history[title.slug]
        commit('SET_HISTORY', historyRecord)
      }
    }
  },
  push({ commit, state, dispatch }, historyRecord: PlayerHistoryRecord) {
    if (state.title) {
      if (historyRecord.startFrom % 30 === 0) {
        this.$gtag.event(this.$settings.GTAG.PLAYER.EVENTS.WATCHING, {
          event_category: this.$settings.GTAG.PLAYER.TEXT,
          value: historyRecord.startFrom,
        })
        this.$gtag.event(this.$settings.GTAG.PLAYER.EVENTS.WATCHING, {
          event_category: this.$settings.GTAG.PLAYER.TEXT,
          value: state.title.name,
        })
      }
      if (historyRecord.startFrom === 0) {
        this.$gtag.event(this.$settings.GTAG.PLAYER.EVENTS.START, {
          event_category: this.$settings.GTAG.PLAYER.TEXT,
        })
      }

      if (this.$auth.loggedIn || historyRecord.startFrom === 0) {
        const waiter = 'player.pushViewEpisodeHistory'
        state.pendingHistory = historyRecord
        if (!this.$wait.is(waiter)) {
          this.$wait.start(waiter)
          this.$recaptcha()
            .then((captcha) => {
              if (state.pendingHistory !== null) {
                this.$axios
                  .post(
                    '/users/view-episode/',
                    {
                      episode: state.pendingHistory.episode,
                      start_from: state.pendingHistory.startFrom,
                      captcha,
                    },
                    { progress: false, displayToasts: false }
                  )
                  .finally(() => {
                    this.$wait.end(waiter)

                    if (state.pendingHistory) {
                      dispatch('push', state.pendingHistory)
                    }
                  })
              }
              state.pendingHistory = null
            })
            .catch(() => {
              this.$wait.end(waiter)
            })
        }
      } else {
        const history: PlayerHistory =
          this.$auth.$storage.getLocalStorage(
            this.$settings.CACHE_KEYS.PLAYER_HISTORY
          ) ?? {}

        history[state.title.slug] = historyRecord
        this.$auth.$storage.setLocalStorage(
          this.$settings.CACHE_KEYS.PLAYER_HISTORY,
          history
        )
      }
    }
  },
  close({ commit }) {
    commit('RESET_STATE')
    commit('CLOSE_PLAYER')
  },
  minimize({ commit }) {
    commit('MINIMIZE_PLAYER')
  },
  maximize({ commit }) {
    commit('MAXIMIZE_PLAYER')
  },
}

export const strict = false
