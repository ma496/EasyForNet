'use client';
import { useAppSelector } from '@/store/hooks';
import React from 'react';

const MainContainer = ({ children }: { children: React.ReactNode }) => {
  const themeConfig = useAppSelector((state) => state.theme);
  return <div className={`${themeConfig.navbar} main-container min-h-screen text-black dark:text-white-dark`}> {children}</div>;
};

export default MainContainer;
