'use client'

import { createContext, useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TranslationContext = createContext<Record<string, any>>({})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let globalDictionary: Record<string, any> = {}

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
