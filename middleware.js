import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE = 'mut_session'

function getSecret() {
  const s = process.env.JWT_SECRET
  if (!s || s.length < 8) return null
  return new TextEncoder().encode(s)
}

export async function middleware(request) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/student-portal')) {
    return NextResponse.next()
  }

  const secret = getSecret()
  const token = request.cookies.get(COOKIE)?.value

  if (!secret || !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/student-portal', '/student-portal/:path*'],
}
