'use client'

import { Tooltip } from './tooltip'
import { cn } from '@/lib/utils'

interface TruncatedProps {
  /** The text to display and truncate if needed */
  text: string
  /** The maximum number of characters to show before truncation (default: 40) */
  limit?: number
  /** Additional styling for the text container */
  className?: string
  /** Whether the tooltip should be animated */
  animate?: boolean
}

/**
 * A component that truncates text based on a character limit and shows
 * the full text in a premium tooltip when the limit is exceeded.
 */
export const Truncated = ({ text, limit = 40, className, animate = false }: TruncatedProps) => {
  if (text.length <= limit) {
    return <span className={cn('inline-block', className)}>{text}</span>
  }

  const truncated = text.substring(0, limit) + '...'

  return (
    <Tooltip content={text} animate={animate} className="max-w-xs wrap-break-word">
      <span className={cn('inline-block cursor-help border-b border-dashed border-gray-300 dark:border-gray-600 transition-colors duration-200 hover:border-primary hover:text-primary', className)}>
        {truncated}
      </span>
    </Tooltip>
  )
}

export default Truncated
