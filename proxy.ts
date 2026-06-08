import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('firebase-token')?.value

  const protectedPaths = ['/account', '/checkout', '/admin']
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/admin/:path*'],
}
