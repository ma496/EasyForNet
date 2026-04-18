import { cn } from '@/lib/utils'

interface PageContentProps {
  title?: string | React.ReactNode
  children: React.ReactNode
  className?: string
  innerClassName?: string
}

export function AdminPageContent({ title, children, className, innerClassName }: PageContentProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('panel w-full', innerClassName)}>
        {title && <div className="mb-4 text-xl font-semibold text-dark dark:text-white-light">{title}</div>}
        {children}
      </div>
    </div>
  )
}
