'use client'

import { useField } from 'formik'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { useId } from 'react'

const formRadioVariants = cva('form-radio cursor-pointer', {
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

interface FormRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>, VariantProps<typeof formRadioVariants> {
  label?: string
  name: string
  showValidation?: boolean
  className?: string
  required?: boolean
}

export const FormRadio = ({ label, name, id, showValidation = true, className, variant, size, required = false, ...props }: FormRadioProps) => {
  const [field, meta] = useField({ name, type: 'radio', value: props.value })
  const hasError = meta.touched && meta.error
  const inputId = id ?? useId()

  return (
    <div className={cn('inline-flex flex-wrap items-start gap-2', className, meta.touched && (hasError ? 'has-error' : ''))}>
      <div className="flex min-h-[20px] items-center">
        <input {...field} {...props} type="radio" name={name} id={inputId} className={cn('mb-0', formRadioVariants({ variant, size }), hasError && 'border-danger focus:ring-danger')} />
        {label && (
          <label
            htmlFor={inputId}
            className={cn('ms-1 mb-0 flex cursor-pointer items-center leading-none select-none', size === 'sm' && 'text-xs', size === 'default' && 'text-sm', size === 'lg' && 'text-base')}
          >
            {label}
            {required && <span className="ms-1 text-danger">*</span>}
          </label>
        )}
      </div>
      {showValidation && meta.touched && hasError && <div className="text-sm text-danger">{meta.error}</div>}
    </div>
  )
}
