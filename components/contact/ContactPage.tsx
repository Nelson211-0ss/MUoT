import ContactDepartments from '@/components/contact/ContactDepartments'
import ContactFaqSection from '@/components/contact/ContactFaqSection'
import ContactFormSection from '@/components/contact/ContactFormSection'
import ContactHero from '@/components/contact/ContactHero'
import ContactLocation from '@/components/contact/ContactLocation'
import ContactNewsletter from '@/components/contact/ContactNewsletter'
import ContactSocialSection from '@/components/contact/ContactSocialSection'
import ContactSupport from '@/components/contact/ContactSupport'

export default function ContactPage() {
  return (
    <div className="bg-white">
      <ContactHero />
      <div data-portal-scope="light" className="bg-white">
        <ContactDepartments />
        <ContactFormSection />
        <ContactSupport />
        <ContactLocation />
        <ContactFaqSection />
        <ContactSocialSection />
        <ContactNewsletter />
      </div>
    </div>
  )
}
