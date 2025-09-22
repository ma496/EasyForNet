"use client"

import { useField } from "formik"
import { cn } from "@/lib/utils"
import { DatePicker, SingleDatePickerProps, MultipleDatePickerProps, RangeDatePickerProps } from "./date-picker"

// Single date picker form props
interface FormSingleDatePickerProps extends Omit<SingleDatePickerProps, 'selected' | 'onSelect'> {
  name: string
  showValidation?: boolean
}

// Multiple date picker form props
interface FormMultipleDatePickerProps extends Omit<MultipleDatePickerProps, 'selected' | 'onSelect'> {
  name: string
  showValidation?: boolean
}

// Range date picker form props
interface FormRangeDatePickerProps extends Omit<RangeDatePickerProps, 'selected' | 'onSelect'> {
  name: string
  showValidation?: boolean
}

// Union type for all form date picker props
export type FormDatePickerProps = FormSingleDatePickerProps | FormMultipleDatePickerProps | FormRangeDatePickerProps

export const FormDatePicker = (props: FormDatePickerProps) => {
  const {
    name,
    label,
    showValidation = true,
    className,
    mode = 'single',
    ...restProps
  } = props

  const [field, meta, helpers] = useField(name)
  const hasError = meta.touched && meta.error

  const handleSelect = (value: any) => {
    helpers.setValue(value, true)
  }

  return (
    <div className={cn(
      className,
      meta.touched && (hasError ? 'has-error' : '')
    )}>
      <DatePicker
        {...restProps}
        mode={mode}
        label={label}
        selected={field.value}
        onSelect={handleSelect}
      />
      {showValidation && meta.touched && (
        hasError && (
          <div className="text-danger mt-1">
            {typeof meta.error === 'string' ? meta.error : JSON.stringify(meta.error)}
          </div>
        )
      )}
    </div>
  )
}
