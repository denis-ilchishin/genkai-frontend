// @ts-nocheck
import Vue from 'vue'
import { ActionTree, MutationTree, Store } from 'vuex'
import { IDType, ImageSet } from '~/types/core'
import { UserSubscription } from '~/types/user'

const prefix = 'user'

export const state = () => ({})

type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  ADD_SUBSCRIPTION(this: Store<{}>, state, subscription: UserSubscription) {
    this.$auth.user.subscriptions?.push(subscription)
  },
  DELETE_SUBSCRIPTION(this: Store<{}>, state, subscriptionId: IDType) {
    const index = this.$auth.user.subscriptions?.findIndex(
      (subscription) => subscription.id === subscriptionId
    )
    if (
      typeof index !== 'undefined' &&
      index !== -1 &&
      this.$auth.user.subscriptions
    ) {
      delete this.$auth.user.subscriptions[index]
    }
  },
  SET_IMAGE(this: Store<{}>, state, image: ImageSet) {
    if (this.$auth.user.profile) this.$auth.user.profile.image = image
  },
  REMOVE_IMAGE(this: Store<{}>, state) {
    if (this.$auth.user.profile) this.$auth.user.profile.image = null
  },
  ADD_LIST_TITLE(this: Store<{}>, state, listTitle) {
    const list = this.$auth.user.lists?.find(
      (list) => list.id === listTitle.list
    )
    if (list) {
      list.list_titles.unshift(listTitle)
    }
  },
  DELETE_LIST_TITLE(this: Store<{}>, state, { listId, listTitleId }) {
    const listIndex = this.$auth.user.lists?.findIndex(
      (list) => list.id === listId
    )
    if (
      typeof listIndex !== 'undefined' &&
      listIndex !== -1 &&
      this.$auth.user.lists
    ) {
      const listTitleIndex = this.$auth.user.lists[
        listIndex
      ].list_titles.findIndex((listTitle) => listTitle.id === listTitleId)
      if (typeof listTitleIndex !== 'undefined') {
        Vue.delete(this.$auth.user.lists[listIndex].list_titles, listTitleIndex)
      }
    }
  },
  SET_NOTIFICATIONS_COUNT(this: Store<{}>, state, count) {
    if (this.$auth.loggedIn) this.$auth.user.notifications_count = count
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async addSubscription({ dispatch, commit }, { translatorId, titleSlug }) {
    dispatch(
      'wait/start',
      `${prefix}.addSubscription.${titleSlug}.${translatorId}`,
      {
        root: true,
      }
    )
    await this.$axios
      .$post(
        'users/subscriptions/',
        {
          title: titleSlug,
          translator: translatorId,
        },
        { progress: false }
      )
      .then((data) => {
        commit('ADD_SUBSCRIPTION', data)
      })
      .catch((err) => {
        return Promise.reject(err)
      })
      .finally(() => {
        dispatch(
          'wait/end',
          `${prefix}.addSubscription.${titleSlug}.${translatorId}`,
          {
            root: true,
          }
        )
      })
  },
  async deleteSubscription(
    { dispatch, commit },
    { subscriptionId, titleSlug, translatorId }
  ) {
    dispatch(
      'wait/start',
      `${prefix}.deleleSubscription.${titleSlug}.${translatorId}`,
      {
        root: true,
      }
    )
    await this.$axios
      .delete(`users/subscriptions/${subscriptionId}/`, { progress: false })
      .then(() => {
        commit('DELETE_SUBSCRIPTION', subscriptionId)
      })
      .catch((err) => {
        return Promise.reject(err)
      })
      .finally(() => {
        dispatch(
          'wait/end',
          `${prefix}.deleleSubscription.${titleSlug}.${translatorId}`,
          {
            root: true,
          }
        )
      })
  },
  async changeImage({ dispatch, commit }, blob) {
    dispatch('wait/start', `${prefix}.changeImage`, {
      root: true,
    })

    const formData = new FormData()
    formData.append('image', blob)

    await this.$axios
      .$post(`users/change-image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((data) => {
        commit('SET_IMAGE', data)
      })
      .catch((err) => {
        return Promise.reject(err)
      })
      .finally(() => {
        dispatch('wait/end', `${prefix}.changeImage`, {
          root: true,
        })
      })
  },
  async removeImage({ dispatch, commit }) {
    dispatch('wait/start', `${prefix}.removeImage`, {
      root: true,
    })
    await this.$axios
      .post(`users/remove-image/`)
      .then(() => {
        commit('REMOVE_IMAGE')
      })
      .catch((err) => {
        return Promise.reject(err)
      })
      .finally(() => {
        dispatch('wait/end', `${prefix}.removeImage`, {
          root: true,
        })
      })
  },
  async addListTitle({ dispatch, commit }, { listId, titleSlug }) {
    dispatch('wait/start', `${prefix}.addListTitle.${listId}`, {
      root: true,
    })

    await this.$axios
      .$post(
        `users/lists/titles/`,
        { list: listId, title: titleSlug },
        { progress: false }
      )
      .then((listTitle) => {
        commit('ADD_LIST_TITLE', listTitle)
      })
      .catch((err) => {
        return Promise.reject(err)
      })
      .finally(() => {
        dispatch('wait/end', `${prefix}.addListTitle.${listId}`, {
          root: true,
        })
      })
  },
  async deleteListTitle({ dispatch, commit }, { listId, listTitleId }) {
    dispatch('wait/start', `${prefix}.deleteListTitle.${listId}`, {
      root: true,
    })

    await this.$axios
      .delete(`users/lists/titles/${listTitleId}/`, { progress: false })
      .then(() => {
        commit('DELETE_LIST_TITLE', { listId, listTitleId })
      })
      .catch((err) => {
        return Promise.reject(err)
      })
      .finally(() => {
        dispatch('wait/end', `${prefix}.deleteListTitle.${listId}`, {
          root: true,
        })
      })
  },
}
