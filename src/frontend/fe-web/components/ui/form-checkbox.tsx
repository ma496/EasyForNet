'use client'

import { useField } from 'formik'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { useId } from 'react'

const formCheckboxVariants = cva('form-checkbox cursor-pointer rounded-sm', {
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

type InputAttributes = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>

interface FormCheckboxProps extends InputAttributes, VariantProps<typeof formCheckboxVariants> {
  label?: string
  name: string
  showValidation?: boolean
  className?: string
}

export const FormCheckbox = ({ label, name, id, showValidation = true, className, variant, size, ...props }: FormCheckboxProps) => {
  const [field, meta] = useField({ name, type: 'checkbox' })
  const hasError = meta.touched && meta.error
  const inputId = id ?? useId()

  return (
    <div className={cn('inline-flex flex-wrap items-start gap-2', className, meta.touched && (hasError ? 'has-error' : ''))}>
      <div className="flex min-h-[20px] items-center">
        <input {...field} {...props} type="checkbox" id={inputId} name={name} className={cn('mb-0', formCheckboxVariants({ variant, size }), hasError && 'border-danger focus:ring-danger')} />
        {label && (
          <label
            htmlFor={inputId}
            className={cn('ms-1 mb-0 flex cursor-pointer items-center leading-none select-none', size === 'sm' && 'text-xs', size === 'default' && 'text-sm', size === 'lg' && 'text-base')}
          >
            {label}
          </label>
        )}
      </div>
      {showValidation && meta.touched && hasError && <div className="text-sm text-danger">{meta.error}</div>}
    </div>
  )
}

export { formCheckboxVariants }
