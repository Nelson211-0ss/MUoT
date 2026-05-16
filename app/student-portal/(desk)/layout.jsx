import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getSessionFromCookies } from '@/lib/auth'
import { isHoDRoleSlug, isManagementRoleSlug } from '@/lib/rbac/constants'

export default async function StudentDeskRootLayout({ children }) {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    redirect('/login?next=/student-portal')
  }

  const viewer = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      role: true,
      studentLoginNumber: true,
      studentPasswordConfigured: true,
    },
  })

  if (!viewer) {
    redirect('/login?next=/student-portal')
  }

  const slug = (viewer.role ?? '').trim().toUpperCase()
  if (isManagementRoleSlug(slug)) {
    redirect('/admin')
  }
  if (slug === 'LECTURER') {
    redirect('/lecturer-portal')
  }
  if (isHoDRoleSlug(slug)) {
    redirect('/hod-portal')
  }
  if (slug !== 'STUDENT') {
    redirect(`/login?next=${encodeURIComponent('/student-portal')}`)
  }

  if (viewer.studentPasswordConfigured === false) {
    redirect('/student-portal/setup-password')
  }

  return children
}
