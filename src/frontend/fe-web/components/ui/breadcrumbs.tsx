'use client'

import { NavItem, NavItemGroup, navItems } from '@/nav-items'
import Link from 'next/link'
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
  const activePathItems = findActivePathItems(navItems, pathname)
  const { t } = getTranslation()

  return (
    <ul className={`flex space-x-2 rtl:space-x-reverse ${className || ''}`}>
      <li>
        <Link href="/app" className="text-primary hover:underline">
          {t('nav_home')}
        </Link>
      </li>
      {activePathItems.map((item, index) => (
        <li key={item.url} className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          {index === activePathItems.length - 1 ? (
            <span>{t(item.title)}</span>
          ) : (
            <Link href={item.url as any} className="text-primary hover:underline">
              {t(item.title)}
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}
