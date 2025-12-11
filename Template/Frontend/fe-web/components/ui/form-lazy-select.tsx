'use client'

import { useState, useMemo, useRef, useEffect, useCallback, useId } from 'react'
import { useField } from 'formik'
import { cn } from '@/lib/utils'
import { ChevronDown, Search, X } from 'lucide-react'
import { TypedUseLazyQuery } from '@reduxjs/toolkit/query/react'
import { ListDto } from '@/store/api/base/dto/list-dto'
import { Loading } from '@/components/ui/loading'
import { useDebounce } from '@/hooks/use-debounce'
import { Input } from './input'
import ScrollBar from 'react-perfect-scrollbar'
import { useAppSelector } from '@/store/hooks'

interface Option {
  label: string
  value: string
  disabled?: boolean
}

interface FormLazySelectProps<TItem, TRequest> {
  label?: string
  name: string
  id?: string
  useLazyQuery: TypedUseLazyQuery<ListDto<TItem>, TRequest, any>
  getLabel: (item: TItem) => string
  getValue: (item: TItem) => string
  isDisabled?: (item: TItem) => boolean
  selectedItem?: TItem
  showValidation?: boolean
  className?: string
  icon?: React.ReactNode
  placeholder?: string
  searchable?: boolean
  maxVisibleItems?: number
  disabled?: boolean
  size?: 'default' | 'sm' | 'lg'
  pageSize: number
  generateRequest?: (search: string, page: number, pageSize: number) => TRequest
}

