import PageLayout from '@/components/PageLayout'
import SectionHeader from '@/components/SectionHeader'
import NewsArticleCard from '@/components/marketing/NewsArticleCard'
import MediaIntroPanel from '@/components/marketing/MediaIntroPanel'

const articles = [
  {
    title: 'New AI Program Launch',
    description: 'MUT introduces Artificial Intelligence and Data Science programmes for the 2026 intake.',
    date: 'May 10, 2026',
    category: 'Academics',
  },
  {
    title: 'Cybersecurity Lab Opens',
    description: 'Students gain hands-on experience in ethical hacking and network defense labs.',
    date: 'April 28, 2026',
    category: 'Campus',
  },
  {
    title: 'Industry Partnership Announced',
    description: 'MUT partners with leading tech companies to offer internships and mentorship.',
    date: 'April 15, 2026',
    category: 'Partnerships',
  },
  {
    title: 'Online Learning Expansion',
    description: 'New virtual classrooms and live sessions now available across all programmes.',
    date: 'March 30, 2026',
    category: 'E-Learning',
  },
  {
    title: 'Scholarship Applications Open',
    description: 'Merit-based scholarships available for outstanding technology students.',
    date: 'March 12, 2026',
    category: 'Admissions',
  },
  {
    title: 'Graduation Ceremony 2026',
    description: "Celebrating our graduates who are building Africa's digital future.",
    date: 'February 20, 2026',
    category: 'Events',
  },
]

export default function News() {
  return (
    <PageLayout
      title="Latest News"
      subtitle="Stay updated with announcements, events, and achievements at MUT."
    >
      <MediaIntroPanel
        title="Stories from across the university"
        description="Announcements, campus life, partnerships, and academic milestones — curated for applicants, students, and partners."
        badgeSub="News & media"
        reverse
      />

      <section className="mt-14 md:mt-16">
        <SectionHeader
          eyebrow="Updates"
          title="University news"
          subtitle="Recent highlights from Magwi University of Technology."
          align="left"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {articles.map((article) => (
            <NewsArticleCard key={article.title} {...article} />
          ))}
        </div>
      </section>
    </PageLayout>
  )
}
