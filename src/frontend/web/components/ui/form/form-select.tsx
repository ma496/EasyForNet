'use client'

import { useState, useMemo, useRef, useEffect, useId } from 'react'
import { useField, useFormikContext } from 'formik'
import { cn } from '@/lib/utils'
import { ChevronDown, Search, X } from 'lucide-react'
import ScrollBar from 'react-perfect-scrollbar'
import { Input } from './input'
import { useAppSelector } from '@/store/hooks'

interface Option {
  label: string
  value: string
  disabled?: boolean
}

interface FormSelectProps {
  label?: string
  name: string
  id?: string
  options: Option[]
  showValidation?: boolean
  className?: string
  icon?: React.ReactNode
  placeholder?: string
  searchable?: boolean
  maxVisibleItems?: number
  disabled?: boolean
  size?: 'default' | 'sm' | 'lg'
  clearable?: boolean
  required?: boolean
}

export const FormSelect = ({
  label,
  name,
  id,
  options,
  showValidation = true,
  className,
  icon,
  placeholder = 'Select...',
  searchable = true,
  maxVisibleItems = 5,
  disabled = false,
  size = 'default',
  clearable = true,
  required = false,
}: FormSelectProps) => {
  const [field, meta, helpers] = useField(name)
  const { submitCount } = useFormikContext()
  const isDirty = meta.initialValue !== meta.value
  const hasError = (isDirty || submitCount > 0) && meta.error
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const isRTL = useAppSelector((s) => s.theme.rtlClass) === 'rtl'
  const generatedId = useId()
  const controlId = id ?? generatedId

  // Filtered options
  const filteredOptions = useMemo(() => {
    if (!searchable || !search) return options
    return options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()))
  }, [search, options, searchable])

  // Handle outside click
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Value helpers
  const isSelected = (val: string) => field.value === val

  const handleSelect = (val: string) => {
    helpers.setValue(val, true).finally(() => helpers.setTouched(true))
    setOpen(false)
    setSearch('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    helpers.setValue('')
    setSearch('')
  }

  // Get selected option label
  const getSelectedLabel = () => {
    if (!field.value) return ''
    const selectedOption = options.find((opt) => opt.value === field.value)
    return selectedOption?.label || ''
  }

  return (
    <div className={cn(className, (isDirty || submitCount > 0) && hasError && 'has-error')} ref={containerRef}>
      {label && (
        <label htmlFor={controlId}>
          {label}
          {required && <span className="ms-1 text-danger">*</span>}
        </label>
      )}
      <div className={cn('relative text-white-dark', 'custom-select')}>
        <button
          type="button"
          className={cn(
            'form-input flex min-h-[40px] w-full cursor-pointer items-center gap-1 bg-transparent pr-10 text-left',
            icon && 'ps-10',
            size === 'sm' && 'py-1.5 text-xs',
            size === 'lg' && 'py-2.5 text-base',
          )
          }
          id={controlId}
          disabled={disabled}
          style={{ backgroundImage: 'none' }}
          onClick={() => setOpen((v) => !v)}
        >
          {icon && <span className="absolute start-4 top-1/2 -translate-y-1/2">{icon}</span>}
          <span className={cn('flex-1 truncate', !field.value && 'text-gray-400')}>{field.value ? getSelectedLabel() : placeholder}</span>
          {clearable && field.value && (
            <div role="button" className="absolute end-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-hidden" tabIndex={-1} onClick={handleClear}>
              <X size={16} />
            </div>
          )}
          <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2">
            <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
          </span>
        </button>
        {open && (
          <div
            className={cn('absolute left-0 z-50 mt-1 min-w-full rounded-sm border border-[rgb(224,230,237)] bg-white shadow-lg dark:border-[#253b5c] dark:bg-[#1b2e4b]', 'custom-select')}
            style={{ maxHeight: `${maxVisibleItems * 40 + 8 + (searchable ? 50 : 0)}px` }}
          >
            {searchable && (
              <div className="sticky top-0 z-10 flex h-[50px] items-center border-b border-gray-100 bg-white px-2 py-2 dark:border-[#253b5c] dark:bg-[#1b2e4b]" onClick={(e) => e.stopPropagation()}>
                <Input
                  name={name}
                  id={`${controlId}-search`}
                  type="text"
                  icon={<Search className="pointer-events-none h-4 w-4 text-gray-400" />}
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  showError={false}
                />
              </div>
            )}
            <ScrollBar
              options={{ suppressScrollX: true }}
              style={{
                maxHeight: `${maxVisibleItems * 40}px`,
                direction: isRTL ? 'rtl' : 'ltr',
              }}
              key={isRTL ? `${controlId}-rtl` : `${controlId}-ltr`}
            >
              <ul>
                {filteredOptions.length === 0 && <li className="px-4 py-2 text-gray-400">No options</li>}
                {filteredOptions.map((opt) => (
                  <li
                    key={opt.value}
                    className={cn(
                      'cursor-pointer px-4 py-2 hover:bg-[#f6f6f6] dark:hover:bg-[#132136]',
                      isSelected(opt.value) && 'bg-primary/10 text-primary',
                      opt.disabled && 'pointer-events-none opacity-50',
                    )}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <span>{opt.label}</span>
                  </li>
                ))}
              </ul>
            </ScrollBar>
          </div>
        )}
      </div>
      {showValidation && (isDirty || submitCount > 0) && hasError && <div className="mt-1 text-danger">{meta.error}</div>}
    </div>
  )
}
