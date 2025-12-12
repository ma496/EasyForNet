import React, { ButtonHTMLAttributes } from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva('btn cursor-pointer inline-flex items-center justify-center', {
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
      default: '',
      sm: 'btn-sm',
      lg: 'btn-lg',
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

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, rounded, isLoading, disabled, children, icon, ...props }, ref) => {
  return (
    <button className={cn(buttonVariants({ variant, size, rounded }), className)} ref={ref} disabled={disabled || isLoading} {...props}>
      <div className="flex items-center justify-center gap-2">
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {icon && !isLoading && <span>{icon}</span>}
        {children}
      </div>
    </button>
  )
})

Button.displayName = 'Button'

export { Button, buttonVariants }
