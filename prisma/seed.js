const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const rbac = require('./rbac-matrix.cjs')

const prisma = new PrismaClient()

const DEMO_USERS = [
  { email: 'demo@mut.edu', name: 'Demo Student', role: 'STUDENT', password: 'demo123' },
  { email: 'admin@mut.edu', name: 'System Admin', role: 'ADMIN', password: 'admin123' },
  { email: 'lecturer@mut.edu', name: 'Demo Lecturer', role: 'LECTURER', password: 'lecturer123' },
  { email: 'hod@mut.edu', name: 'Demo HOD', role: 'HOD', password: 'hod123' },
  { email: 'super@mut.edu', name: 'Super Administrator', role: 'SUPER_ADMIN', password: 'super123' },
  { email: 'finance@mut.edu', name: 'Finance Officer', role: 'FINANCE_OFFICER', password: 'finance123' },
  { email: 'admissions@mut.edu', name: 'Admissions Officer', role: 'ADMISSIONS_OFFICER', password: 'admissions123' },
  { email: 'dept@mut.edu', name: 'Department Admin', role: 'DEPARTMENT_ADMIN', password: 'dept123' },
  { email: 'registrar@mut.edu', name: 'Academic Registrar', role: 'ACADEMIC_REGISTRAR', password: 'registrar123' },
  { email: 'applicant@mut.edu', name: 'Akuol Applicant', role: 'APPLICANT', password: 'apply123' },
]

async function seedAdmissionCatalog(tx) {
  const faculty = await tx.admissionFaculty.create({
    data: {
      code: 'FET',
      name: 'Faculty of Engineering & Technology',
    },
  })

  await tx.admissionProgram.createMany({
    data: [
      { facultyId: faculty.id, code: 'BSSE', slug: 'bs-software-engineering', name: 'Software Engineering' },
      { facultyId: faculty.id, code: 'BSIT', slug: 'bs-information-technology', name: 'Information Technology' },
      { facultyId: faculty.id, code: 'CYBER', slug: 'cyber-security', name: 'Cybersecurity' },
      { facultyId: faculty.id, code: 'DSC', slug: 'data-science', name: 'Data Science' },
      { facultyId: faculty.id, code: 'NET', slug: 'networking', name: 'Networking' },
      { facultyId: faculty.id, code: 'CLD', slug: 'cloud-computing', name: 'Cloud Computing' },
      { facultyId: faculty.id, code: 'AML', slug: 'ai-machine-learning', name: 'AI & Machine Learning' },
    ],
  })

  const year = new Date().getFullYear()
  await tx.admissionIntake.createMany({
    data: [
      { label: `September ${year}`, year, isOpen: true },
      { label: `March ${year + 1}`, year: year + 1, isOpen: true },
    ],
  })
}

async function attachUserRole(tx, userId, roleSlug) {
  const role = await tx.role.findUnique({ where: { slug: roleSlug } })
  if (!role) throw new Error(`Missing role slug: ${roleSlug}`)
  await tx.userRole.create({ data: { userId, roleId: role.id } })
}

async function seedRbac() {
  await prisma.rolePermission.deleteMany()
  await prisma.permission.deleteMany()
  await prisma.role.deleteMany()

  await prisma.role.createMany({
    data: rbac.roles.map((r) => ({
      slug: r.slug,
      name: r.name,
      description: r.description ?? null,
      level: r.level ?? 0,
    })),
  })

  await prisma.permission.createMany({
    data: rbac.permissions.map((p) => ({
      key: p.key,
      name: p.name,
      description: null,
    })),
  })

  const roleRows = await prisma.role.findMany()
  const permRows = await prisma.permission.findMany()
  const rolesBySlug = Object.fromEntries(roleRows.map((r) => [r.slug, r]))
  const permByKey = Object.fromEntries(permRows.map((p) => [p.key, p]))

  const linkRows = []
  for (const [slug, keys] of Object.entries(rbac.rolePermissionKeys)) {
    const rr = rolesBySlug[slug]
    if (!rr) continue
    for (const key of keys) {
      const pr = permByKey[key]
      if (!pr) throw new Error(`Permission key missing: ${key}`)
      linkRows.push({ roleId: rr.id, permissionId: pr.id })
    }
  }

  await prisma.rolePermission.createMany({ data: linkRows })
}

async function main() {
  await seedRbac()

  await prisma.auditLog.deleteMany()
  await prisma.userRole.deleteMany()

  await prisma.admissionInAppNotification.deleteMany()
  await prisma.admissionApplication.deleteMany()
  await prisma.admissionIntake.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.admissionFaculty.deleteMany()

  await prisma.user.deleteMany({
    where: { email: { in: DEMO_USERS.map((u) => u.email) } },
  })

  await prisma.application.deleteMany()
  await prisma.contactMessage.deleteMany()

  await prisma.$transaction(async (tx) => {
    const userByRole = {}
    for (const du of DEMO_USERS) {
      const passwordHash = await bcrypt.hash(du.password, 10)
      const u = await tx.user.create({
        data: {
          email: du.email,
          name: du.name,
          passwordHash,
          role: du.role,
        },
      })
      userByRole[du.role] = u
      await attachUserRole(tx, u.id, du.role)
    }

    await seedAdmissionCatalog(tx)

    const prog = await tx.admissionProgram.findFirst({
      where: { slug: 'bs-software-engineering' },
    })
    const demoStudent = userByRole['STUDENT']
    if (prog && demoStudent) {
      const login = '1001000007'
      await tx.user.update({
        where: { id: demoStudent.id },
        data: {
          studentLoginNumber: login,
          studentPasswordConfigured: true,
        },
      })
      await tx.studentDegreeEnrollment.upsert({
        where: { userId: demoStudent.id },
        create: { userId: demoStudent.id, admissionProgramId: prog.id },
        update: { admissionProgramId: prog.id },
      })
      await tx.programCourseUnit.createMany({
        data: [
          { admissionProgramId: prog.id, unitCode: 'CS111', title: 'Programming Foundations', creditHours: 4 },
          { admissionProgramId: prog.id, unitCode: 'MA101', title: 'Engineering Calculus', creditHours: 3 },
        ],
      })
      const units = await tx.programCourseUnit.findMany({
        where: { admissionProgramId: prog.id, unitCode: { in: ['CS111', 'MA101'] } },
      })
      const year = new Date().getFullYear()
      const byCode = Object.fromEntries(units.map((u) => [u.unitCode, u]))
      if (byCode.CS111) {
        await tx.studentUnitResult.create({
          data: {
            userId: demoStudent.id,
            programCourseUnitId: byCode.CS111.id,
            academicYear: year,
            semesterNumber: 1,
            scorePercent: 72,
          },
        })
      }
      if (byCode.MA101) {
        await tx.studentUnitResult.create({
          data: {
            userId: demoStudent.id,
            programCourseUnitId: byCode.MA101.id,
            academicYear: year,
            semesterNumber: 1,
            scorePercent: 85,
          },
        })
      }
      await tx.tuitionAssessment.create({
        data: {
          userId: demoStudent.id,
          label: 'Tuition — Year 1 / Semester 1',
          amountMinor: 500000,
          currency: 'SSP',
          academicYear: year,
          semesterNumber: 1,
          status: 'OUTSTANDING',
        },
      })
    }
  })

  // eslint-disable-next-line no-console
  console.log(
    [
      'Seed OK · RBAC seeded with roles & permissions.',
      '',
      ...DEMO_USERS.map((u) => `  ${u.role.padEnd(20)} ${u.email} / ${u.password}`),
    ].join('\n'),
  )
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
