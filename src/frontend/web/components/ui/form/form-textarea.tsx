'use client'

import { useField } from 'formik'
import { cn } from '@/lib/utils'
import { useId } from 'react'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  name: string
  showValidation?: boolean
  className?: string
  required?: boolean
}

export const FormTextarea = ({ label, name, id, showValidation = true, className, autoComplete = 'off', required = false, ...props }: FormTextareaProps) => {
  const [field, meta] = useField(name)
  const hasError = meta.touched && meta.error
  const inputId = id ?? useId()

  return (
    <div className={cn(className, meta.touched && (hasError ? 'has-error' : ''))}>
      {label && (
        <label htmlFor={inputId}>
          {label}
          {required && <span className="ms-1 text-danger">*</span>}
        </label>
      )}
      <div className="relative text-white-dark">
        <textarea {...field} {...props} name={name} id={inputId} autoComplete={autoComplete} className="form-textarea" />
      </div>
      {showValidation && meta.touched && hasError && <div className="mt-1 text-danger">{meta.error}</div>}
    </div>
  )
}
