'use client'

import { useLocalizedRouter } from '@/hooks/use-localized-router'
import { ArrowLeft } from 'lucide-react'

interface BackLinkProps {
  label?: string
}

export const BackLink = ({ label }: BackLinkProps) => {
  const router = useLocalizedRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.back()
  }

  return (
    <a
      href="#"
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </a>
  )
}
