'use client';
import App from '@/App';
import { store } from '@/store';
import { Provider } from 'react-redux';
import React, { ReactNode, Suspense } from 'react';
import AppLoading from '@/components/layouts/app-loading';
import { ShowError } from '@/components/custom/show-error';
import BarProgressProvider from './bar-progress-provider';

interface IProps {
  children?: ReactNode;
}

const ProviderComponent = ({ children }: IProps) => {
  return (
    <Provider store={store}>
      <BarProgressProvider>
        <Suspense fallback={<AppLoading />}>
          <App>{children} </App>
          <ShowError />
        </Suspense>
      </BarProgressProvider>
    </Provider>
  );
};

export default ProviderComponent;
