import {
  computed,
  getCurrentInstance,
  useContext
} from '@nuxtjs/composition-api'
import { useCommon } from '~/composables/common'
import { PlayerHistoryRecord } from '~/types/player'
// import { InitialData, ViewEpisode } from '~/types/player'
import { ITitle } from '~/types/title'

export const usePlayerBase = () => {
  const { store, $axios, $wait, route } = useContext()
  const vm = getCurrentInstance()
  const title = computed<null | ITitle>(() => store.getters['player/playing'])
  const history = computed<null | PlayerHistoryRecord>(
    () => store.getters['player/history']
  )
  const isMaximized = computed<boolean>(
    () => store.getters['player/isMaximized']
  )
  const isMinimized = computed<boolean>(
    () => store.getters['player/isMinimized']
  )
  const isPlayerOpening = computed<boolean>(
    () => store.getters['player/isOpening']
  )
  const minimize = () => {
    store.dispatch('player/minimize')
  }
  const maximize = () => {
    store.dispatch('player/maximize')
  }
  const openCurrent = () => {
    if (isCurrentTitlePage.value) {
      minimize()
    } else if (vm && title.value) {
      vm?.$router.push({
        name: 'title-slug',
        params: { slug: title.value.slug },
      })
      minimize()
    }
  }
  const close = () => {
    store.dispatch('player/close')
  }
  const play = (title: ITitle) => {
    store.dispatch('player/play', title)
  }
  const isCurrentTitlePage = computed(() => {
    return (
      title.value &&
      route.value.name === 'title-slug' &&
      route.value.params.slug === title.value.slug
    )
  })

  const common = useCommon()

  const isMovie = computed<boolean>(() => common.isMovie(title.value?.type))
  const isOngoing = computed<boolean>(() =>
    common.isOngoing(title.value?.status)
  )
  const isAnnounce = computed<boolean>(() =>
    common.isAnnounce(title.value?.status)
  )

  return {
    title,
    minimize,
    maximize,
    close,
    openCurrent,
    isMinimized,
    isMaximized,
    isMovie,
    isOngoing,
    isAnnounce,
    isPlayerOpening,
    play,
    history,
    isCurrentTitlePage,
  }
}
