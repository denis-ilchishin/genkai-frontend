/* eslint camelcase: 'off' */
import { IDType } from './core'
import { ITitleTranslationEpisode } from './title'

export type LastEpisodeResponse = {
  episode: IDType
  translation: IDType
  start_from: number
} | null

export interface PlayerHistoryRecord {
  episode: IDType
  translation: IDType
  startFrom: number
}

export interface PlayerHistory {
  [key: string]: PlayerHistoryRecord
}

export enum EPlayerServiceType {
  KODIK = 'kodik',
  YOUTUBE = 'youtube',
}

export enum EIFrameAction {
  PLAY = 'play',
  STOP = 'stop',
}

export type PlayerAction = (iframe: HTMLIFrameElement) => void

export type PlayerServices = {
  [key in EPlayerServiceType]: {
    buildURL: (url: string, history?: PlayerHistoryRecord | null) => string
    handler: (e: MessageEvent) => void
    actions?: {
      [key in EIFrameAction]: PlayerAction
    }
  }
}

export type ViewEpisode = (
  episode: ITitleTranslationEpisode,
  startFrom: number
) => void
