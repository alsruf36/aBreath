export interface ILocales {
  [key: string]: {
    name: string
    iso: string
    flag: string
  }
}

export const availableLocales: ILocales = {
  ko: {
    name: '한국어',
    iso: 'ko',
    flag: 'i-twemoji-flag-south-korea',
  },
  en: {
    name: 'English',
    iso: 'en',
    flag: 'i-twemoji-flag-us-outlying-islands',
  },
}
