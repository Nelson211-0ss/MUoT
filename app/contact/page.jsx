import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactPage from '@/components/contact/ContactPage'
import { AnimateRouteShell } from '@/components/PageMotion'

export const metadata = {
  title: 'Contact | Magwi University of Technology',
  description: 'Connect with MUT admissions, registrar, ICT helpdesk, and campus services.',
}

export default function Contact() {
  return (
    <main data-portal-scope="light" className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <AnimateRouteShell className="flex flex-1 flex-col">
        <ContactPage />
        <Footer />
      </AnimateRouteShell>
    </main>
  )
}
