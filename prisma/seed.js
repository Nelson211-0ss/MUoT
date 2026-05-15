const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const courses = [
  { code: 'CS101', title: 'Introduction to Programming' },
  { code: 'SE201', title: 'Software Engineering Fundamentals' },
  { code: 'CY301', title: 'Network Security' },
]

async function main() {
  await prisma.announcement.deleteMany()
  await prisma.courseMaterial.deleteMany()
  await prisma.assignmentProgress.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany({
    where: { email: { in: ['demo@mut.edu', 'lecturer@mut.edu', 'admin@mut.edu'] } },
  })
  await prisma.application.deleteMany()
  await prisma.contactMessage.deleteMany()

  const passwordHash = await bcrypt.hash('demo123', 10)

  const student = await prisma.user.create({
    data: {
      email: 'demo@mut.edu',
      name: 'Demo Student',
      passwordHash,
      role: 'STUDENT',
    },
  })

  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      email: 'admin@mut.edu',
      name: 'System Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })

  const lecturerPassword = await bcrypt.hash('lecturer123', 10)
  const lecturer = await prisma.user.create({
    data: {
      email: 'lecturer@mut.edu',
      name: 'Demo Lecturer',
      passwordHash: lecturerPassword,
      role: 'LECTURER',
    },
  })

  for (const c of courses) {
    const course = await prisma.course.create({
      data: { ...c, lecturerId: lecturer.id },
    })

    const a1 = await prisma.assignment.create({
      data: {
        courseId: course.id,
        title: 'Module 1 practical',
        description:
          'Complete the exercises from the syllabus and upload your work as a single PDF or ZIP file.',
        maxPoints: 100,
        dueDate: new Date(Date.now() + 7 * 86400000),
      },
    })
    const a2 = await prisma.assignment.create({
      data: {
        courseId: course.id,
        title: 'Mid-term project',
        description:
          'Submit a brief report plus any code artifacts. Late submissions incur a deduction per syllabus.',
        maxPoints: 100,
        dueDate: new Date(Date.now() + 21 * 86400000),
      },
    })

    await prisma.enrollment.create({
      data: { userId: student.id, courseId: course.id },
    })

    await prisma.assignmentProgress.create({
      data: {
        userId: student.id,
        assignmentId: a1.id,
        status: 'SUBMITTED',
        grade: 85,
      },
    })
    await prisma.assignmentProgress.create({
      data: {
        userId: student.id,
        assignmentId: a2.id,
        status: 'PENDING',
      },
    })
  }

  // eslint-disable-next-line no-console
  console.log(
    'Seed OK:\n  Admin: admin@mut.edu / admin123\n  Student: demo@mut.edu / demo123\n  Lecturer: lecturer@mut.edu / lecturer123',
  )
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
