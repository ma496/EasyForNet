'use client';
import React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

interface IProps extends ThemeProviderProps {
}

const ThemesProvider = ({ children, ...props }: IProps) => {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  )
}

export default ThemesProvider
