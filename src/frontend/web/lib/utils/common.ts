import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { getTranslation } from '@/i18n'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setLocalStorageValue(key: string, value: any) {
  if (typeof window === 'undefined') return

  if (value) {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.removeItem(key)
  }
}

export function getLocalStorageValue<T>(key: string, fallbackValue: T | undefined = undefined): T | undefined {
  if (typeof window === 'undefined') return undefined

  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : fallbackValue
}

export const shortName = (name: string | undefined, username: string | undefined) => {
  const shortName =
    name && name.length >= 2
      ? name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
      : username && username.length >= 2
        ? username.slice(0, 2)
        : ''
  return shortName.toUpperCase()
}

export const isTranslationKeyExist = (key: string) => {
  const { t } = getTranslation()
  return t(key) !== key
}
