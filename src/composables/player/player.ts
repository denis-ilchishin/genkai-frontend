import {
  computed,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  Ref,
  ref,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import { useCommon } from '~/composables/common'
import { EIFrameAction } from '~/types/player'
import { ITitleTranslation, ITitleTranslationEpisode } from '~/types/title'
import { usePlayerBase } from './base'
import { usePlayerIframe } from './iframe'

export const usePlayer = (iframeRef: Ref<null | HTMLIFrameElement>) => {
  const { store } = useContext()
  const { isMobile } = useCommon()
  const vm = getCurrentInstance()

  const { title, isMovie, isMaximized, history } = usePlayerBase()

  const episode = ref<null | ITitleTranslationEpisode>(null)
  const translation = ref<null | ITitleTranslation>(null)

  const { services } = usePlayerIframe(translation, episode)

  const showPlaceholder = computed<boolean>(() => !episode.value)
  const translations = computed<ITitleTranslation[]>(() =>
    title.value ? title.value.translations : []
  )
  const episodes = computed<ITitleTranslationEpisode[]>(() =>
    translation.value ? translation.value.episodes : []
  )
  const isPlayerLoading = ref<boolean>(true)

  const onPlaceholderPlay = () => {
    if (!translation.value && title.value) {
      translation.value = title.value.translations[0]
    }

    if (!episode.value && translation.value) {
      episode.value = translation.value.episodes[0]
    }
  }

  const url = computed<null | string>(() =>
    episode.value && translation.value
      ? services[translation.value.service].buildURL(
          episode.value.url,
          history.value
        )
      : null
  )

  const hasMoreThanOneEpisode = computed<boolean>(() => {
    for (const t of translations.value) {
      if (t.episodes.length > 1) return true
    }

    return false
  })

  const hideEpisodeSelector = computed<boolean>(() => {
    if (isMovie.value && !hasMoreThanOneEpisode.value) return true

    return false
  })

  watch(translation, (t) => {
    if (t) {
      if (hideEpisodeSelector.value) {
        episode.value = t.episodes[0]
      }
    }
  })

  watch(episode, (e) => {
    if (e) {
      isPlayerLoading.value = true
    }
  })

  watch(
    () => translation.value?.service,
    (service, oldService) => {
      if (window) {
        if (service) {
          window.addEventListener('message', services[service].handler, false)
        } else if (oldService) {
          window.removeEventListener('message', services[oldService].handler)
        }
      }
    }
  )

  watch(title, (t) => {
    if (t === null && translation.value) {
      window.removeEventListener(
        'message',
        services[translation.value.service].handler
      )
    } else if (translation.value) {
      window.addEventListener(
        'message',
        services[translation.value.service].handler,
        false
      )
    }
    if (t && !episode.value && history.value) {
      const _translation = t.translations.find(
        (t) => t.id === history.value?.translation
      )
      if (_translation) {
        translation.value = _translation

        const _episode = translation.value.episodes.find(
          (e) => e.id === history.value?.episode
        )

        if (_episode) {
          episode.value = _episode
        }
      }
    }
    if (!t) {
      episode.value = null
      translation.value = null
    }
  })

  const getTranslationText = (tr: ITitleTranslation) => {
    return isMovie.value
      ? vm?.$t('title.translations.translatorMovieText', {
          translator: tr.translator.name,
        })
      : vm?.$t('title.translations.translatorText', {
          translator: tr.translator.name,
          range: tr.episodes.length,
        })
  }

  const getEpisodeText = (ep: ITitleTranslationEpisode) => {
    return (
      ep.name ||
      vm?.$t('title.translations.episodeText', { episode: ep.number })
    )
  }

  const onIframeLoad = () => {
    isPlayerLoading.value = false
    // fireAction(EIFrameAction.PLAY)
  }

  const fireAction = (action: EIFrameAction) => {
    if (
      window &&
      iframeRef.value &&
      !isPlayerLoading.value &&
      translation.value &&
      services[translation.value.service].actions
    ) {
      const actions = services[translation.value.service].actions
      if (actions) {
        actions[action](iframeRef.value)
      }
    }
  }

  const onFullscreen = (e: Event) => {
    setTimeout(() => {
      if (document.fullscreenEnabled) {
        screen.orientation.lock('landscape')
      } else {
        screen.orientation.unlock()
      }
    })
  }

  onMounted(() => {
    if (isMobile && Object.prototype.hasOwnProperty.call(window, 'screen')) {
      document.addEventListener('fullscreenchange', onFullscreen, false)
      document.addEventListener('webkitfullscreenchange', onFullscreen, false)
      document.addEventListener('mozfullscreenchange', onFullscreen, false)
    }
  })

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', onFullscreen)
    document.removeEventListener('webkitfullscreenchange', onFullscreen)
    document.removeEventListener('mozfullscreenchange', onFullscreen)
    if (translation.value) {
      window.removeEventListener(
        'message',
        services[translation.value.service].handler
      )
    }
  })

  return {
    showPlaceholder,
    isPlayerLoading,
    episode,
    translation,
    translations,
    episodes,
    getTranslationText,
    getEpisodeText,
    onPlaceholderPlay,
    url,
    hideEpisodeSelector,
    onIframeLoad,
  }
}
