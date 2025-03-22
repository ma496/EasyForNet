'use client'

import { NavItem, NavItemGroup, navItems } from "@/nav-items"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getTranslation } from "@/i18n"

const findActivePathItems = (items: (NavItem | NavItemGroup)[], pathname: string): NavItem[] => {
  const result: NavItem[] = []

  const findInItems = (items: NavItem[], currentPath: string) => {
    for (const item of items) {
      if (item.url === currentPath) {
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

export function Breadcrumbs() {
  const pathname = usePathname()
  const activePathItems = findActivePathItems(navItems, pathname)
  const { t } = getTranslation()

  return (
    <ul className="flex space-x-2 rtl:space-x-reverse">
      <li>
        <Link href="/" className="text-primary hover:underline">
          {t('navigation_home')}
        </Link>
      </li>
      {activePathItems.map((item, index) => (
        <li key={item.url} className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          {index === activePathItems.length - 1 ? (
            <span>{t(`navigation_${item.title.toLowerCase()}`)}</span>
          ) : (
            <Link href={item.url} className="text-primary hover:underline">
              {t(`navigation_${item.title.toLowerCase()}`)}
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}
