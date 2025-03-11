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
    ChevronDown,
    ClipboardType,
    Component,
    FileType,
    Fingerprint,
    Gauge,
    Gem,
    MessageSquareText,
    Minus,
    PanelLeftDashed,
    Phone,
    PieChart,
    RectangleEllipsis,
    Rocket,
    ScrollText,
    Settings,
    Sheet,
    SquareKanban,
    TableProperties,
    X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
                        <Image
                            src="/images/logo.svg"
                            width={145}
                            height={34}
                            alt="Logo"
                            className="h-auto w-auto"
                        />
                    </Link>
                    <button type="button" onClick={toggleSidebarResponsive}>
                        <X className="-mr-2 -mt-2 ml-auto size-4 hover:text-black" />
                    </button>
                </div>
                <Accordion
                    type="single"
                    defaultValue={isOpen()}
                    collapsible
                    className="sidemenu grow overflow-y-auto overflow-x-hidden px-2.5 pb-10 pt-2.5 transition-all"
                    key={pathName}
                >
                    <AccordionItem value="item-1" className="p-0 shadow-none">
                        <AccordionTrigger className="nav-link">
                            <Gauge className="size-[18px] shrink-0" />
                            <span>Dashboard</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="submenu space-y-2 pl-12 pr-0">
                                <li>
                                    <NavLink
                                        href="/"
                                        className="mr-5"
                                        isAccordion={true}
                                    >
                                        Sales
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/crypto"
                                        target="_blank"
                                        className="mr-5"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Crypto
                                    </NavLink>
                                </li>
                                <li>
                                    <Accordion
                                        type="single"
                                        collapsible
                                        defaultValue={
                                            [
                                                '/product-card',
                                                '/add-product',
                                                '/product-details',
                                                '/product-checkout',
                                            ].includes(pathName)
                                                ? 'subitem-1'
                                                : ''
                                        }
                                    >
                                        <AccordionItem
                                            value="subitem-1"
                                            className="p-0 shadow-none"
                                        >
                                            <AccordionTrigger className="relative items-center rounded-lg px-2 py-1 font-medium text-gray hover:bg-light-theme hover:text-primary [&[data-state=open]>.dot]:!bg-black">
                                                <div className="dot absolute -left-5 top-3 size-[5px] rounded-full bg-gray-700/50"></div>
                                                <span>eCommerce</span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <ul className="submenu -mr-2 mt-2 space-y-2 pl-4">
                                                    <li>
                                                        <NavLink
                                                            href="/product-card"
                                                            target="_blank"
                                                            isSubAccordion={
                                                                true
                                                            }
                                                            isProfessionalPlanRoute={
                                                                true
                                                            }
                                                        >
                                                            Product list
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            href="/add-product"
                                                            target="_blank"
                                                            isSubAccordion={
                                                                true
                                                            }
                                                            isProfessionalPlanRoute={
                                                                true
                                                            }
                                                        >
                                                            Add new product
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            href="/product-details"
                                                            target="_blank"
                                                            isSubAccordion={
                                                                true
                                                            }
                                                            isProfessionalPlanRoute={
                                                                true
                                                            }
                                                        >
                                                            Product Details
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            href="/product-checkout"
                                                            target="_blank"
                                                            isSubAccordion={
                                                                true
                                                            }
                                                            isProfessionalPlanRoute={
                                                                true
                                                            }
                                                        >
                                                            Product Checkout
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <h3 className="mt-2.5 whitespace-nowrap rounded-lg bg-gray-400 px-5 py-2.5 text-xs/tight font-semibold uppercase text-black">
                        <span>Apps</span>
                        <Minus className="hidden h-4 w-5 text-gray" />
                    </h3>

                    <NavLink
                        href="/chat"
                        target="_blank"
                        className={`nav-link ${pathName === '/chat' && '!text-black'}`}
                        isProfessionalPlanRoute={true}
                    >
                        <MessageSquareText className="size-[18px] shrink-0" />
                        <span>Chat</span>
                    </NavLink>

                    <NavLink
                        href="/scrumboard"
                        target="_blank"
                        isProfessionalPlanRoute={true}
                        className={`nav-link ${pathName === '/scrumboard' && '!text-black'}`}
                    >
                        <SquareKanban className="size-[18px] shrink-0" />
                        <span>Scrumboard</span>
                    </NavLink>

                    <AccordionItem value="item-2" className="p-0 shadow-none">
                        <AccordionTrigger
                            defaultValue={
                                [
                                    '/blog-list',
                                    '/blog-details',
                                    '/add-blog',
                                ].includes(pathName)
                                    ? 'item-2'
                                    : ''
                            }
                            className="nav-link"
                        >
                            <SquareKanban className="size-[18px] shrink-0 -rotate-90" />
                            <span>Blog</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="submenu space-y-2 pl-12 pr-5">
                                <li>
                                    <NavLink
                                        href="/blog-list"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Blog-list
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/blog-details"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Blog details
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/add-blog"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Add New Blog
                                    </NavLink>
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="p-0 shadow-none">
                        <AccordionTrigger className="nav-link">
                            <ScrollText className="size-[18px] shrink-0" />
                            <span>Invoice</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="submenu space-y-2 pl-12 pr-5">
                                <li>
                                    <NavLink
                                        href="/invoice"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Invoice
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/invoice-details"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Invoice details
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/create-invoice"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Create Invoice
                                    </NavLink>
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <h3 className="mt-2.5 whitespace-nowrap rounded-lg bg-gray-400 px-5 py-2.5 text-xs/tight font-semibold uppercase text-black">
                        <span>User Interface</span>
                        <Minus className="hidden h-4 w-5 text-gray" />
                    </h3>

                    <AccordionItem value="item-4" className="p-0 shadow-none">
                        <AccordionTrigger className="nav-link">
                            <Component className="size-[18px] shrink-0" />
                            <span>Components</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="submenu space-y-2 pl-12 pr-5">
                                <li>
                                    <NavLink
                                        href="/accordion-page"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Accordion
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/alert"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Alert
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/alert-dialog"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Alert Dialog
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/avatar"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Avatar
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/breadcrumbs"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Breadcrumb
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/buttons"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Button
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/card-page"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Cards
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/carousel"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Carousel
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/dropdown"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Dropdown Menu
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/empty-stats"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Empty Stats
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/hover-card"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Hover Card
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/modal"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Modals
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/popover"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Popover
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/scroll-area"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Scroll Area
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        href="/sonner"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Sonner
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/tabs"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Tab
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        href="/tag"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Tag
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        href="/toasts"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Toasts
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/toggle-group"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Toggle Group
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/tooltip"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Tooltip
                                    </NavLink>
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <NavLink href="/chart" className={`nav-link`}>
                        <PieChart className="size-[18px] shrink-0" />
                        <span>Charts</span>
                    </NavLink>

                    <NavLink
                        href="/typography"
                        target="_blank"
                        className={`nav-link`}
                        isProfessionalPlanRoute={true}
                    >
                        <FileType className="size-[18px] shrink-0" />
                        <span>Typography</span>
                    </NavLink>
                    <NavLink
                        href="/sidebar-page"
                        target="_blank"
                        className={`nav-link`}
                        isProfessionalPlanRoute={true}
                    >
                        <PanelLeftDashed className="size-[18px] shrink-0" />
                        <span>Sidebar</span>
                    </NavLink>
                    <NavLink
                        href="/sheet-page"
                        target="_blank"
                        className={`nav-link`}
                        isProfessionalPlanRoute={true}
                    >
                        <Sheet className="size-[18px] shrink-0" />
                        <span>Sheet</span>
                    </NavLink>
                    <NavLink
                        href="/navigation-menu"
                        target="_blank"
                        className={`nav-link`}
                        isProfessionalPlanRoute={true}
                    >
                        <RectangleEllipsis className="size-[18px] shrink-0" />
                        <span>Navigation Menu</span>
                    </NavLink>
                    <NavLink
                        href="/pricing-plan"
                        target="_blank"
                        className={`nav-link`}
                        isProfessionalPlanRoute={true}
                    >
                        <Gem className="size-[18px] shrink-0" />
                        <span>Pricing</span>
                    </NavLink>

                    <h3 className="mt-2.5 whitespace-nowrap rounded-lg bg-gray-400 px-5 py-2.5 text-xs/tight font-semibold uppercase text-black">
                        <span>Tables and Forms</span>
                        <Minus className="hidden h-4 w-5 text-gray" />
                    </h3>

                    <NavLink href="/table" className={`nav-link`}>
                        <TableProperties className="size-[18px] shrink-0" />
                        <span>Table</span>
                    </NavLink>

                    <AccordionItem value="item-5" className="p-0 shadow-none">
                        <AccordionTrigger className="nav-link">
                            <ClipboardType className="size-[18px] shrink-0" />
                            <span>Forms</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="submenu space-y-2 pl-12 pr-5">
                                <li>
                                    <NavLink
                                        href="/checkbox"
                                        isAccordion={true}
                                    >
                                        Check Box & Radio
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/combobox"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Combobox
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        href="/command"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Command
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink href="/form" isAccordion={true}>
                                        Form
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/inputs"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Input
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        href="/input-otp"
                                        target="_blank"
                                        isAccordion={true}
                                        isProfessionalPlanRoute={true}
                                    >
                                        Input OTP
                                    </NavLink>
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <h3 className="mt-2.5 whitespace-nowrap rounded-lg bg-gray-400 px-5 py-2.5 text-xs/tight font-semibold uppercase text-black">
                        <span>Pages</span>
                        <Minus className="hidden h-4 w-5 text-gray" />
                    </h3>

                    <NavLink
                        href="/setting"
                        className={`nav-link ${pathName === '/setting' && '!text-black'}`}
                    >
                        <Settings className="size-[18px] shrink-0" />
                        <span>Settings</span>
                    </NavLink>

                    <AccordionItem value="item-6" className="p-0 shadow-none">
                        <AccordionTrigger className="nav-link">
                            <Fingerprint className="size-[18px] shrink-0" />
                            <span>Authentication</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="submenu space-y-2 pl-12 pr-5">
                                <li>
                                    <NavLink
                                        href="/login"
                                        target="_blank"
                                        isAccordion={true}
                                    >
                                        Login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/register"
                                        target="_blank"
                                        isAccordion={true}
                                    >
                                        Register
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/forgot"
                                        target="_blank"
                                        isAccordion={true}
                                    >
                                        Forgot
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href="/password"
                                        target="_blank"
                                        isAccordion={true}
                                    >
                                        Password
                                    </NavLink>
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <NavLink
                        href="/contact-us"
                        className={`nav-link ${pathName === '/contact-us' && '!text-black'}`}
                    >
                        <Phone className="size-[18px] shrink-0" />
                        <span>Contact Us</span>
                    </NavLink>
                </Accordion>
                <div className="upgrade-menu sticky bottom-0 rounded-[10px] bg-light-theme p-4 transition-all">
                    <span className="absolute -right-0 left-0 top-0 -z-[1]">
                        <Image
                            src="/images/rectangle-gird.png"
                            width={250}
                            height={230}
                            alt="rectangle-grid"
                            className="h-full w-full rounded-[10px]"
                        />
                    </span>
                    <span className="grid size-9 place-content-center rounded-lg bg-white shadow-[0_1px_1px_0_rgba(0,0,0,0.05),0_1px_4px_0_rgba(0,0,0,0.03)]">
                        <Rocket className="size-5 text-primary" />
                    </span>
                    <p className="mb-4 mt-3 font-semibold leading-5 text-black">
                        Get detailed report, sales analysis, with pro plan
                    </p>
                    <Link
                        href="https://sbthemes.lemonsqueezy.com/buy/69aeae3f-6c81-4804-a211-7b96e7e0e56a"
                        target="_blank"
                    >
                        <Button type="button" variant={'black'}>
                            Upgrade Now
                        </Button>
                    </Link>
                </div>
            </Card>
        </>
    )
}

export default Sidebar
