'use client'

import { useField } from 'formik'
import { cn } from '@/lib/utils'
import { useId } from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  name: string
  showValidation?: boolean
  className?: string
  icon?: React.ReactNode
  required?: boolean
}

export const FormInput = ({ label, name, id, showValidation = true, className, icon, autoComplete = 'off', required = false, ...props }: FormInputProps) => {
  const [field, meta] = useField(name)
  const hasError = meta.touched && meta.error
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={cn(className, meta.touched && (hasError ? 'has-error' : ''))}>
      {label && (
        <label htmlFor={inputId} className="label form-label">
          {label}
          {required && <span className="ms-1 text-danger">*</span>}
        </label>
      )}
      <div className="relative text-white-dark">
        <input {...field} {...props} id={inputId} name={name} autoComplete={autoComplete} className={cn('form-input', icon && 'ps-10')} />
        {icon && <span className="absolute start-4 top-1/2 -translate-y-1/2">{icon}</span>}
      </div>
      {showValidation && meta.touched && hasError && <div className="mt-1 text-danger">{meta.error}</div>}
    </div>
  )
}
