/* eslint camelcase: 'off' */

import { IBaseTitle, IDType } from './core'
import { EPlayerServiceType } from './player'
import { ITranslator } from './translator'

type TitleType = string
type TitleStatus = string

declare interface IRelevantDataTitle {
  relevant_data: ITitleRelevantData
}

declare interface ITitleGenres {
  genres: IGenre[]
}
declare interface ITitleCountries {
  countries: ICountry[]
}
declare interface ITitleStudios {
  countries: IStudio[]
}

interface IUpdateTitle extends IBaseTitle {
  type: TitleType
}

interface IUpdateTranslation {
  id: IDType
  title: IUpdateTitle
  translator: ITranslator
}

declare interface IUpdateEpisode {
  id: IDType
  number: number | null
  name: string | null
  translation: IUpdateTranslation
  date_created: string
}

declare interface ITitleRelevantData {
  rank: string | number
  rank_previous: string | number
  rating_average: string | number
  rating_total: string | number
  views_total: string | number
}

declare interface ICurrentSeasonTitle
  extends IBaseTitle,
    IRelevantDataTitle,
    ITitleGenres {
  total_episodes: string | number
  type: TitleType
  year: number
}

declare interface IPopularTitle extends IBaseTitle, IRelevantDataTitle {
  status: TitleStatus
}

declare interface ILatestTitle extends IBaseTitle, ITitleGenres {
  year: number
  type: TitleType
}

declare interface IWatchOrderTitle {
  name: string
  slug: string
  total_episodes: string
  type: string
  year: number
}

declare interface IWatchOrder {
  description: null | string
  name: null | string
  ordering: number
  title: null | IWatchOrderTitle
  total_episodes: null | string
  type: null | string
  year: null | number
}

declare interface ITitleTranslationEpisode {
  id: IDType
  name: string
  number: number
  url: string
}

declare interface ITitleTranslation {
  episodes: ITitleTranslationEpisode[]
  id: IDType
  is_other: boolean
  service: EPlayerServiceType
  url: string
  translator: ITranslator
}

declare interface ITitle
  extends IBaseTitle,
    IRelevantDataTitle,
    ITitleGenres,
    ITitleStudios,
    ITitleCountries {
  age_ratings: null | string
  description: string
  duration: string
  last_episode: number
  other_names: string[]
  release_day: string
  season: number
  source: string
  status: string
  total_episodes: string
  type: string
  year_season: string
  year: number
  watch_orders: null | IWatchOrder[]
  translations: ITitleTranslation[]
}
