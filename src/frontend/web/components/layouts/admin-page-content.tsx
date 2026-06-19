import { cn } from '@/lib/utils'

/** Props for the AdminPageContent layout wrapper, a centered "panel" container that optionally shows a title above its children. */
interface PageContentProps {
  title?: string | React.ReactNode
  children: React.ReactNode
  className?: string
  innerClassName?: React.HTMLAttributes<HTMLElement>['className']
}

/**
 * AdminPageContent is a layout wrapper that centers a styled "panel" with an optional title, used as the container for the body of admin pages (forms, settings, etc.).
 */
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
