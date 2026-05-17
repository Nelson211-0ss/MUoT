import ContactDepartments from '@/components/contact/ContactDepartments'
import ContactFormSection from '@/components/contact/ContactFormSection'
import ContactHero from '@/components/contact/ContactHero'
import ContactLocation from '@/components/contact/ContactLocation'
import ContactNewsletter from '@/components/contact/ContactNewsletter'
import ContactSupport from '@/components/contact/ContactSupport'

export default function ContactPage() {
  return (
    <div className="bg-white">
      <ContactHero />
      <div data-public-light className="bg-white">
        <ContactDepartments />
        <ContactFormSection />
        <ContactSupport />
        <ContactLocation />
        <ContactNewsletter />
      </div>
    </div>
  )
}
