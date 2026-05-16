import PageLayout from '@/components/PageLayout'
import SectionHeader from '@/components/SectionHeader'
import prisma from '@/lib/prisma'

export const metadata = {
  title: 'Courses & catalogue | Magwi University of Technology',
  description:
    'Explore Magwi University of Technology modular offerings—digital pathways aligning with admissions and the LMS.',
}

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { code: 'asc' },
    include: {
      lecturer: { select: { name: true } },
      _count: { select: { enrollments: true, materials: true, assignments: true } },
    },
  })

  return (
    <PageLayout
      title="E-Learning & course catalogue"
      subtitle="Unified view of modular offerings bridging the marketing site with student and lecturer portals."
    >
      <SectionHeader
        title="Courses"
        align="left"
        subtitle="Enrollment still flows through Admissions and Registrar desk—students see active modules instantly once provisioned inside the LMS."
      />

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        {courses.length === 0 ? (
          <p className="text-gray-600 text-sm md:col-span-2 border border-dashed border-gray-200 rounded-xl p-10 text-center">
            Curriculum records appear here automatically after admins seed courses.
          </p>
        ) : (
          courses.map((c) => (
            <article
              key={c.id}
              id={c.id}
              className="rounded-2xl border border-gray-100 bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.06)] scroll-mt-28"
            >
              <div className="flex flex-wrap items-baseline gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wide text-secondary">{c.code}</span>
                <h2 className="text-xl font-bold text-primary flex-1 min-w-[12rem]">{c.title}</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {c.lecturer
                  ? <>Lead facilitator: <span className="font-semibold">{c.lecturer.name}</span>.</>
                  : 'Faculty assignment pending—check back after academic scheduling publishes.'}{' '}
                This catalogue entry mirrors portals so marketing, lecturers, and students share one authoritative course graph.
              </p>
              <dl className="grid grid-cols-3 gap-3 text-[13px] text-gray-700 border-t border-gray-100 pt-4">
                <div>
                  <dt className="text-gray-400 text-xs uppercase">Enrolled</dt>
                  <dd className="font-bold text-primary">{c._count.enrollments}</dd>
                </div>
                <div>
                  <dt className="text-gray-400 text-xs uppercase">Materials</dt>
                  <dd className="font-bold">{c._count.materials}</dd>
                </div>
                <div>
                  <dt className="text-gray-400 text-xs uppercase">Assessments</dt>
                  <dd className="font-bold">{c._count.assignments}</dd>
                </div>
              </dl>
            </article>
          ))
        )}
      </div>

      <p className="text-sm text-gray-500 mt-12 max-w-3xl leading-relaxed">
        Video pacing, moderated forums, and mobile-money billing remain on the product roadmap—all reuse this canonical course identity so SSO, auditing, and Magwi storytelling stay cohesive.
      </p>
    </PageLayout>
  )
}
