import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { hasAuthCookie } from '@/lib/utils/authentication-and-authorization'
import { isAuthRequired } from './auth-urls'
import { i18n } from './i18n-config'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // Negotiator requires specific headers type
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  // Matcher types mismatch with Negotiator output? Apparently not anymore.
  const locales: string[] = [...i18n.locales]
  return matchLocale(languages, locales, i18n.defaultLocale)
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 1. Localization Logic
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  let response: NextResponse | undefined
  let currentLocale: string

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request) || i18n.defaultLocale
    currentLocale = locale

    if (locale === i18n.defaultLocale) {
      if (!pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.startsWith('/assets') && !pathname.includes('favicon.ico')) {
        // Internal rewrite for default locale
        response = NextResponse.rewrite(new URL(`/${locale}${pathname}`, request.url))
      }
    } else {
      // Redirect to localized path
      return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
    }
  } else {
    // Path has locale
    const segment = pathname.split('/')[1]
    currentLocale = segment

    // Check if it's default locale in URL (e.g. /en/...) and redirect to prefix-less if needed
    if (segment === i18n.defaultLocale) {
      const newPathname = pathname.replace(`/${i18n.defaultLocale}`, '') || '/';
      return NextResponse.redirect(new URL(newPathname, request.url));
    }
  }

  // 2. Auth Logic
  // Normalize path by stripping locale to check against auth rules
  // If we are rewriting (response exists), the effective path is `/${locale}${pathname}` (which has locale).
  // But we want to check logic against the "logical" path (admin pages defined as /app/...).

  // Actually isAuthRequired checks for /app/.
  // If path is `/en/app/...`, `pathname` (original) is what we have?
  // If we have `response` (rewrite), the *original* `request.nextUrl.pathname` is `/app/...` (missing locale).
  // If we *don't* have `response` (path has locale), `request.nextUrl.pathname` is `/en/app/...`.

  let pathToCheck = pathname
  if (!pathnameIsMissingLocale) {
    // Remove locale prefix for auth check
    // e.g. /en/app/dashboard -> /app/dashboard
    // e.g. /en -> /
    pathToCheck = pathname.replace(`/${currentLocale}`, '') || '/'
  }

  // NOTE: isAuthRequired checks `url.includes('/app/')`.
  // `/app/dashboard` includes `/app/`.
  // `/en/app/dashboard` includes `/app/`.
  // So strict normalization might not be strictly required for *inclusion* check,
  // but `getMatchedAuthUrl` does strict matching on `url`.
  // So we SHOULD normalize.

  const isAuthenticated = await hasAuthCookie()

  if (isAuthRequired(pathToCheck) && !isAuthenticated) {
    // Redirect to signin, preserving locale
    // If currentLocale is default, signin is `/signin`
    // If currentLocale is other, signin is `/${currentLocale}/signin`

    let signinPath = '/signin'
    if (currentLocale !== i18n.defaultLocale) {
      signinPath = `/${currentLocale}/signin`
    }

    return NextResponse.redirect(new URL(signinPath, request.url))
  }

  return response || NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
