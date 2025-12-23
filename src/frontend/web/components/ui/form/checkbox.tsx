'use client'

import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { useId } from 'react'

const checkboxVariants = cva('form-checkbox cursor-pointer rounded-sm', {
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

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof checkboxVariants> {
  label?: string
  name: string
  className?: string
  error?: string
  showError?: boolean
  required?: boolean
}

export const Checkbox = ({ label, name, className, variant, size, error, showError = true, id, required = false, ...props }: CheckboxProps) => {
  const checkboxId = id ?? useId()

  return (
    <div className={cn('inline-flex flex-wrap items-start gap-2', className, error && showError && 'has-error')}>
      <div className="flex min-h-[20px] items-center">
        <input {...props} type="checkbox" id={checkboxId} name={name} className={cn('mb-0', checkboxVariants({ variant, size }), error && 'border-danger focus:ring-danger')} />
        {label && (
          <label
            htmlFor={checkboxId}
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
