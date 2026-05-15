import PageLayout from '@/components/PageLayout'
import InfoCard from '@/components/InfoCard'
import { Mail, Phone, MapPin } from 'lucide-react'
import ContactForm from '@/components/ContactForm'

export default function Contact() {
  return (
    <PageLayout
      title="Contact Us"
      subtitle="We are here to help with admissions, programs, and student support."
    >
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        <div>
          <div className="grid sm:grid-cols-1 gap-5 mb-10">
            <InfoCard icon={Mail} title="Email" desc="info@mut.edu" />
            <InfoCard icon={Phone} title="Phone" desc="+211 XXX XXX XXX" />
            <InfoCard icon={MapPin} title="Location" desc="Magwi, South Sudan" />
          </div>
        </div>

        <ContactForm />
      </div>
    </PageLayout>
  )
}
