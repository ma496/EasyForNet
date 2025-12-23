'use client'

import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { useId } from 'react'

const radioVariants = cva('form-radio cursor-pointer', {
  variants: {
    variant: {
      default: 'text-primary border-gray-300 focus:ring-primary',
      success: 'text-success border-success focus:ring-success',
      danger: 'text-danger border-danger focus:ring-danger',
      warning: 'text-warning border-warning focus:ring-warning',
      info: 'text-info border-info focus:ring-info',
      secondary: 'text-secondary border-secondary focus:ring-secondary',
      dark: 'text-dark border-dark focus:ring-dark',
    },
    size: {
      default: 'h-4 w-4',
      sm: 'h-3 w-3',
      lg: 'h-5 w-5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>, VariantProps<typeof radioVariants> {
  label?: string
  name: string
  className?: string
  error?: string
  showError?: boolean
  required?: boolean
}

export const Radio = ({ label, name, id, className, variant, size, error, showError = true, required = false, ...props }: RadioProps) => {
  const radioId = id ?? useId()

  return (
    <div className={cn('inline-flex flex-wrap items-start gap-2', className, error && showError && 'has-error')}>
      <div className="flex min-h-[20px] items-center">
        <input {...props} type="radio" name={name} id={radioId} className={cn('mb-0', radioVariants({ variant, size }), error && 'border-danger focus:ring-danger')} />
        {label && (
          <label
            htmlFor={radioId}
            className={cn('ms-1 mb-0 flex cursor-pointer items-center leading-none select-none', size === 'sm' && 'text-xs', size === 'default' && 'text-sm', size === 'lg' && 'text-base')}
          >
            {label}
            {required && <span className="ms-1 text-danger">*</span>}
          </label>
        )}
      </div>
      {showError && error && <div className="text-sm text-danger">{error}</div>}
    </div>
  )
}
