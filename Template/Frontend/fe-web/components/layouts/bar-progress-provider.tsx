'use client'

import { ProgressProvider } from '@bprogress/next/app'

const BarProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider height="3px" color="#805CCA" options={{ showSpinner: false }} shallowRouting>
      {children}
    </ProgressProvider>
  )
}

export default BarProgressProvider
