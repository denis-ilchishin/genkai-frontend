import { IDType, ImageSet } from './core'

declare interface IUserSubscription {
  id: IDType
}

declare class UserSubscription implements IUserSubscription {
  id: IDType
}

declare interface IUserListTitle {
  id: IDType
}

declare interface IUserList {
  id: IDType
  list_titles: IUserListTitle[]
}

declare class UserList implements IUserList {
  list_titles: IUserListTitle[]
  id: IDType
}

declare interface IUserProfile {
  /* eslint camelcase: 'off' */
  sex: IDType
  image: ImageSet | null
  birthday: string
  about_myself: string
}

declare interface IUser {
  id: IDType
  subscriptions: UserSubscription[]
}

declare class User implements IUser {
  id: IDType
  profile: IUserProfile
  lists: UserList[]
  subscriptions: UserSubscription[]
  notifications_count: number
}
