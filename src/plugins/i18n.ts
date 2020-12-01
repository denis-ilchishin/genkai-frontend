import VueI18n from 'vue-i18n'
import locales from '~/locales/ru.json'

const dateTimeFormats = {
  ru: {
    fullFormat: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
    },
    yearMonthDay: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    yearMonthDayHours: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
    },
    yearMonthDayHourMinute: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    },
    monthDay: {
      month: 'short',
      day: 'numeric',
    },
    monthDayHour: {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
    },
    monthDayHourMinute: {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    },
    hourMinute: {
      hour: 'numeric',
      minute: 'numeric',
    },
    dayTime: {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
}
// /**
//  * @param choice {number} a choice index given by the input to $tc: `$tc('path.to.rule', choiceIndex)`
//  * @param choicesLength {number} an overall amount of available choices
//  * @returns a final choice index to select plural word by
//  **/
VueI18n.prototype.getChoiceIndex = function (choice, choicesLength) {
  // this === VueI18n instance, so the locale property also exists here
  if (this.locale !== 'ru') {
    // proceed to the default implementation
  }

  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1

  if (!teen && endsWithOne) {
    return 1
  }

  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return choicesLength < 4 ? 2 : 3
}

export default () => {
  return {
    dateTimeFormats,
    locale: 'ru',
    fallbackLocale: 'ru',
    messages: {
      ru: locales,
    },
  }
}
