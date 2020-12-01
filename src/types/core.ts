import { BreakpointName } from 'vuetify/types/services/breakpoint'

export type IDType = number

export type ObjectType = {
  [key: string]: any
}

export enum EImageFormat {
  WEBP = 'webp',
  JPEG = 'jpeg',
}

export enum EImageQuality {
  LOW = '1x',
  HIGH = '2x',
}

export enum EImageSize {
  SMALL = 'small',
  MEDUIM = 'medium',
  BIG = 'big',
}

export type ImageSet = {
  [key in EImageFormat]: {
    [key in EImageQuality]: {
      [key in EImageSize]: string
    }
  }
}

type AtLeastOne<T> = { [K in keyof T]: Pick<T, K> }[keyof T]

export type ImageSizeProp =
  | EImageSize
  | AtLeastOne<{ [key in BreakpointName]: EImageSize }>

export type UpdateServices = 'kodik'

export type IChoices = {
  [key: string]: string | number
}

export interface IBaseTitle {
  name: string
  slug: string
  poster: ImageSet
}
