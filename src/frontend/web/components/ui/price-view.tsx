import { cn } from '@/lib/utils'

export interface PriceViewProps {
  amount?: number | string
  currency?: string
  locale?: string
  className?: string
  placeholder?: string
  decimals?: number
}

export const PriceView = ({
  amount,
  currency = 'USD',
  locale = 'en-US',
  className,
  placeholder = '-',
  decimals = 2,
}: PriceViewProps) => {
  if (amount === undefined || amount === '') {
    return <span className={cn('text-gray-400', className)}>{placeholder}</span>
  }

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numericAmount)) {
    return <span className={cn('text-red-400', className)}>Invalid Price</span>
  }

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numericAmount)

  return <span className={cn(className)}>{formattedPrice}</span>
}
