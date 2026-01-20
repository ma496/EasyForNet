'use client'

import { cn } from '@/lib/utils'
import { useId } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  name: string
  className?: string
  error?: string
  showError?: boolean
  required?: boolean
}

export const Textarea = ({ label, name, id, className, error, showError = true, autoComplete = 'off', required = false, ...props }: TextareaProps) => {
  const generatedId = useId()
  const textareaId = id ?? generatedId

  return (
    <div className={cn(className, error && showError && 'has-error')}>
      {label && (
        <label htmlFor={textareaId} className="label form-label">
          {label}
          {required && <span className="ms-1 text-danger">*</span>}
        </label>
      )}
      <div className="relative text-white-dark">
        <textarea {...props} name={name} id={textareaId} autoComplete={autoComplete} className="form-textarea" />
      </div>
      {showError && error && <div className="mt-1 text-danger">{error}</div>}
    </div>
  )
}
