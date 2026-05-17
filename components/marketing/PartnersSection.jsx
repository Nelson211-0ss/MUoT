import Image from 'next/image'

import SectionHeader from '@/components/SectionHeader'
import { homePartners } from '@/lib/partners'

function PartnerLogoCard({ name, logo }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl border border-gray-200/90 bg-white px-4 py-3 shadow-[0_2px_16px_rgba(7,28,77,0.05)] ring-1 ring-black/[0.03]">
      <Image
        src={logo}
        alt={name}
        width={224}
        height={96}
        className="mx-auto max-h-14 w-auto max-w-full object-contain object-center sm:max-h-[3.75rem] md:max-h-[4.25rem]"
        sizes="224px"
      />
    </div>
  )
}

export default function PartnersSection() {
  return (
    <section className="border-t border-gray-100 bg-gradient-to-b from-slate-50/80 to-white py-14 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeader
          eyebrow="Our partners"
          title="Industry and academic alliances"
          subtitle="Recognised certification bodies and university partners that strengthen our programmes and graduate outcomes."
          align="center"
        />

        <ul className="mx-auto flex max-w-6xl flex-wrap items-stretch justify-center gap-4 sm:gap-5">
          {homePartners.map((partner) => (
            <li
              key={partner.name}
              className="flex h-28 w-[11.5rem] shrink-0 sm:h-[7.75rem] sm:w-48 md:h-[8.25rem] md:w-[12.75rem]"
            >
              <PartnerLogoCard {...partner} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
