"use client"

import React, { useState, useRef, useEffect } from 'react'
import { DayPicker, getDefaultClassNames, DateRange } from 'react-day-picker'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { format } from 'date-fns'

// Base props interface
interface BaseDatePickerProps {
  placeholder?: string
  disabled?: boolean
  className?: string
  showIcon?: boolean
  label?: string
}

// Single date picker props
export interface SingleDatePickerProps extends BaseDatePickerProps {
  mode?: 'single'
  selected?: Date
  onSelect?: (date: Date | undefined) => void
}

// Multiple date picker props
export interface MultipleDatePickerProps extends BaseDatePickerProps {
  mode: 'multiple'
  selected?: Date[]
  onSelect?: (dates: Date[] | undefined) => void
}

// Range date picker props
export interface RangeDatePickerProps extends BaseDatePickerProps {
  mode: 'range'
  selected?: DateRange
  onSelect?: (range: DateRange | undefined) => void
}

// Union type for all date picker props
export type DatePickerProps = SingleDatePickerProps | MultipleDatePickerProps | RangeDatePickerProps

// Helper component to handle the DayPicker with proper typing
const DayPickerWrapper = ({ mode, selected, onSelect, classNames, components, ...props }: any) => {
  if (mode === 'multiple') {
    return (
      <DayPicker
        mode="multiple"
        selected={selected as Date[]}
        onSelect={onSelect}
        classNames={classNames}
        components={components}
        showOutsideDays={true}
        {...props}
      />
    )
  }

  if (mode === 'range') {
    return (
      <DayPicker
        mode="range"
        selected={selected as DateRange}
        onSelect={onSelect}
        classNames={classNames}
        components={components}
        showOutsideDays={true}
        {...props}
      />
    )
  }

  return (
    <DayPicker
      mode="single"
      selected={selected as Date}
      onSelect={onSelect}
      classNames={classNames}
      components={components}
      showOutsideDays={true}
      {...props}
    />
  )
}

export const DatePicker = (props: DatePickerProps) => {
  const {
    selected,
    onSelect,
    placeholder = 'Select date...',
    disabled = false,
    className,
    showIcon = true,
    mode = 'single',
    label
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const defaultClassNames = getDefaultClassNames()

  const formatSelectedDate = () => {
    if (!selected) return placeholder

    if (mode === 'multiple' && Array.isArray(selected)) {
      if (selected.length === 0) return placeholder
      if (selected.length === 1) return format(selected[0], 'MMM dd, yyyy')
      return `${selected.length} dates selected`
    }

    if (mode === 'range' && selected && typeof selected === 'object' && 'from' in selected) {
      const range = selected as DateRange
      if (!range.from) return placeholder
      if (!range.to) return `${format(range.from, 'MMM dd, yyyy')} - ...`
      return `${format(range.from, 'MMM dd, yyyy')} - ${format(range.to, 'MMM dd, yyyy')}`
    }

    if (selected instanceof Date) {
      return format(selected, 'MMM dd, yyyy')
    }

    return placeholder
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const customClassNames = {
    root: `${defaultClassNames.root} rdp-custom bg-white dark:bg-black border border-white-light dark:border-[#17263c] rounded-md p-4 shadow-lg`,
    months: `${defaultClassNames.months} flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0`,
    month: `${defaultClassNames.month} space-y-4`,
    month_caption: `${defaultClassNames.month_caption} !flex !justify-center !py-2 !relative !items-center !px-14 !min-h-10 !border-b !border-white-light dark:!border-[#17263c]`,
    caption_label: `${defaultClassNames.caption_label} text-sm font-medium text-black dark:text-white-dark`,
    nav: `${defaultClassNames.nav} !absolute !inset-0 !flex !items-center !justify-between !pointer-events-none !z-15`,
    button_previous: `${defaultClassNames.button_previous} !absolute !left-2 !top-1/2 !-translate-y-1/2 !h-7 !w-7 !bg-transparent !p-0 !opacity-70 hover:!opacity-100 !text-black dark:!text-white-dark !pointer-events-auto !rounded !border-0 !flex !items-center !justify-center !cursor-pointer !transition-all !z-25`,
    button_next: `${defaultClassNames.button_next} !absolute !right-2 !top-1/2 !-translate-y-1/2 !h-7 !w-7 !bg-transparent !p-0 !opacity-70 hover:!opacity-100 !text-black dark:!text-white-dark !pointer-events-auto !rounded !border-0 !flex !items-center !justify-center !cursor-pointer !transition-all !z-25`,
    month_grid: `${defaultClassNames.month_grid} w-full border-collapse space-y-1`,
    weekdays: `${defaultClassNames.weekdays} flex`,
    weekday: `${defaultClassNames.weekday} text-black/50 dark:text-white/50 rounded-md w-9 font-normal text-[0.8rem]`,
    week: `${defaultClassNames.week} flex w-full mt-2`,
    day: `${defaultClassNames.day} h-9 w-9 text-center text-sm p-0 relative text-black dark:text-white-dark hover:bg-primary/10 rounded-md`,
    day_button: `${defaultClassNames.day_button} h-9 w-9 p-0 font-normal ${mode === 'multiple' ? 'hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary' : 'hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary'}`,
    selected: mode === 'multiple' ? 'rdp-multiple-selected' : `bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white`,
    today: `bg-accent text-accent-foreground border border-primary/20`,
    outside: `text-muted-foreground opacity-50`,
    disabled: `text-muted-foreground opacity-50 cursor-not-allowed`,
    range_middle: `aria-selected:bg-accent aria-selected:text-accent-foreground`,
    multiple: `rdp-multiple`,
    hidden: `invisible`
  }

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label className="label form-label mb-2 block">{label}</label>
      )}
      <div ref={containerRef}>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal form-input !border !p-2 !shadow-none",
            !selected && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <div className="flex items-center w-full">
            {showIcon && (
              <Calendar className="mr-2 h-4 w-4" />
            )}
            <span className="flex-1">{formatSelectedDate()}</span>
          </div>
        </Button>

        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-1 min-w-max">
            <DayPickerWrapper
              mode={mode}
              selected={selected}
              onSelect={(date: any) => {
                if (onSelect) {
                  (onSelect as any)(date)
                }
                if (mode === 'single') {
                  setIsOpen(false)
                }
              }}
              classNames={{
                ...customClassNames,
                root: `${customClassNames.root} rdp-mode-${mode}`
              }}
              components={{
                Chevron: ({ orientation }: any) => (
                  orientation === 'left' ?
                    <ChevronLeft className="h-4 w-4" /> :
                    <ChevronRight className="h-4 w-4" />
                )
              }}
              fixedWeeks
              fromYear={1900}
              toYear={2100}
            />
          </div>
        )}
      </div>
    </div>
  )
}