export const FormLazySelect = <TItem, TRequest>({
  label,
  name,
  id,
  useLazyQuery,
  getLabel,
  getValue,
  isDisabled = () => false,
  selectedItem,
  showValidation = true,
  className,
  icon,
  placeholder = 'Select...',
  searchable = true,
  maxVisibleItems = 5,
  disabled = false,
  size = 'default',
  pageSize,
  generateRequest,
}: FormLazySelectProps<TItem, TRequest>) => {
  const [field, meta, helpers] = useField(name)
  const hasError = meta.touched && meta.error
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [fetchedOptions, setFetchedOptions] = useState<Option[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isRTL = useAppSelector((s) => s.theme.rtlClass) === 'rtl'
  const generatedId = useId()
  const controlId = id ?? generatedId
  const [trigger, { data, isFetching, error }] = useLazyQuery()

  const [storedOptions, setStoredOptions] = useState<Option[]>([])

  const getLabelRef = useRef(getLabel)
  const getValueRef = useRef(getValue)
  const isDisabledRef = useRef(isDisabled)
  const generateRequestRef = useRef(generateRequest)

  useEffect(() => {
    getLabelRef.current = getLabel
    getValueRef.current = getValue
    isDisabledRef.current = isDisabled
    generateRequestRef.current = generateRequest
  }, [getLabel, getValue, isDisabled, generateRequest])

  const prevSelectedItemRef = useRef<TItem | undefined>(undefined)
  const memoizedSelectedItem = useMemo(() => {
    const currentSelectedItem = selectedItem
    const prevSelectedItem = prevSelectedItemRef.current

    if (currentSelectedItem !== prevSelectedItem) { // Basic reference check, could enhanced if needed
      // Simpler check for single item compared to array
      if (
        currentSelectedItem &&
        prevSelectedItem &&
        getValueRef.current(currentSelectedItem) === getValueRef.current(prevSelectedItem) &&
        JSON.stringify(currentSelectedItem) === JSON.stringify(prevSelectedItem)
      ) {
        return prevSelectedItemRef.current
      }
      prevSelectedItemRef.current = currentSelectedItem
    }
    return prevSelectedItemRef.current
  }, [selectedItem])


  useEffect(() => {
    if (memoizedSelectedItem) {
      setStoredOptions([
        {
          label: getLabelRef.current(memoizedSelectedItem),
          value: getValueRef.current(memoizedSelectedItem),
          disabled: isDisabledRef.current(memoizedSelectedItem),
        }
      ])
    } else {
      // If undefined/null, we technically don't need to force clear storedOptions
      // because we accumulate valid options there, but for single select
      // usually we just care about the selected one being available.
      // Let's keep existing behavior of just ensuring current selection is in storedOptions.
    }
  }, [memoizedSelectedItem])

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    setFetchedOptions([])
  }, [debouncedSearch])

  useEffect(() => {
    if (hasMore) {
      let request: TRequest

      if (generateRequestRef.current) {
        request = generateRequestRef.current(debouncedSearch, page, pageSize)
      } else {
        const internalRequest: any = {
          page,
          pageSize,
        }
        const trimmedSearch = debouncedSearch.trim()
        if (trimmedSearch) {
          internalRequest.search = trimmedSearch
        }
        request = internalRequest as TRequest
      }
      trigger(request)
    }
  }, [debouncedSearch, page, hasMore, pageSize, trigger])

  useEffect(() => {
    if (data?.items) {
      const newOptions = data.items.map((item) => ({
        label: getLabelRef.current(item),
        value: getValueRef.current(item),
        disabled: isDisabledRef.current(item),
      }))

      if (page === 1) {
        setFetchedOptions(newOptions)
      } else {
        setFetchedOptions((prev) => {
          const existingValues = new Set(prev.map((o) => o.value))
          const filteredNewOptions = newOptions.filter((o) => !existingValues.has(o.value))
          return [...prev, ...filteredNewOptions]
        })
      }

      if (data.items.length < pageSize) {
        setHasMore(false)
      }
    }
  }, [data, page, pageSize])

  useEffect(() => {
    if (!isFetching) {
      setIsLoadingMore(false)
    }
  }, [isFetching])

  const allOptions = useMemo(() => {
    const optionsMap = new Map<string, Option>()
    storedOptions.forEach((opt) => optionsMap.set(opt.value, opt))
    fetchedOptions.forEach((opt) => optionsMap.set(opt.value, opt))
    return Array.from(optionsMap.values())
  }, [storedOptions, fetchedOptions])

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

  const handleScroll = useCallback(
    (element: HTMLElement) => {
      if (element) {
        const { scrollTop, scrollHeight, clientHeight } = element
        if (scrollHeight - scrollTop <= clientHeight + 20 && hasMore && !isFetching && !isLoadingMore) {
          setIsLoadingMore(true)
          setPage((prevPage) => prevPage + 1)
        }
      }
    },
    [hasMore, isFetching, isLoadingMore],
  )

  const isSelected = (val: string) => field.value === val

  const handleSelect = useCallback(
    (opt: Option) => {
      if (field.value === opt.value) {
        setOpen(false)
        return;
      }

      if (!storedOptions.some((o) => o.value === opt.value)) {
        setStoredOptions((prev) => [...prev, opt])
      }
      helpers.setValue(opt.value).finally(() => helpers.setTouched(true))
      setOpen(false)
    },
    [field.value, helpers, storedOptions],
  )

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      helpers.setValue(null) // or '' depending on requirement, usually null/undefined for "no selection"
      setSearch('')
    },
    [helpers],
  )

  const renderValue = () => {
    const selectedOption = allOptions.find((opt) => opt.value === field.value)
    if (selectedOption) {
      return selectedOption.label
    }
    return placeholder || ''
  }

  return (
    <div className={cn(className, meta.touched && hasError && 'has-error')} ref={containerRef}>
      {label && <label htmlFor={controlId}>{label}</label>}
      <div className={cn('relative text-white-dark', 'custom-select')}>
        <button
          type="button"
          className={cn(
            'form-input flex min-h-[40px] w-full cursor-pointer flex-wrap items-center gap-1 bg-transparent py-[2px] pr-10 text-left',
            icon && 'ps-10',
            disabled && 'pointer-events-none opacity-60',
            size === 'sm' && 'py-[4px] text-xs',
            size === 'lg' && 'py-[7px] text-base',
            !field.value && 'text-gray-400'
          )}
          id={controlId}
          style={{ backgroundImage: 'none' }}
          onClick={() => setOpen((v) => !v)}
        >
          {icon && <span className="absolute start-4 top-1/2 -translate-y-1/2">{icon}</span>}
          <span className="flex flex-1 items-center truncate">
            {renderValue()}
          </span>
          {field.value && (
            <div role="button" className="absolute end-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-hidden" tabIndex={-1} onClick={handleClear}>
              <X size={16} />
            </div>
          )}
          <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2">
            <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
          </span>
        </button>
        <div
          className={cn(
            'absolute left-0 z-50 mt-1 min-w-full overflow-hidden rounded-sm border border-[rgb(224,230,237)] bg-white shadow-lg dark:border-[#253b5c] dark:bg-[#1b2e4b]',
            'custom-select',
            !open && 'hidden',
          )}
          style={{ maxHeight: `${maxVisibleItems * 40 + 8 + (searchable ? 50 : 0)}px` }}
        >
          {searchable && (
            <div className="sticky top-0 z-10 flex items-center border-b border-gray-100 bg-white px-2 py-2 dark:border-[#253b5c] dark:bg-[#1b2e4b]" onClick={(e) => e.stopPropagation()}>
              <Input
                name={`${name}-search`}
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
            options={{
              suppressScrollX: true,
            }}
            style={{
              maxHeight: `${maxVisibleItems * 40}px`,
              direction: isRTL ? 'rtl' : 'ltr',
            }}
            onScrollY={handleScroll}
            key={isRTL ? `${controlId}-rtl` : `${controlId}-ltr`}
          >
            <ul className="overflow-hidden">
              {isFetching && page === 1 && (
                <li className="flex items-center justify-center px-4 py-2 text-gray-400">
                  <Loading />
                </li>
              )}
              {!isFetching && fetchedOptions.length === 0 && <li className="px-4 py-2 text-gray-400">No options</li>}
              {fetchedOptions.map((opt) => (
                <li
                  key={opt.value}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-[#f6f6f6] dark:hover:bg-[#132136]',
                    isSelected(opt.value) && 'bg-primary/10 text-primary',
                    opt.disabled && 'pointer-events-none opacity-50',
                  )}
                  onClick={() => handleSelect(opt)}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected(opt.value) && <span className="ml-auto">Selected</span>} {/* Optional indicator */}
                </li>
              ))}
              {isFetching && page > 1 && (
                <li className="flex items-center justify-center px-4 py-2 text-gray-400">
                  <Loading />
                </li>
              )}
            </ul>
          </ScrollBar>
        </div>
      </div>
      {showValidation && meta.touched && hasError && <div className="mt-1 text-danger">{meta.error}</div>}
    </div>
  )
}
