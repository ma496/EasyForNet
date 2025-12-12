import React, { ButtonHTMLAttributes } from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const iconButtonVariants = cva('btn cursor-pointer inline-flex items-center justify-center aspect-square p-0!', {
  variants: {
    variant: {
      default: 'btn-primary',
      outline: 'btn-outline-primary',
      info: 'btn-info',
      'outline-info': 'btn-outline-info',
      success: 'btn-success',
      'outline-success': 'btn-outline-success',
      warning: 'btn-warning',
      'outline-warning': 'btn-outline-warning',
      danger: 'btn-danger',
      'outline-danger': 'btn-outline-danger',
      secondary: 'btn-secondary',
      'outline-secondary': 'btn-outline-secondary',
      dark: 'btn-dark',
      'outline-dark': 'btn-outline-dark',
    },
    size: {
      sm: 'p-1.5 w-8 h-8',
      default: 'p-2 w-10 h-10',
      lg: 'p-2.5 w-12 h-12',
    },
    rounded: {
      default: '',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    rounded: 'default',
  },
})

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode
  isLoading?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({ className, variant, size, rounded, icon, isLoading, disabled, ...props }, ref) => {
  return (
    <button
      type='button'
      className={cn(iconButtonVariants({ variant, size, rounded }), className)}
      ref={ref}
      disabled={disabled || isLoading}
      {...props}>
      <div className="flex items-center justify-center">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>{icon}</span>}</div>
    </button>
  )
})

IconButton.displayName = 'IconButton'

export { IconButton, iconButtonVariants }
