import { Plugin } from '@nuxt/types'

const settings = {
  API_URL_CLIENT: process.env.API_URL_CLIENT as string,
  API_URL_SERVER: process.env.API_URL_SERVER as string,
  RECAPTCHA_PUBLIC_KEY: process.env.RECAPTCHA_PUBLIC_KEY as string,
  PUSH_NOTIFICATIONS_APPLICATION_SERVER_KEY: process.env
    .PUSH_NOTIFICATIONS_APPLICATION_SERVER_KEY as string,
  GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID as string,
  GTAG: {
    PLAYER: {
      TEXT: 'Плеер',
      EVENTS: {
        OPEN: 'Открытие плеера',
        MINIMIZE: 'Сворачивание плеера',
        START: 'Начало просмотра',
        WATCHING: 'Просмотр видео',
      },
    },
  },
  IMAGE_PLACEHOLDERS: {
    DEFAULT: '../assets/images/placeholder.jpg',
    POSTER: '../assets/images/placeholder-poster.jpg',
  },
  IMAGE_WIDTH_RATIO: 0.716,
  IMAGE_HEIGHT_RATIO: 1.39,
  COMMENT_RATES: {
    LIKE: 1,
    DISLIKE: 0,
  },
  TITLE_STATUS_COLORS: {
    // key = type's ID from server
    released: '#DC2626',
    ongoing: '#059669',
    announce: '#7C3AED',
  },
  FILTER_ORDERINGS: {
    RATING: '-relevant_data__rating_average',
    RANK: 'relevant_data__rank',
    VIEWS: '-relevant_data__views_total',
    YEAR_DESC: '-year',
    YEAR_ASC: 'year',
    NAME_DESC: '-name',
    NAME_ASC: 'name',
  },
  FILTER_PARAMS: ['status', 'genres', 'type'],
  NON_FIELD_ERRORS_KEY: 'non_field_errors',
  ALLOWED_IMAGE_MIME: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
  SIDENAV_WIDTH: 300,
  SIDENAV_MINI_WIDTH: 56,
  BOTNAV_HEIGHT: 51,
  TOPNAV_HEIGHT: 52,
  ACCOUNT_NAV_LIST: [
    {
      text: 'nav.account.notifications',
      route: { name: 'account-notifications' },
      icon: 'notifications',
    },
    {
      text: 'nav.account.lists',
      route: { name: 'account-lists' },
      icon: 'list',
    },
    {
      text: 'nav.account.profile',
      route: { name: 'account-profile' },
      icon: 'account_box',
    },
    // {
    //   text: 'nav.account.subscriptions',
    //   route: { name: 'account-subscriptions' },
    //   icon: 'subscriptions',
    // },
  ],
  CACHE_KEYS: {
    NOTIFICATION_PERMISSION: 'notification.permission',
    NOTIFICATION_NOT_SUPPORTED: 'notification.notSupported',
    PLAYER_MINIMIZED_POSITION: 'player.position',
    PLAYER_HISTORY: 'player.history',
  },
  PLAYER: {
    PUSH_HISTORY_INTERVAL: 10,
  },
}

type SettingsType = typeof settings

declare module 'vue/types/vue' {
  interface Vue {
    $settings: SettingsType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $settings: SettingsType
  }
  interface Context {
    $settings: SettingsType
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $settings: SettingsType
  }
}

const SettingsPlugin: Plugin = (context, inject) => {
  inject('settings', settings)
}

export default SettingsPlugin
