'use client'

import Link from 'next/link'
import { useTranslation } from '@/i18n' // or from provider
import { i18n as i18nConfig } from '@/i18n-config'
import { ComponentProps } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LinkProps = Omit<ComponentProps<typeof Link>, 'href'> & { href: any }

export const LocalizedLink = ({ href, children, ...props }: LinkProps) => {
    const { i18n } = useTranslation()
    const locale = i18n.language

    let localizedHref = href

    if (locale && locale !== i18nConfig.defaultLocale) {
        if (typeof href === 'string') {
            if (href.startsWith('/') && !href.startsWith(`/${locale}`)) {
                localizedHref = `/${locale}${href}`
            }
        } else if (typeof href === 'object' && href.pathname) {
            if (href.pathname.startsWith('/') && !href.pathname.startsWith(`/${locale}`)) {
                localizedHref = { ...href, pathname: `/${locale}${href.pathname}` }
            }
        }
    }

    return (
        <Link
            {...props}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            href={localizedHref as any}
        >
            {children}
        </Link>
    )
}
