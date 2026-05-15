const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const courses = [
  { code: 'CS101', title: 'Introduction to Programming' },
  { code: 'SE201', title: 'Software Engineering Fundamentals' },
  { code: 'CY301', title: 'Network Security' },
]

async function main() {
  await prisma.assignmentProgress.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany({ where: { email: 'demo@mut.edu' } })
  await prisma.application.deleteMany()
  await prisma.contactMessage.deleteMany()

  const passwordHash = await bcrypt.hash('demo123', 10)

  const user = await prisma.user.create({
    data: {
      email: 'demo@mut.edu',
      name: 'Demo Student',
      passwordHash,
      role: 'STUDENT',
    },
  })

  for (const c of courses) {
    const course = await prisma.course.create({ data: c })

    const a1 = await prisma.assignment.create({
      data: {
        courseId: course.id,
        title: 'Module 1 practical',
        dueDate: new Date(Date.now() + 7 * 86400000),
      },
    })
    const a2 = await prisma.assignment.create({
      data: {
        courseId: course.id,
        title: 'Mid-term project',
        dueDate: new Date(Date.now() + 21 * 86400000),
      },
    })

    await prisma.enrollment.create({
      data: { userId: user.id, courseId: course.id },
    })

    await prisma.assignmentProgress.create({
      data: {
        userId: user.id,
        assignmentId: a1.id,
        status: 'SUBMITTED',
        grade: 85,
      },
    })
    await prisma.assignmentProgress.create({
      data: {
        userId: user.id,
        assignmentId: a2.id,
        status: 'PENDING',
      },
    })
  }

  // eslint-disable-next-line no-console
  console.log('Seed OK: demo@mut.edu / demo123')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
