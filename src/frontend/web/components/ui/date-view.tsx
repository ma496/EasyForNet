import { format as formatDate, isValid } from 'date-fns'
import { cn } from '@/lib/utils'

export interface DateViewProps {
  date?: Date | string | number | null
  format?: string
  className?: string
  placeholder?: string
}

export const DateView = ({
  date,
  format = 'dd MMM yyyy',
  className,
  placeholder = '-'
}: DateViewProps) => {
  if (!date) {
    return <span className={cn('text-gray-400', className)}>{placeholder}</span>
  }

  const dateObj = new Date(date)

  if (!isValid(dateObj)) {
    return <span className={cn('text-red-400', className)}>Invalid Date</span>
  }

  return (
    <span className={cn(className)}>
      {formatDate(dateObj, format)}
    </span>
  )
}
