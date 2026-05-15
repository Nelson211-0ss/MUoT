import { Laptop, Award, Users, FileBadge } from 'lucide-react'

const features = [
  {
    icon: Laptop,
    title: '100% Online Learning',
    desc: 'Study from anywhere with flexible online courses.',
  },
  {
    icon: Award,
    title: 'Industry Relevant',
    desc: 'Curriculum aligned with current tech industry needs.',
  },
  {
    icon: Users,
    title: 'Expert Instructors',
    desc: 'Learn from experienced professionals and educators.',
  },
  {
    icon: FileBadge,
    title: 'Recognized Certificates',
    desc: 'Earn credentials valued by employers worldwide.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-white -mt-2 pt-6 pb-12 md:pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="shrink-0 w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                  <Icon size={26} strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-[15px] leading-snug mb-1">{feature.title}</h3>
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
