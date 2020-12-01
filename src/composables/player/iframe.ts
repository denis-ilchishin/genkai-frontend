import { Ref, useContext } from '@nuxtjs/composition-api'
import {
  EIFrameAction,
  EPlayerServiceType,
  PlayerHistoryRecord,
  PlayerServices
} from '~/types/player'
import { ITitleTranslation, ITitleTranslationEpisode } from '~/types/title'

const buildURL = (url: string, params: { [key: string]: any }) => {
  return url + '?' + new URLSearchParams(params).toString()
}

export const usePlayerIframe = (
  translation: Ref<null | ITitleTranslation>,
  episode: Ref<null | ITitleTranslationEpisode>
) => {
  const { store, $settings, $auth, $gtag } = useContext()

  const pushPlayerHistory = (startFrom: number = 0) => {
    if (translation.value && episode.value) {
      store.dispatch('player/push', {
        episode: episode.value.id,
        translation: translation.value.id,
        startFrom,
      } as PlayerHistoryRecord)
    }
  }

  const services: PlayerServices = {
    [EPlayerServiceType.KODIK]: {
      buildURL: (url, history) => {
        return buildURL(url, {
          hide_selectors: 'true',
          start_from:
            history?.episode === episode.value?.id ? history?.startFrom : 0,
        })
      },
      handler: (e: MessageEvent) => {
        if (e.data) {
          switch (e.data.key) {
            case 'kodik_player_time_update':
              if (
                !$auth.loggedIn ||
                parseInt(e.data.value) %
                  $settings.PLAYER.PUSH_HISTORY_INTERVAL ===
                  0
              ) {
                pushPlayerHistory(parseInt(e.data.value))
              }
              break

            case 'kodik_player_video_started':
              if (!$auth.loggedIn) {
                pushPlayerHistory()
              }
              break
          }
        }
      },
      actions: {
        [EIFrameAction.PLAY]: (iframe: HTMLIFrameElement) => {
          iframe.contentWindow?.postMessage(
            {
              key: 'kodik_player_api',
              value: { method: 'play' },
            },
            '*'
          )
        },
        [EIFrameAction.STOP]: (iframe: HTMLIFrameElement) => {
          iframe.contentWindow?.postMessage(
            {
              key: 'kodik_player_api',
              value: { method: 'pause' },
            },
            '*'
          )
        },
      },
    },
    [EPlayerServiceType.YOUTUBE]: {
      buildURL: (url: string) => url,
      handler: (e: Event) => {},
    },
  }

  return {
    services,
  }
}
