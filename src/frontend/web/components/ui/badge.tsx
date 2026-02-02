'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva('badge', {
  variants: {
    variant: {
      primary: '',
      secondary: '',
      success: '',
      danger: '',
      warning: '',
      info: '',
      dark: '',
    },
    type: {
      solid: '',
      outline: '',
    },
  },
  compoundVariants: [
    // Solid variants
    { variant: 'primary', type: 'solid', className: 'badge-primary' },
    { variant: 'secondary', type: 'solid', className: 'badge-secondary' },
    { variant: 'success', type: 'solid', className: 'badge-success' },
    { variant: 'danger', type: 'solid', className: 'badge-danger' },
    { variant: 'warning', type: 'solid', className: 'badge-warning' },
    { variant: 'info', type: 'solid', className: 'badge-info' },
    { variant: 'dark', type: 'solid', className: 'badge-dark' },
    // Outline variants
    { variant: 'primary', type: 'outline', className: 'badge-outline-primary' },
    { variant: 'secondary', type: 'outline', className: 'badge-outline-secondary' },
    { variant: 'success', type: 'outline', className: 'badge-outline-success' },
    { variant: 'danger', type: 'outline', className: 'badge-outline-danger' },
    { variant: 'warning', type: 'outline', className: 'badge-outline-warning' },
    { variant: 'info', type: 'outline', className: 'badge-outline-info' },
    { variant: 'dark', type: 'outline', className: 'badge-outline-dark' },
  ],
  defaultVariants: {
    variant: 'primary',
    type: 'solid',
  },
})

export interface IBadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  children: React.ReactNode
}

export const Badge: React.FC<IBadgeProps> = ({
  children,
  variant,
  type,
  className,
  ...props
}) => {
  return (
    <span className={cn(badgeVariants({ variant, type }), className)} {...props}>
      {children}
    </span>
  )
}

export { badgeVariants }
