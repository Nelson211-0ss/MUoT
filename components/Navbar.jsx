'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ChevronDown, LogIn, PenSquare } from 'lucide-react'
import Logo from '@/components/Logo'
import SocialLinks from '@/components/SocialLinks'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/programs', label: 'Programs', dropdown: true },
  { href: '/admissions', label: 'Admissions' },
  { href: '/student-portal', label: 'Student Portal' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-gray-100 bg-white shadow-sm">
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Logo className="h-12 w-12 sm:h-14 sm:w-14 shrink-0" />
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-primary leading-tight tracking-wide uppercase">
              Magwi University
            </p>
            <p className="text-[11px] sm:text-xs font-bold text-primary leading-tight tracking-wide uppercase">
              of Technology
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-secondary mt-0.5">
              Innovating the Future
            </p>
          </div>
        </Link>

        <div className="hidden xl:flex items-center gap-6 2xl:gap-8 text-[15px] font-medium text-gray-700">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-1 flex items-center gap-1 hover:text-primary transition-colors ${
                  active ? 'text-primary' : ''
                }`}
              >
                {link.label}
                {link.dropdown && <ChevronDown size={16} className="opacity-70" />}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 mx-auto h-[3px] w-6 bg-secondary rounded-full" />
                )}
              </Link>
            )
          })}
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="border border-gray-300 text-gray-800 px-5 py-2 rounded-md text-sm font-medium hover:border-primary hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            <LogIn size={17} strokeWidth={1.75} aria-hidden />
            Login
          </Link>
          <Link
            href="/admissions"
            className="bg-secondary text-primary px-5 py-2 rounded-md text-sm font-bold hover:brightness-95 transition-all inline-flex items-center gap-2"
          >
            <PenSquare size={17} strokeWidth={1.75} aria-hidden />
            Apply Now
          </Link>
        </div>

        <button
          type="button"
          className="xl:hidden p-2 text-primary"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="xl:hidden border-t px-4 py-4 flex flex-col gap-3 font-medium text-gray-800 bg-white">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="border px-4 py-2 rounded-md text-sm inline-flex items-center gap-2"
            >
              <LogIn size={16} strokeWidth={1.75} aria-hidden />
              Login
            </Link>
            <Link
              href="/admissions"
              onClick={() => setOpen(false)}
              className="bg-secondary text-primary px-4 py-2 rounded-md text-sm font-bold inline-flex items-center gap-2"
            >
              <PenSquare size={16} strokeWidth={1.75} aria-hidden />
              Apply Now
            </Link>
          </div>
          <div className="pt-5 mt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Follow us</p>
            <SocialLinks variant="light" />
          </div>
        </div>
      )}
    </header>
  )
}
