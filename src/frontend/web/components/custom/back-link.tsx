'use client'

import { useLocalizedRouter } from '@/hooks/use-localized-router'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

interface BackLinkProps {
  fallbackUrl: string
  label?: string
}

export const BackLink = ({ fallbackUrl, label }: BackLinkProps) => {
  const router = useLocalizedRouter()
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    // Check if there's a previous history entry from the same origin
    const hasPreviousPage = window.history.length > 1 && document.referrer.startsWith(window.location.origin)
    setCanGoBack(hasPreviousPage)
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (canGoBack) {
      router.back()
    } else {
      router.push(fallbackUrl)
    }
  }

  return (
    <a
      href={canGoBack ? '#' : fallbackUrl}
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </a>
  )
}