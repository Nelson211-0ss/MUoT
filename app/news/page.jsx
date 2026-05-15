import PageLayout from '@/components/PageLayout'
import SectionHeader from '@/components/SectionHeader'
import { Calendar } from 'lucide-react'

const articles = [
  {
    title: 'New AI Program Launch',
    desc: 'MUT introduces Artificial Intelligence and Data Science programs for the 2026 intake.',
    date: 'May 10, 2026',
  },
  {
    title: 'Cybersecurity Lab Opens',
    desc: 'Students gain hands-on experience in ethical hacking and network defense labs.',
    date: 'April 28, 2026',
  },
  {
    title: 'Industry Partnership Announced',
    desc: 'MUT partners with leading tech companies to offer internships and mentorship.',
    date: 'April 15, 2026',
  },
  {
    title: 'Online Learning Expansion',
    desc: 'New virtual classrooms and live sessions now available across all programs.',
    date: 'March 30, 2026',
  },
  {
    title: 'Scholarship Applications Open',
    desc: 'Merit-based scholarships available for outstanding technology students.',
    date: 'March 12, 2026',
  },
  {
    title: 'Graduation Ceremony 2026',
    desc: 'Celebrating our graduates who are building Africa\'s digital future.',
    date: 'February 20, 2026',
  },
]

export default function News() {
  return (
    <PageLayout
      title="Latest News"
      subtitle="Stay updated with announcements, events, and achievements at MUT."
    >
      <SectionHeader
        title="University Updates"
        subtitle="News and stories from Magwi University of Technology."
        align="left"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {articles.map((article) => (
          <article
            key={article.title}
            className="bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
              <Calendar size={14} />
              <span>{article.date}</span>
            </div>
            <h2 className="font-bold text-primary text-lg mb-2 leading-snug">{article.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{article.desc}</p>
            <button type="button" className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              Read More →
            </button>
          </article>
        ))}
      </div>
    </PageLayout>
  )
}
