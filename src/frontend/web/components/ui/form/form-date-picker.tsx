'use client'

import { useField, useFormikContext } from 'formik'
import { cn } from '@/lib/utils'
import { DatePicker, SingleDatePickerProps, MultipleDatePickerProps, RangeDatePickerProps } from './date-picker'

// Single date picker form props
interface FormSingleDatePickerProps extends Omit<SingleDatePickerProps, 'selected' | 'onSelect'> {
  name: string
  id?: string
  showValidation?: boolean
  required?: boolean
}

// Multiple date picker form props
interface FormMultipleDatePickerProps extends Omit<MultipleDatePickerProps, 'selected' | 'onSelect'> {
  name: string
  id?: string
  showValidation?: boolean
  required?: boolean
}

// Range date picker form props
interface FormRangeDatePickerProps extends Omit<RangeDatePickerProps, 'selected' | 'onSelect'> {
  name: string
  id?: string
  showValidation?: boolean
  required?: boolean
}

// Union type for all form date picker props
export type FormDatePickerProps = FormSingleDatePickerProps | FormMultipleDatePickerProps | FormRangeDatePickerProps

export const FormDatePicker = (props: FormDatePickerProps) => {
  const { name, id, label, showValidation = true, className, mode = 'single', required = false, ...restProps } = props

  const [field, meta, helpers] = useField(name)
  const { submitCount } = useFormikContext()
  const isDirty = meta.initialValue !== meta.value
  const hasError = (isDirty || submitCount > 0) && meta.error

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = (value: any) => {
    helpers.setValue(value, true)
  }

  return (
    <div className={cn(className, (isDirty || submitCount > 0) && (hasError ? 'has-error' : ''))}>
      <DatePicker {...restProps} mode={mode} label={label} name={name} id={id} selected={field.value} onSelect={handleSelect} required={required} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {showValidation && (isDirty || submitCount > 0) && hasError && <div className="mt-1 text-danger">{typeof meta.error === 'string' ? meta.error : JSON.stringify(meta.error as any)}</div>}
    </div>
  )
}
