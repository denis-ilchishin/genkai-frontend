import { onMounted, ref, useContext } from '@nuxtjs/composition-api'

export const useCommon = () => {
  const { store, $settings } = useContext()
  const isMobile = store.getters.isMobile
  const isMounted = ref<boolean>(false)

  const isMovie: (value: any) => boolean = (value) =>
    Boolean(value && value === store.getters['config/movieType'])

  const isOngoing: (value: any) => boolean = (value) =>
    Boolean(value && value === store.getters['config/ongoingStatus'])

  const isAnnounce: (value: any) => boolean = (value) =>
    Boolean(value && value === store.getters['config/announceStatus'])

  const toDuration = (value: string | number) => {
    const minutes = typeof value === 'string' ? parseInt(value) : value

    const hours = Math.trunc(minutes / 60)

    const leftMinutes = minutes % 60

    const format = (number: number) => {
      if (number <= 9) {
        return `0${number}`
      }
      return `${number}`
    }

    return `${format(hours)}:${format(leftMinutes)}`
  }

  onMounted(() => {
    isMounted.value = true
  })

  return {
    isMobile,
    isMounted,
    isMovie,
    isOngoing,
    isAnnounce,
    toDuration,
  }
}
