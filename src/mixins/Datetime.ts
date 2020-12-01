import { getCurrentInstance } from '@nuxtjs/composition-api'

export const useDatetime = () => {
  const getDateChrono = (
    date: string | Date,
    options: {
      monthFormat: string
      yearFormat: string
      yesterdayFormat?: string
    } = {
      monthFormat: 'monthDay',
      yearFormat: 'yearMonthDay',
    }
  ) => {
    const vm = getCurrentInstance()
    const now = new Date()
    const nowStamp = Date.now() / 1000
    const _date = date instanceof Date ? date : new Date(date)
    const dateStamp = _date.getTime() / 1000

    if (now.getFullYear() - _date.getFullYear() < 1) {
      if (now.getMonth() - _date.getMonth() < 1) {
        if (now.getDate() - _date.getDate() > 1) {
          return vm?.$d(_date, options.monthFormat)
        } else if (
          now.getDate() - _date.getDate() > 0 &&
          now.getDate() - _date.getDate() <= 1
        ) {
          if (options.yesterdayFormat) {
            return vm?.$t('dates.yesterdayTime', {
              time: vm?.$d(_date, options.yesterdayFormat),
            })
          } else {
            return vm?.$t('dates.yesterday')
          }
        } else {
          const difference = (nowStamp - dateStamp) / 3600 // hours
          if (difference >= 1) {
            return vm?.$t('dates.hoursBefore', {
              hours: Math.floor(difference),
            })
          } else {
            return vm?.$t('dates.minutesBefore', {
              minutes: Math.floor(60 * difference), // minutes
            })
          }
        }
      } else {
        return vm?.$d(_date, options.monthFormat)
      }
    } else {
      return vm?.$d(_date, options.yearFormat)
    }
  }

  return {
    getDateChrono,
  }
}
