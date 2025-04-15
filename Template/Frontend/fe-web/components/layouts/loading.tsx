import React from 'react';
import { Loading } from '@/components/ui/loading';

const AppLoading = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <Loading size='xl' />
    </div>
  );
};

export default AppLoading;
