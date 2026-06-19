import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

/** Props for the Loading spinner component, which supports a color variant and a size. */
interface LoadingProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/**
 * Loading renders a centered, animated lucide-react spinner whose color and size are controlled via the variant and size props.
 */
const Loading = ({ variant = 'primary', size = 'md', className }: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    danger: 'text-danger',
    warning: 'text-warning',
    info: 'text-info',
    dark: 'text-dark',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size], colorClasses[variant])} />
    </div>
  )
}

export { Loading }
