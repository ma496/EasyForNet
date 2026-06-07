'use client'
import App from '@/App'
import { store } from '@/store'
import { Provider } from 'react-redux'
import { ReactNode, Suspense } from 'react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import AppLoading from '@/components/layouts/app-loading'
import BarProgressProvider from './bar-progress-provider'

interface IProps {
  children?: ReactNode
}

const ProviderComponent = ({ children }: IProps) => {
  return (
    <Provider store={store}>
      <NuqsAdapter>
        <BarProgressProvider>
          <Suspense fallback={<AppLoading />}>
            <App>{children}</App>
          </Suspense>
        </BarProgressProvider>
      </NuqsAdapter>
    </Provider>
  )
}

export default ProviderComponent
