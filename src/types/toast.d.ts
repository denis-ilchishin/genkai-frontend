declare interface IToastOptions {
  color?: string
  closeable?: boolean
  queue?: boolean
  timeout?: number
}

declare interface IToast {
  options: IToastOptions
  text: string
}
