import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { MANAGEMENT_ROLE_SLUGS, HOD_ROLE_SLUG } from '@/lib/rbac/constants'

const COOKIE = 'mut_session'

function getSecret() {
  const s = process.env.JWT_SECRET
  if (!s || s.length < 16) return null
  return new TextEncoder().encode(s)
}

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
  const isApplicantArea = pathForMatch === '/applicant-portal' || pathForMatch.startsWith('/applicant-portal/')
  const isHodArea = pathForMatch === '/hod-portal' || pathForMatch.startsWith('/hod-portal/')
  const needsAuth = isStudentArea || isLecturerArea || isAdminArea || isApplicantArea || isHodArea

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

  if (isApplicantArea && role !== 'APPLICANT') {
    const url = request.nextUrl.clone()
    if (MANAGEMENT_ROLE_SLUGS.has(role)) url.pathname = '/admin'
    else if (role === 'STUDENT') url.pathname = '/student-portal'
    else if (role === 'LECTURER') url.pathname = '/lecturer-portal'
    else if (role === HOD_ROLE_SLUG) url.pathname = '/hod-portal'
    else url.pathname = '/login'
    url.searchParams.delete('next')
    return NextResponse.redirect(url)
  }

  if (isStudentArea && role !== 'STUDENT') {
    const url = request.nextUrl.clone()
    if (role === 'APPLICANT') url.pathname = '/applicant-portal'
    else if (MANAGEMENT_ROLE_SLUGS.has(role)) url.pathname = '/admin'
    else if (role === 'LECTURER') url.pathname = '/lecturer-portal'
    else if (role === HOD_ROLE_SLUG) url.pathname = '/hod-portal'
    else url.pathname = '/login'
    url.searchParams.delete('next')
    return NextResponse.redirect(url)
  }
  if (isLecturerArea && role !== 'LECTURER') {
    const url = request.nextUrl.clone()
    if (MANAGEMENT_ROLE_SLUGS.has(role)) url.pathname = '/admin'
    else if (role === 'STUDENT') url.pathname = '/student-portal'
    else if (role === 'APPLICANT') url.pathname = '/applicant-portal'
    else if (role === HOD_ROLE_SLUG) url.pathname = '/hod-portal'
    else url.pathname = '/login'
    url.searchParams.delete('next')
    return NextResponse.redirect(url)
  }
  if (isAdminArea && !MANAGEMENT_ROLE_SLUGS.has(role)) {
    const url = request.nextUrl.clone()
    if (role === 'LECTURER') url.pathname = '/lecturer-portal'
    else if (role === 'STUDENT') url.pathname = '/student-portal'
    else if (role === 'APPLICANT') url.pathname = '/applicant-portal'
    else if (role === HOD_ROLE_SLUG) url.pathname = '/hod-portal'
    else url.pathname = '/login'
    url.searchParams.delete('next')
    return NextResponse.redirect(url)
  }

  if (isHodArea && role !== HOD_ROLE_SLUG) {
    const url = request.nextUrl.clone()
    if (MANAGEMENT_ROLE_SLUGS.has(role)) url.pathname = '/admin'
    else if (role === 'LECTURER') url.pathname = '/lecturer-portal'
    else if (role === 'STUDENT') url.pathname = '/student-portal'
    else if (role === 'APPLICANT') url.pathname = '/applicant-portal'
    else url.pathname = '/login'
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
    '/applicant-portal',
    '/applicant-portal/:path*',
    '/hod-portal',
    '/hod-portal/:path*',
    '/admin',
    '/admin/:path*',
  ],
}
