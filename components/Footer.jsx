import Link from 'next/link'
import { BookOpen, MapPin, Mail, Phone, Compass, ArrowRight } from 'lucide-react'
import Logo from '@/components/Logo'
import SocialLinks from '@/components/SocialLinks'

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-4">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-14 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo className="h-12 w-12" />
              <div>
                <p className="font-bold text-sm uppercase tracking-wide">MUT</p>
                <p className="text-secondary text-xs font-semibold">Innovating the Future</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-5">Building Africa&apos;s Digital Future.</p>
            <p className="text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Follow us</p>
            <SocialLinks variant="dark" />
          </div>

          <div>
            <h3 className="font-bold mb-4 text-secondary inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4 shrink-0" strokeWidth={1.75} aria-hidden />
              Programs
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Software Engineering</li>
              <li>Cybersecurity</li>
              <li>Data Science</li>
              <li>Cloud Computing</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-secondary inline-flex items-center gap-2">
              <Compass className="w-4 h-4 shrink-0" strokeWidth={1.75} aria-hidden />
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="/admissions" className="inline-flex items-center gap-2 hover:text-white transition-colors group">
                  <ArrowRight className="w-3.5 h-3.5 text-secondary shrink-0 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} aria-hidden />
                  Admissions
                </Link>
              </li>
              <li>
                <Link href="/student-portal" className="inline-flex items-center gap-2 hover:text-white transition-colors group">
                  <ArrowRight className="w-3.5 h-3.5 text-secondary shrink-0 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} aria-hidden />
                  Student Portal
                </Link>
              </li>
              <li>
                <Link href="/news" className="inline-flex items-center gap-2 hover:text-white transition-colors group">
                  <ArrowRight className="w-3.5 h-3.5 text-secondary shrink-0 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} aria-hidden />
                  News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="inline-flex items-center gap-2 hover:text-white transition-colors group">
                  <ArrowRight className="w-3.5 h-3.5 text-secondary shrink-0 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} aria-hidden />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-secondary">Contact</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex gap-3 items-start leading-snug">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-secondary" strokeWidth={1.75} aria-hidden />
                <span>Magwi, South Sudan</span>
              </li>
              <li className="flex gap-3 items-start">
                <Mail className="w-4 h-4 shrink-0 mt-0.5 text-secondary" strokeWidth={1.75} aria-hidden />
                <a href="mailto:info@mut.edu" className="hover:text-white transition-colors">
                  info@mut.edu
                </a>
              </li>
              <li className="flex gap-3 items-start">
                <Phone className="w-4 h-4 shrink-0 mt-0.5 text-secondary" strokeWidth={1.75} aria-hidden />
                <span>+211 XXX XXX XXX</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="text-center text-gray-400 text-xs py-5">
          © {new Date().getFullYear()} Magwi University of Technology. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
