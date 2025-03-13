'use client'
import React, { useEffect, useState } from 'react'
import { Accordion } from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Minus, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { navItemGroups } from '@/nav-items'
import SidebarNavItem from './sidebar-nav-item'

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathName = usePathname()

  const getDefaultOpenAccordions = (path: string) => {
    const pathParts = path.split('/').filter(Boolean)
    const defaultOpenAccordions = pathParts.reduce((acc: string[], _, index) => {
      const currentPath = '/' + pathParts.slice(0, index + 1).join('/')
      acc.push(currentPath)
      return acc
    }, [])
    return defaultOpenAccordions
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.style.marginLeft = isSidebarOpen ? '260px' : '60px'
    }
  }

  const toggleSidebarResponsive = () => {
    document.getElementById('sidebar')?.classList.remove('open')
    document.getElementById('overlay')?.classList.toggle('open')
  }

  useEffect(() => {
    if (document?.getElementById('overlay')?.classList?.contains('open')) {
      toggleSidebarResponsive()
    }
  }, [pathName])

  return (
    <>
      <div
        id="overlay"
        className="fixed inset-0 z-30 hidden bg-black/50"
        onClick={toggleSidebarResponsive}
      ></div>
      <Card
        id="sidebar"
        className={`sidebar fixed -left-[260px] top-0 z-40 flex h-screen w-[260px] flex-col rounded-none transition-all duration-300 lg:left-0 lg:top-16 lg:h-[calc(100vh_-_64px)] ${isSidebarOpen ? 'closed' : ''}`}
      >
        <button
          type="button"
          onClick={toggleSidebar}
          className="absolute -right-2.5 -top-3.5 hidden size-6 place-content-center rounded-full border border-gray-300 bg-white text-black lg:grid"
        >
          <ChevronDown
            className={`h-4 w-4 rotate-90 ${isSidebarOpen ? 'hidden' : ''}`}
          />
          <ChevronDown
            className={`hidden h-4 w-4 -rotate-90 ${isSidebarOpen ? '!block' : ''}`}
          />
        </button>
        <div className="flex items-start justify-between border-b border-gray-300 px-4 py-5 lg:hidden">
          <Link href="/" className="inline-block">
            <div className="flex items-center gap-2">
              <Image
                src="/images/icon.png"
                alt="Logo"
                width={34}
                height={34}
              />
              <span className="font-bold">Easy for Net</span>
            </div>
          </Link>
          <button type="button" onClick={toggleSidebarResponsive}>
            <X className="-mr-2 -mt-2 ml-auto size-4 hover:text-black" />
          </button>
        </div>

        <Accordion
          type="multiple"
          defaultValue={getDefaultOpenAccordions(pathName)}
          className="sidemenu grow overflow-y-auto overflow-x-hidden px-2.5 pb-10 pt-2.5 transition-all"
          key={pathName}
        >
          {navItemGroups.map((group, index) => (
            <React.Fragment key={index}>
              <h3 className="mt-2.5 whitespace-nowrap rounded-lg bg-gray-400 px-5 py-2.5 text-xs/tight font-semibold uppercase text-black">
                <span>{group.title}</span>
                <Minus className="hidden h-4 w-5 text-gray" />
              </h3>
              {group.items
                .filter(item => item.show !== false)
                .map((item, itemIndex) => (
                  <SidebarNavItem key={itemIndex} item={item} />
                ))}
            </React.Fragment>
          ))}
        </Accordion>

        <div className="sidebar-footer sticky bottom-0 rounded-[10px] p-4 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm">Easy for Net</span>
            <span className="text-sm">2025</span>
          </div>
        </div>
      </Card>
    </>
  )
}

export default Sidebar
