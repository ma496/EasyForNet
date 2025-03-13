import { NavItem } from '@/nav-items'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import NavLink from './nav-link'

interface SidebarNavItemProps {
  item: NavItem
  level?: number
}

const SidebarNavItem = ({ item, level = 0 }: SidebarNavItemProps) => {
  const Icon = item.icon

  if (item.children) {
    // Use the base route as the accordion value
    const accordionValue = item.url.split('/').slice(0, level + 2).join('/')

    return (
      <AccordionItem value={accordionValue} className="p-0 shadow-none">
        <AccordionTrigger className={level === 0 ? "nav-link" : "relative items-center rounded-lg px-2 py-1 font-medium text-gray hover:bg-light-theme hover:text-primary [&[data-state=open]>.dot]:!bg-black"}>
          {Icon && <Icon className={level === 0 ? "size-[18px] shrink-0" : "mr-2 size-[14px] shrink-0"} />}
          <span>{item.title}</span>
        </AccordionTrigger>
        <AccordionContent>
          <ul className={level === 0 ? "submenu space-y-2 pl-12 pr-5" : "submenu -mr-2 mt-2 space-y-2 pl-4"}>
            {item.children.map((child, index) => (
              <li key={index}>
                <SidebarNavItem item={child} level={level + 1} />
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <NavLink
      href={item.url}
      isAccordion={level > 0}
      isSubAccordion={level > 1}
      className={level === 0 ? "nav-link" : ""}
    >
      {Icon && <Icon className={level === 0 ? "size-[18px] shrink-0" : "mr-2 size-[14px] shrink-0"} />}
      {level === 0 ? <span>{item.title}</span> : item.title}
    </NavLink>
  )
}

export default SidebarNavItem
