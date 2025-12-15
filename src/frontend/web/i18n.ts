const cookieObj = typeof window === 'undefined' ? require('next/headers') : require('universal-cookie')

import en from './public/locales/en.json'
import ur from './public/locales/ur.json'
import zh from './public/locales/zh.json'


const langObj: any = { en, ur, zh }

const getLangAsync = async () => {
  let lang = null
  if (typeof window !== 'undefined') {
    const cookies = new cookieObj(null, { path: '/' })
    lang = cookies.get('i18nextLng')
  } else {
    const cookies = await cookieObj.cookies()
    lang = cookies.get('i18nextLng')?.value
  }
  return lang
}

const getLang = () => {
  let lang = null
  if (typeof window !== 'undefined') {
    const cookies = new cookieObj(null, { path: '/' })
    lang = cookies.get('i18nextLng')
  } else {
    // For server-side, return default language when sync access is needed
    lang = 'en'
  }
  return lang
}

export const getTranslation = () => {
  const lang = getLang()
  const data: any = langObj[lang || 'en']

  const t = (key: string, variables?: Record<string, any>) => {
    let text = data[key] ? data[key] : key
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        text = text.replace(`\${${key}}`, value)
      })
    }
    return text
  }

  const initLocale = (themeLocale: string) => {
    const lang = getLang()
    i18n.changeLanguage(lang || themeLocale)
  }

  const i18n = {
    language: lang,
    changeLanguage: (lang: string) => {
      const cookies = new cookieObj(null, { path: '/' })
      cookies.set('i18nextLng', lang)
    },
  }

  return { t, i18n, initLocale }
}

export const getTranslationAsync = async () => {
  const lang = await getLangAsync()
  const data: any = langObj[lang || 'en']

  const t = (key: string, variables?: Record<string, any>) => {
    let text = data[key] ? data[key] : key
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        text = text.replace(`\${${key}}`, value)
      })
    }
    return text
  }

  const initLocale = async (themeLocale: string) => {
    const lang = await getLangAsync()
    i18n.changeLanguage(lang || themeLocale)
  }

  const i18n = {
    language: lang,
    changeLanguage: (lang: string) => {
      const cookies = new cookieObj(null, { path: '/' })
      cookies.set('i18nextLng', lang)
    },
  }

  return { t, i18n, initLocale }
}
