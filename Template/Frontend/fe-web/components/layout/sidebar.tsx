'use client'
import React, { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import {
  AlertCircle,
  ChevronDown,
  Building2,
  GaugeCircleIcon,
  Minus,
  Settings,
  ShieldCheck,
  UserRound,
  BarChart4,
  CalendarClock,
  Users,
  X,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import NavLink from '@/components/layout/nav-link'

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathName = usePathname()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.style.marginLeft = isSidebarOpen ? '260px' : '60px' // Adjust this value as needed
    }
  }

  const toggleSidebarResponsive = () => {
    document.getElementById('sidebar')?.classList.remove('open')
    document.getElementById('overlay')?.classList.toggle('open')
  }

  const isOpen = () => {
    if (['/blog-list', '/blog-details', '/add-blog'].includes(pathName)) {
      return 'item-2'
    } else if (
      [
        '/',
        '/crypto-dashboard',
        '/product-card',
        '/add-product',
        '/product-details',
        '/product-checkout',
      ].includes(pathName)
    ) {
      return 'item-1'
    } else if (
      ['/invoice', '/invoice-details', '/create-invoice'].includes(
        pathName,
      )
    ) {
      return 'item-3'
    } else if (
      [
        '/accordion-page',
        '/alert',
        '/alert-dialog',
        '/avatar',
        '/breadcrumbs',
        '/buttons',
        '/card-page',
        '/carousel',
        '/dropdown',
        '/empty-stats',
        '/hover-card',
        '/modal',
        '/popover',
        '/scroll-area',
        '/sonner',
        '/tabs',
        '/tag',
        '/toasts',
        '/toggle-group',
        '/tooltip',
      ].includes(pathName)
    ) {
      return 'item-4'
    } else if (
      [
        '/checkbox',
        '/combobox',
        '/command',
        '/form',
        '/inputs',
        '/input-otp',
      ].includes(pathName)
    ) {
      return 'item-5'
    } else if (
      [
        '/crm',
        '/crm/customers',
        '/crm/leads',
        '/crm/opportunities',
        '/crm/reports',
        '/crm/reports/sales',
        '/crm/reports/customers',
        '/crm/reports/pipeline',
        '/crm/reports/performance',
        '/crm/reports/forecasting',
        '/crm/reports/conversion'
      ].includes(pathName)
    ) {
      return 'item-7'
    } else if (
      [
        '/users',
        '/roles',
        '/settings',
        '/errors',
      ].includes(pathName)
    ) {
      return 'item-8'
    } else {
      return ''
    }
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
          defaultValue={['item-7']}
          className="sidemenu grow overflow-y-auto overflow-x-hidden px-2.5 pb-10 pt-2.5 transition-all"
          key={pathName}
        >
          <h3 className="mt-2.5 whitespace-nowrap rounded-lg bg-gray-400 px-5 py-2.5 text-xs/tight font-semibold uppercase text-black">
            <span>General</span>
            <Minus className="hidden h-4 w-5 text-gray" />
          </h3>
          <NavLink
            href="/"
            className={`nav-link ${pathName === '/' && '!text-black'}`}
          >
            <GaugeCircleIcon className="size-[18px] shrink-0" />
            <span>Dashboard</span>
          </NavLink>

          <AccordionItem value="item-7" className="p-0 shadow-none">
            <AccordionTrigger className="nav-link">
              <Building2 className="size-[18px] shrink-0" />
              <span>CRM</span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="submenu space-y-2 pl-12 pr-5">
                <li>
                  <NavLink
                    href="/crm/customers"
                    isAccordion={true}
                  >
                    <UserRound className="mr-2 size-[14px] shrink-0" />
                    Customers
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    href="/crm/leads"
                    isAccordion={true}
                  >
                    <UserRound className="mr-2 size-[14px] shrink-0" />
                    Leads
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    href="/crm/opportunities"
                    isAccordion={true}
                  >
                    <CalendarClock className="mr-2 size-[14px] shrink-0" />
                    Opportunities
                  </NavLink>
                </li>
                <li>
                  <AccordionItem value="reports" className="p-0 shadow-none">
                    <AccordionTrigger className="relative items-center rounded-lg px-2 py-1 font-medium text-gray hover:bg-light-theme hover:text-primary [&[data-state=open]>.dot]:!bg-black">
                      <BarChart4 className="mr-2 size-[14px] shrink-0" />
                      Reports
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="submenu -mr-2 mt-2 space-y-2 pl-4">
                        <li>
                          <NavLink
                            href="/crm/reports/sales"
                            isSubAccordion={true}
                          >
                            Sales Analytics
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            href="/crm/reports/customer-insights"
                            isSubAccordion={true}
                          >
                            Customer Insights
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            href="/crm/reports/pipeline"
                            isSubAccordion={true}
                          >
                            Pipeline Analysis
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            href="/crm/reports/performance"
                            isSubAccordion={true}
                          >
                            Team Performance
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            href="/crm/reports/forecasting"
                            isSubAccordion={true}
                          >
                            Sales Forecasting
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            href="/crm/reports/conversion"
                            isSubAccordion={true}
                          >
                            Conversion Rates
                          </NavLink>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <h3 className="mt-2.5 whitespace-nowrap rounded-lg bg-gray-400 px-5 py-2.5 text-xs/tight font-semibold uppercase text-black">
            <span>Administration</span>
            <Minus className="hidden h-4 w-5 text-gray" />
          </h3>
          <NavLink
            href="/users"
            className={`nav-link ${pathName === '/users' && '!text-black'}`}
          >
            <Users className="size-[18px] shrink-0" />
            <span>Users</span>
          </NavLink>
          <NavLink
            href="/roles"
            className={`nav-link ${pathName === '/roles' && '!text-black'}`}
          >
            <ShieldCheck className="size-[18px] shrink-0" />
            <span>Roles</span>
          </NavLink>
          <NavLink
            href="/settings"
            className={`nav-link ${pathName === '/settings' && '!text-black'}`}
          >
            <Settings className="size-[18px] shrink-0" />
            <span>Settings</span>
          </NavLink>
          <NavLink
            href="/errors"
            className={`nav-link ${pathName === '/errors' && '!text-black'}`}
          >
            <AlertCircle className="size-[18px] shrink-0" />
            <span>Errors</span>
          </NavLink>
        </Accordion>
        {/* footer */}
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
