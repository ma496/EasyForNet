'use client'

import { useField } from 'formik'
import { cn } from '@/lib/utils'
import { useId } from 'react'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  name: string
  showValidation?: boolean
  className?: string
}

export const FormTextarea = ({ label, name, id, showValidation = true, className, autoComplete = 'off', ...props }: FormTextareaProps) => {
  const [field, meta] = useField(name)
  const hasError = meta.touched && meta.error
  const inputId = id ?? useId()

  return (
    <div className={cn(className, meta.touched && (hasError ? 'has-error' : ''))}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <div className="relative text-white-dark">
        <textarea {...field} {...props} name={name} id={inputId} autoComplete={autoComplete} className="form-textarea" />
      </div>
      {showValidation && meta.touched && hasError && <div className="mt-1 text-danger">{meta.error}</div>}
    </div>
  )
}
