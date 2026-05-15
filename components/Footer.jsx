import Link from 'next/link'
import Logo from '@/components/Logo'

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
            <p className="text-gray-300 text-sm leading-relaxed">Building Africa&apos;s Digital Future.</p>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-secondary">Programs</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Software Engineering</li>
              <li>Cybersecurity</li>
              <li>Data Science</li>
              <li>Cloud Computing</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-secondary">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="/admissions" className="hover:text-white transition-colors">
                  Admissions
                </Link>
              </li>
              <li>
                <Link href="/student-portal" className="hover:text-white transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-secondary">Contact</h3>
            <p className="text-gray-300 text-sm">Magwi, South Sudan</p>
            <p className="text-gray-300 text-sm mt-2">info@mut.edu</p>
            <p className="text-gray-300 text-sm mt-1">+211 XXX XXX XXX</p>
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
