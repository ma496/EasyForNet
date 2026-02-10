'use client'

import { NavItem, NavItemGroup, navItems } from '@/nav-items'
import { LocalizedLink as Link } from '@/components/localized-link'
import { usePathname } from 'next/navigation'
import { getTranslation } from '@/i18n'

const findActivePathItems = (items: (NavItem | NavItemGroup)[], pathname: string): NavItem[] => {
  const result: NavItem[] = []

  const findInItems = (items: NavItem[], currentPath: string) => {
    for (const item of items) {
      if (item.url === currentPath || (item.url.includes('{id}') && currentPath.match(new RegExp(item.url.replace('{id}', '[^/]+'))))) {
        result.push(item)
        return true
      }
      if (item.children) {
        if (findInItems(item.children, currentPath)) {
          result.unshift(item)
          return true
        }
      }
    }
    return false
  }

  const flatItems = items.reduce<NavItem[]>((acc, item) => {
    if ('items' in item) {
      return [...acc, ...item.items]
    }
    return [...acc, item]
  }, [])

  findInItems(flatItems, pathname)
  return result
}

interface BreadcrumbsProps {
  className?: string
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname()
  // Remove locale prefix if present (e.g. /en/app -> /app)
  const normalizedPathname = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
  const activePathItems = findActivePathItems(navItems, normalizedPathname)
  const { t } = getTranslation()

  return (
    <ul className={`flex gap-2 ${className || ''}`}>
      <li>
        <Link href="/app" className="text-primary hover:underline">
          {t('navigation.home')}
        </Link>
      </li>
      {activePathItems.map((item, index) => (
        <li key={item.url} className="before:content-['/'] before:me-2">
          {index === activePathItems.length - 1 ? (
            <span>{t(item.title)}</span>
          ) : (
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            <Link href={item.url as any} className="text-primary hover:underline">
              {t(item.title)}
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}
