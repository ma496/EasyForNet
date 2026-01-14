'use client'

import { useId, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'

interface FormPasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  name: string
  showValidation?: boolean
  className?: string
  icon?: React.ReactNode
  required?: boolean
}

export const FormPasswordInput = ({ label, name, id, showValidation = true, className, icon, autoComplete = 'off', required = false, ...props }: FormPasswordInputProps) => {
  const [field, meta] = useField(name)
  const { submitCount } = useFormikContext()
  const isDirty = meta.initialValue !== meta.value
  const [showPassword, setShowPassword] = useState(false)
  const hasError = (isDirty || submitCount > 0) && meta.error
  const inputId = id ?? useId()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={cn(className, (isDirty || submitCount > 0) && (hasError ? 'has-error' : ''))}>
      {label && (
        <label htmlFor={inputId}>
          {label}
          {required && <span className="ms-1 text-danger">*</span>}
        </label>
      )}
      <div className="relative text-white-dark">
        <input {...field} {...props} name={name} id={inputId} autoComplete={autoComplete} type={showPassword ? 'text' : 'password'} className={cn('form-input', icon && 'ps-10', 'pe-10')} />
        {icon && <span className="absolute start-4 top-1/2 -translate-y-1/2">{icon}</span>}
        <button type="button" onClick={togglePasswordVisibility} tabIndex={-1} className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-hidden">
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {showValidation && (isDirty || submitCount > 0) && hasError && <div className="mt-1 text-danger">{meta.error}</div>}
    </div>
  )
}
