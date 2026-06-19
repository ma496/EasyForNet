'use client'

import { createContext, useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TranslationContext = createContext<Record<string, any>>({})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let globalDictionary: Record<string, any> = {}

/**
 * Context provider that publishes the current locale's translation dictionary to descendants and updates a module-level {@link globalDictionary} reference inside an effect so non-React code can read translations.
 */
export const TranslationProvider = ({
  dictionary,
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dictionary: Record<string, any>
  children: React.ReactNode
}) => {
  // globalDictionary = dictionary
  // globalDictionary = dictionary
  // Side effect moved to useEffect
  useEffect(() => {
    globalDictionary = dictionary
  }, [dictionary])
  return <TranslationContext.Provider value={dictionary}>{children}</TranslationContext.Provider>
}
