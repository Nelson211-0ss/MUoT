import type { LucideIcon } from 'lucide-react'
import {
  GraduationCap,
  Building2,
  Headphones,
  Users,
  Wallet,
  MessageCircle,
} from 'lucide-react'

export const CONTACT_HERO = {
  title: "Let's Connect With MUT",
  subtitle:
    'Reach our teams for admissions, academic records, ICT support, and campus services—through one intelligent contact experience.',
  slogan: 'Transforming Education Through Technology',
}

export const CONTACT_STATS = [
  { label: 'Avg. response', value: '< 24h' },
  { label: 'Support desks', value: '6' },
  { label: 'Satisfaction', value: '98%' },
]

export type ContactDepartment = {
  id: string
  title: string
  description: string
  email: string
  phone: string
  hours: string
  available: boolean
  icon: LucideIcon
  cta: string
}

export const CONTACT_DEPARTMENTS: ContactDepartment[] = [
  {
    id: 'admissions',
    title: 'Admissions Office',
    description: 'Applications, entry requirements, and enrollment guidance.',
    email: 'admissions@mut.edu.ss',
    phone: '+211 900 100 001',
    hours: 'Mon–Fri · 8:00–17:00',
    available: true,
    icon: GraduationCap,
    cta: 'Ask admissions',
  },
  {
    id: 'registrar',
    title: 'Academic Registrar',
    description: 'Transcripts, registration, and academic records.',
    email: 'registrar@mut.edu.ss',
    phone: '+211 900 100 002',
    hours: 'Mon–Fri · 8:00–16:00',
    available: true,
    icon: Building2,
    cta: 'Registrar desk',
  },
  {
    id: 'ict',
    title: 'ICT Helpdesk',
    description: 'Portal access, Moodle, email, and device support.',
    email: 'ict@mut.edu.ss',
    phone: '+211 900 100 003',
    hours: 'Mon–Sat · 7:00–20:00',
    available: true,
    icon: Headphones,
    cta: 'Get ICT help',
  },
  {
    id: 'affairs',
    title: 'Student Affairs',
    description: 'Campus life, welfare, clubs, and student services.',
    email: 'affairs@mut.edu.ss',
    phone: '+211 900 100 004',
    hours: 'Mon–Fri · 9:00–17:00',
    available: false,
    icon: Users,
    cta: 'Student services',
  },
  {
    id: 'finance',
    title: 'Finance Office',
    description: 'Tuition, fees, receipts, and payment plans.',
    email: 'finance@mut.edu.ss',
    phone: '+211 900 100 005',
    hours: 'Mon–Fri · 8:30–15:30',
    available: true,
    icon: Wallet,
    cta: 'Billing support',
  },
  {
    id: 'general',
    title: 'General Inquiry',
    description: 'Partnerships, media, and all other questions.',
    email: 'info@mut.edu.ss',
    phone: '+211 900 000 000',
    hours: 'Mon–Fri · 8:00–17:00',
    available: true,
    icon: MessageCircle,
    cta: 'Send message',
  },
]

export const FORM_DEPARTMENTS = CONTACT_DEPARTMENTS.map((d) => ({
  value: d.id,
  label: d.title,
}))

export const SUPPORT_CATEGORIES = [
  { id: 'portal', label: 'Portal access', desc: 'Login, password, MFA' },
  { id: 'moodle', label: 'MUT E-Learning', desc: 'Courses, submissions' },
  { id: 'fees', label: 'Fees & payments', desc: 'Invoices, receipts' },
  { id: 'records', label: 'Academic records', desc: 'Transcripts, results' },
]

export const RESPONSE_CARDS = [
  { label: 'Email tickets', time: 'Within 24 hours', status: 'online' as const },
  { label: 'ICT live chat', time: 'Under 15 minutes', status: 'online' as const },
  { label: 'Campus desk', time: 'Same business day', status: 'busy' as const },
]

export const CAMPUS_LOCATION = {
  address: 'Magwi Town, Eastern Equatoria State, South Sudan',
  coordinates: '4.130° N, 33.480° E',
  /** Approximate campus coordinates — update when official GIS is published */
  lat: 4.13,
  lng: 33.48,
  zoom: 14,
  landmarks: ['Main Administration Block', 'ICT Innovation Center', 'Student Center'],
  transport: 'Shuttle from Magwi town center · 10 min',
  parking: 'Visitor parking at Gate A',
}

/** Google Maps embed (no API key). Override with NEXT_PUBLIC_CAMPUS_MAP_EMBED_URL if needed. */
export function getCampusMapEmbedUrl() {
  const custom =
    typeof process.env.NEXT_PUBLIC_CAMPUS_MAP_EMBED_URL === 'string'
      ? process.env.NEXT_PUBLIC_CAMPUS_MAP_EMBED_URL.trim()
      : ''
  if (custom) return custom
  const { lat, lng, zoom } = CAMPUS_LOCATION
  const q = encodeURIComponent(`${lat},${lng}`)
  return `https://www.google.com/maps?q=${q}&hl=en&z=${zoom}&output=embed`
}

export function getCampusDirectionsUrl() {
  const { lat, lng } = CAMPUS_LOCATION
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

export function getCampusMapViewUrl() {
  const { lat, lng } = CAMPUS_LOCATION
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

export type FaqCategory = 'all' | 'admissions' | 'portal' | 'moodle' | 'fees' | 'records' | 'registration'

export type FaqItem = { id: string; category: Exclude<FaqCategory, 'all'>; q: string; a: string }

export const FAQ_CATEGORIES: { id: FaqCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'portal', label: 'Portal Access' },
  { id: 'moodle', label: 'Moodle Support' },
  { id: 'fees', label: 'Fees & Payments' },
  { id: 'records', label: 'Academic Records' },
  { id: 'registration', label: 'Registration' },
]

export const CONTACT_FAQS: FaqItem[] = [
  {
    id: '1',
    category: 'admissions',
    q: 'How do I start an online application?',
    a: 'Create an applicant account at Admissions → Apply Online, then complete the guided wizard with your documents.',
  },
  {
    id: '2',
    category: 'portal',
    q: 'I cannot sign in to the student portal.',
    a: 'Use the password reset link on the login page. If your account is new, check your email for the activation message from ICT.',
  },
  {
    id: '3',
    category: 'moodle',
    q: 'Where do I find my Moodle courses?',
    a: 'Sign in via E-Learning → MUT E-Learning with your university credentials. Courses appear after registration is confirmed.',
  },
  {
    id: '4',
    category: 'fees',
    q: 'How do I get a fee statement?',
    a: 'Open the student portal → Fees, or email finance@mut.edu.ss with your student ID for a PDF statement.',
  },
  {
    id: '5',
    category: 'records',
    q: 'How do I request an official transcript?',
    a: 'Submit a request through the registrar desk in the portal or visit the Academic Registrar office with valid ID.',
  },
  {
    id: '6',
    category: 'registration',
    q: 'When is course registration open?',
    a: 'Registration windows are published each semester on the portal dashboard and the News section.',
  },
]
