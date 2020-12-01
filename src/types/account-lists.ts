/* eslint camelcase: 'off' */

import { IBaseTitle, IDType } from './core'

declare interface IListTitleTitle extends IBaseTitle {
  status: number
  year: number
  type: number
}

declare interface IListTitle {
  id: IDType
  title: IListTitleTitle[]
}

declare interface IUserList {
  id: IDType
  name: string
  list_titles: IListTitle[]
}
