'use client'

import { useField, useFormikContext } from 'formik'
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
  const { submitCount } = useFormikContext()
  const isDirty = meta.initialValue !== meta.value
  const hasError = (isDirty || submitCount > 0) && meta.error
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={cn(className, (isDirty || submitCount > 0) && (hasError ? 'has-error' : ''))}>
      {label && (
        <label htmlFor={inputId} className="label form-label">
          {label}
          {required && <span className="ms-1 text-danger">*</span>}
        </label>
      )}
      <div className="relative text-white-dark">
        <textarea {...field} {...props} name={name} id={inputId} autoComplete={autoComplete} className="form-input" />
      </div>
      {showValidation && (isDirty || submitCount > 0) && hasError && <div className="mt-1 text-danger">{meta.error}</div>}
    </div>
  )
}
