import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { hasAuthCookie } from '@/lib/utils'
import { isAuthUrl } from './auth-urls'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isAuthRequired = isAuthUrl(pathname)
  const isAuthenticated = await hasAuthCookie()

  if (isAuthRequired && !isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
