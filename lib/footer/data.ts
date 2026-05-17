import type { LucideIcon } from 'lucide-react'
import { Home, LayoutDashboard, LifeBuoy } from 'lucide-react'

export type FooterLinkItem = {
  label: string
  href: string
  external?: boolean
}

export type FooterLinkGroup = {
  id: string
  title: string
  icon?: LucideIcon
  links: FooterLinkItem[]
}

export const FOOTER_BRAND = {
  name: 'Magwi University of Technology',
  acronym: 'MUT',
  slogan: 'Transforming Education Through Technology',
  description:
    'A secure digital campus for applicants, students, faculty, and administration—excellence in technology education across South Sudan and beyond.',
}

export const FOOTER_CONTACT = {
  address: 'Magwi Town, Eastern Equatoria State, South Sudan',
  email: 'info@mut.edu.ss',
  phone: '+211 900 000 000',
  website: 'https://www.mut.edu.ss',
  websiteLabel: 'www.mut.edu.ss',
}

export const FOOTER_QUICK_LINKS: FooterLinkGroup = {
  id: 'quick',
  title: 'Quick Links',
  icon: Home,
  links: [
    { label: 'Home', href: '/' },
    { label: 'Admissions', href: '/admissions' },
    { label: 'Academics', href: '/programs' },
    { label: 'MUT E-Learning', href: '/moodle' },
    { label: 'Student Portal', href: '/student-portal' },
    { label: 'Library', href: '/courses' },
    { label: 'Contact Us', href: '/contact' },
  ],
}

export const FOOTER_PORTAL_SERVICES: FooterLinkGroup = {
  id: 'portal',
  title: 'Portal Services',
  icon: LayoutDashboard,
  links: [
    { label: 'Course Registration', href: '/student-portal' },
    { label: 'Timetable', href: '/student-portal' },
    { label: 'Results', href: '/student-portal' },
    { label: 'Helpdesk', href: '/contact' },
    { label: 'Downloads', href: '/contact' },
    { label: 'Announcements', href: '/news' },
    { label: 'Dashboard Access', href: '/login' },
    { label: 'Support Center', href: '/contact' },
  ],
}

export const FOOTER_SUPPORT: FooterLinkGroup = {
  id: 'support',
  title: 'Support & Resources',
  icon: LifeBuoy,
  links: [
    { label: 'ICT Helpdesk', href: '/contact' },
    { label: 'FAQs', href: '/admissions/faqs' },
    { label: 'Documentation', href: '/moodle' },
    { label: 'Ticket Support', href: '/contact' },
    { label: 'Accessibility Support', href: '/contact' },
    { label: 'Password Reset', href: '/student-portal/setup-password' },
  ],
}

export const FOOTER_LEGAL: FooterLinkItem[] = [
  { label: 'Privacy Policy', href: '/contact?policy=privacy' },
  { label: 'Terms of Service', href: '/contact?policy=terms' },
  { label: 'Cookie Policy', href: '/contact?policy=cookies' },
  { label: 'Accessibility Policy', href: '/contact?policy=accessibility' },
  { label: 'Data Protection Policy', href: '/contact?policy=data-protection' },
]

export const FOOTER_LINK_COLUMNS = [FOOTER_QUICK_LINKS, FOOTER_PORTAL_SERVICES, FOOTER_SUPPORT]

export const FOOTER_SOCIAL = [
  { label: 'Facebook', href: 'https://www.facebook.com/', network: 'facebook' as const },
  { label: 'X', href: 'https://x.com/', network: 'x' as const },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', network: 'linkedin' as const },
  { label: 'Instagram', href: 'https://www.instagram.com/', network: 'instagram' as const },
  { label: 'YouTube', href: 'https://www.youtube.com/', network: 'youtube' as const },
]
