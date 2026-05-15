import { MonitorSmartphone, Briefcase, UsersRound, BadgeCheck } from 'lucide-react'

const features = [
  {
    icon: MonitorSmartphone,
    title: '100% Online Learning',
    desc: 'Study from anywhere with flexible online courses.',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
  {
    icon: Briefcase,
    title: 'Industry Relevant',
    desc: 'Curriculum aligned with current tech industry needs.',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
  },
  {
    icon: UsersRound,
    title: 'Expert Instructors',
    desc: 'Learn from experienced professionals and educators.',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
  },
  {
    icon: BadgeCheck,
    title: 'Recognized Certificates',
    desc: 'Earn credentials valued by employers worldwide.',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-700',
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50/80 to-white -mt-2 pt-10 pb-14 md:pt-12 md:pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-12">
          <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Why choose MUT</p>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">Designed for flexible, career-focused learning</h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Study on your schedule with practical projects, mentor support, and credentials that resonate with employers.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="flex items-start gap-4 h-full p-5 rounded-xl bg-white border border-gray-100 shadow-[0_4px_20px_rgba(7,28,77,0.04)]"
              >
                <div
                  className={`shrink-0 w-14 h-14 rounded-full ${feature.iconBg} flex items-center justify-center ${feature.iconColor}`}
                >
                  <Icon size={26} strokeWidth={1.75} />
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-bold text-primary text-[15px] leading-snug mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
