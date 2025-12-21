import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken, isTokenExpired, refreshToken, setToken } from '@/lib/utils'
import { isAuthUrl } from './auth-urls'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isAuthRequired = isAuthUrl(pathname)
  const tokenInfo = await getToken()

  if (isAuthRequired && !tokenInfo) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  if (tokenInfo && isTokenExpired(tokenInfo.accessToken)) {
    const refreshTokenInfo = await refreshToken(tokenInfo.userId, tokenInfo.refreshToken)
    if (refreshTokenInfo && refreshTokenInfo.accessToken) {
      setToken(refreshTokenInfo)
    } else if (isAuthRequired) {
      setToken(null)
      return NextResponse.redirect(new URL('/signin', request.url))
    } else {
      setToken(null)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
