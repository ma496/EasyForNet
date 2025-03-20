import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setLocalStorageValue(key: string, value: any) {
  if (typeof window === "undefined")
    return

  if (value) {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.removeItem(key)
  }
}

export function getLocalStorageValue<T>(key: string, fallbackValue: T | null = null): T | null {
  if (typeof window === "undefined")
    return null

  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : fallbackValue
}

export const shortName = (name: string | undefined, username: string | undefined) => {
  // split name by space and take first two characters of first two words
  // if name is not provided, use username
  const shortName = name && name.length >= 2 ? name.split(' ').slice(0, 2).map(n => n[0]).join('')
    : username && username.length >= 2 ? username.slice(0, 2) : ''
  return shortName.toUpperCase()
}

