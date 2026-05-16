import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE = 'mut_session'

/** Must match `lib/auth.js` — keep min length aligned or tokens verify in middleware but fail in RSC. */
function getSecret() {
  const s = process.env.JWT_SECRET
  if (!s || s.length < 16) return null
  return new TextEncoder().encode(s)
}

/** Role from JWT claims; empty/missing ⇒ treat as student (legacy tokens). */
function normalizedRole(payload) {
  const r = payload?.role
  if (r === undefined || r === null) return 'STUDENT'
  const s = String(r).trim()
  if (s === '') return 'STUDENT'
  return s.toUpperCase()
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname

  if (pathname === '/student') {
    const url = request.nextUrl.clone()
    url.pathname = '/student-portal'
    return NextResponse.redirect(url)
  }
  if (pathname === '/lecturer') {
    const url = request.nextUrl.clone()
    url.pathname = '/lecturer-portal'
    return NextResponse.redirect(url)
  }

  const { pathname: pathForMatch } = request.nextUrl

  const isStudentArea = pathForMatch === '/student-portal' || pathForMatch.startsWith('/student-portal/')
  const isLecturerArea = pathForMatch === '/lecturer-portal' || pathForMatch.startsWith('/lecturer-portal/')
  const isAdminArea = pathForMatch === '/admin' || pathForMatch.startsWith('/admin/')
  const needsAuth = isStudentArea || isLecturerArea || isAdminArea

  if (!needsAuth) {
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

  let payload
  try {
    ;({ payload } = await jwtVerify(token, secret))
  } catch {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  const role = normalizedRole(payload)

  if (isStudentArea && role !== 'STUDENT') {
    const url = request.nextUrl.clone()
    url.pathname = role === 'ADMIN' ? '/admin' : role === 'LECTURER' ? '/lecturer-portal' : '/login'
    url.searchParams.delete('next')
    return NextResponse.redirect(url)
  }
  if (isLecturerArea && role !== 'LECTURER') {
    const url = request.nextUrl.clone()
    url.pathname =
      role === 'ADMIN' ? '/admin' : role === 'STUDENT' ? '/student-portal' : '/login'
    url.searchParams.delete('next')
    return NextResponse.redirect(url)
  }
  if (isAdminArea && role !== 'ADMIN') {
    const url = request.nextUrl.clone()
    url.pathname =
      role === 'LECTURER' ? '/lecturer-portal' : role === 'STUDENT' ? '/student-portal' : '/login'
    url.searchParams.delete('next')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/student',
    '/lecturer',
    '/student-portal',
    '/student-portal/:path*',
    '/lecturer-portal',
    '/lecturer-portal/:path*',
    '/admin',
    '/admin/:path*',
  ],
}
