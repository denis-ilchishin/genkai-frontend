/* eslint camelcase: 'off' */
import { GetterTree, MutationTree } from 'vuex'
import { IChoices } from '~/types/core'

const sortByNameAttribute = (a: any, b: any) => a.name.localeCompare(b.name)

type TInitData = {
  year_seasons: IChoices
  statuses: IChoices
  sources: IChoices
  types: IChoices
  age_ratings: IChoices
  release_days: IChoices
  notification_types: IChoices
  sex: IChoices
  inputs: object
  genres: Genre[]
  studios: Studio[]
  countries: Country[]
  movie_type: string
  ongoing_status: string
  announce_status: string
  catalog_routes: CatalogRoutes
}

interface IState {
  inputs: object
  yearSeasons: IChoices
  genres: Genre[]
  studios: Studio[]
  countries: Country[]
  statuses: IChoices
  sources: IChoices
  types: IChoices
  releaseDays: IChoices
  ageRatings: IChoices
  sex: IChoices
  notificationTypes: IChoices
  movieType: string
  ongoingStatus: string
  announceStatus: string
  catalogRoutes: CatalogRoutes
}

export const strict = false

export const state = () =>
  ({
    inputs: {},
    yearSeasons: {},
    genres: [],
    ageRatings: {},
    countries: [],
    notificationTypes: {},
    releaseDays: {},
    sex: {},
    sources: {},
    statuses: {},
    studios: [],
    types: {},
    movieType: '',
    ongoingStatus: '',
    announceStatus: '',
    catalogRoutes: {},
  } as IState)

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  input: (state) => (key: string, def = null): any => {
    const paths = key.split('.')
    let result = state.inputs
    for (const path of paths) {
      if (typeof result[path as never] === 'undefined') return def
      result = result[path as never]
    }
    return result
  },
  yearSeasons: (state) => state.yearSeasons,
  genres: (state) => state.genres.sort((a, b) => sortByNameAttribute(a, b)),
  studios: (state) => state.studios.sort((a, b) => sortByNameAttribute(a, b)),
  countries: (state) =>
    state.countries.sort((a, b) => sortByNameAttribute(a, b)),
  statuses: (state) => state.statuses,
  sources: (state) => state.sources,
  types: (state) => state.types,
  releaseDays: (state) => state.releaseDays,
  ageRatings: (state) => state.ageRatings,
  sex: (state) => state.sex,
  notificationTypes: (state) => state.notificationTypes,
  catalogRoutes: (state) => state.catalogRoutes,
  movieType: (state) => state.movieType,
  ongoingStatus: (state) => state.ongoingStatus,
  announceStatus: (state) => state.announceStatus,
}

export const mutations: MutationTree<RootState> = {
  SET_DATA(state, data: TInitData) {
    state.ageRatings = data.age_ratings
    state.countries = data.countries
    state.genres = data.genres
    state.inputs = data.inputs
    state.notificationTypes = data.notification_types
    state.releaseDays = data.release_days
    state.sex = data.sex
    state.sources = data.sources
    state.statuses = data.statuses
    state.studios = data.studios
    state.types = data.types
    state.yearSeasons = data.year_seasons
    state.movieType = data.movie_type
    state.ongoingStatus = data.ongoing_status
    state.announceStatus = data.announce_status
    state.catalogRoutes = data.catalog_routes
  },
}
