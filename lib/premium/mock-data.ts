/** UI-only mock analytics — no backend */

export const monthlyTrend = [
  { month: 'Jan', value: 420, applications: 180 },
  { month: 'Feb', value: 510, applications: 210 },
  { month: 'Mar', value: 480, applications: 195 },
  { month: 'Apr', value: 620, applications: 260 },
  { month: 'May', value: 710, applications: 310 },
  { month: 'Jun', value: 680, applications: 290 },
  { month: 'Jul', value: 820, applications: 340 },
]

export const pipelineStages = [
  { stage: 'Submitted', count: 248 },
  { stage: 'Review', count: 112 },
  { stage: 'Interview', count: 64 },
  { stage: 'Approved', count: 89 },
  { stage: 'Enrolled', count: 156 },
]

export const deptDistribution = [
  { name: 'Engineering', value: 38 },
  { name: 'Computing', value: 28 },
  { name: 'Business', value: 18 },
  { name: 'Health', value: 16 },
]

export const activityFeed = [
  { id: '1', title: 'Application #A-2041 submitted', time: '2m ago', tone: 'info' as const },
  { id: '2', title: 'Finance verified SSP 150,000 levy', time: '14m ago', tone: 'success' as const },
  { id: '3', title: 'Registrar issued student ID 2400182937', time: '1h ago', tone: 'success' as const },
  { id: '4', title: 'API latency spike on auth cluster', time: '2h ago', tone: 'warning' as const },
  { id: '5', title: 'HOD published semester marks — CS301', time: '3h ago', tone: 'info' as const },
]

export const applicantsTable = [
  { id: 'A-2041', name: 'Akuol Deng', program: 'Software Engineering', status: 'Under review', score: 87 },
  { id: 'A-2038', name: 'Nelson Ochan', program: 'Cybersecurity', status: 'Submitted', score: 91 },
  { id: 'A-2035', name: 'Mary Kuol', program: 'Data Science', status: 'Interview', score: 84 },
  { id: 'A-2030', name: 'Peter Majak', program: 'Networking', status: 'Approved', score: 88 },
]

export const studentCourses = [
  { code: 'CS301', title: 'Distributed Systems', credits: 3, progress: 72 },
  { code: 'CS305', title: 'Cloud Architecture', credits: 3, progress: 58 },
  { code: 'MA210', title: 'Discrete Mathematics', credits: 4, progress: 91 },
]

export const lecturerClasses = [
  { course: 'CS301', students: 42, pending: 12, slot: '09:00 — Lab 2' },
  { course: 'CS305', students: 38, pending: 8, slot: '14:00 — Room B12' },
]
