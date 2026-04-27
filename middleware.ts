import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const PUBLIC_ROUTES = ['/login', '/register']
const PROTECTED_ROUTES = ['/create', '/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value
  const user = token ? verifyToken(token) : null

  // const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r))
  // const isPublic = PUBLIC_ROUTES.some(r => pathname.startsWith(r))

  // if (isProtected && !user) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  // if (isPublic && user) {
  //   return NextResponse.redirect(new URL('/create', request.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/create/:path*', '/dashboard/:path*', '/login', '/register'],
}
