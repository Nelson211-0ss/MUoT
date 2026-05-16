'use client'

import * as React from 'react'
import {
  Activity,
  BookOpen,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  GraduationCap,
  Server,
  Shield,
  TrendingUp,
  Upload,
  Users,
  Wallet,
} from 'lucide-react'
import { PageHeader, QuickActions } from '@/components/premium/dashboards/page-header'
import { StatCard } from '@/components/premium/widgets/stat-card'
import { ChartCard, DeptPieChart, PipelineBarChart, TrendAreaChart } from '@/components/premium/widgets/charts'
import { ActivityFeed } from '@/components/premium/widgets/activity-feed'
import { DataTable, StatusBadge } from '@/components/premium/widgets/data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/premium/widgets/progress'
import {
  activityFeed,
  applicantsTable,
  deptDistribution,
  lecturerClasses,
  monthlyTrend,
  pipelineStages,
  studentCourses,
} from '@/lib/premium/mock-data'

function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>
}

function ChartGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 lg:grid-cols-2">{children}</div>
}


export function SuperAdminView() {
  return (
  <div className="space-y-8">
      <PageHeader
        title="Global university overview"
        description="System-wide analytics, security posture, and platform health for Magwi University of Technology."
        actions={<QuickActions />}
      />
      <StatGrid>
        <StatCard label="Total students" value="4,218" delta="+12.4% YoY" trend="up" icon={GraduationCap} />
        <StatCard label="Total lecturers" value="186" delta="+3 this month" trend="up" icon={Users} />
        <StatCard label="Applications" value="1,024" delta="248 pending review" trend="neutral" icon={FileText} />
        <StatCard label="System uptime" value="99.97%" delta="Last incident 14d ago" trend="up" icon={Activity} />
      </StatGrid>
      <ChartGrid>
        <ChartCard title="Platform activity" description="Active sessions & admissions volume">
          <TrendAreaChart data={monthlyTrend} />
        </ChartCard>
        <ChartCard title="Admissions pipeline" description="Current cycle distribution">
          <PipelineBarChart data={pipelineStages} />
        </ChartCard>
      </ChartGrid>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTable
            title="Security & audit preview"
            columns={[
              { key: 'id', header: 'Event' },
              { key: 'name', header: 'Actor' },
              { key: 'status', header: 'Severity', render: (r) => <StatusBadge status={String(r.status)} /> },
            ]}
            rows={applicantsTable.map((r) => ({ ...r, status: 'Info' }))}
            actionLabel="Inspect"
          />
        </div>
        <ActivityFeed items={activityFeed} title="Global activity" />
      </div>
    </div>
  )
}

export function SystemAdminView() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Infrastructure command"
        description="User management, access control, API monitoring, and operational tickets."
        actions={<QuickActions />}
      />
      <StatGrid>
        <StatCard label="Active users" value="892" delta="142 online now" trend="up" icon={Users} />
        <StatCard label="API latency" value="42ms" delta="p95 within SLO" trend="up" icon={Activity} />
        <StatCard label="Open tickets" value="17" delta="5 high priority" trend="down" icon={FileText} />
        <StatCard label="Nodes healthy" value="12/12" delta="All regions green" trend="up" icon={Server} />
      </StatGrid>
      <div className="grid gap-4 md:grid-cols-3">
        {['Auth cluster', 'Portal API', 'Storage'].map((name, i) => (
          <Card key={name} className="glass-panel">
            <CardHeader>
              <CardTitle className="text-sm">{name}</CardTitle>
              <CardDescription>CPU {32 + i * 8}% · Memory {48 + i * 5}%</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={72 + i * 6} />
              <Badge variant="success" className="mt-3">
                Operational
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <ActivityFeed items={activityFeed} title="System logs stream" />
    </div>
  )
}

export function AdmissionsOfficerView() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Admissions HQ"
        description="Applicant pipeline, review queues, intake analytics, and interview scheduling."
        actions={<QuickActions />}
      />
      <StatGrid>
        <StatCard label="Pending applications" value="248" delta="+18 this week" trend="up" icon={Clock} />
        <StatCard label="Approved" value="89" delta="Provisional offers" trend="up" icon={CheckCircle2} />
        <StatCard label="Rejected" value="34" delta="Cycle 2026" trend="neutral" icon={FileText} />
        <StatCard label="Enrollment forecast" value="+14%" delta="vs last intake" trend="up" icon={TrendingUp} />
      </StatGrid>
      <ChartGrid>
        <ChartCard title="Admissions trends" description="Monthly application volume">
          <TrendAreaChart data={monthlyTrend} dataKey="applications" />
        </ChartCard>
        <ChartCard title="By department" description="Application distribution">
          <DeptPieChart data={deptDistribution} />
        </ChartCard>
      </ChartGrid>
      <DataTable
        title="Application review queue"
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Applicant' },
          { key: 'program', header: 'Program' },
          { key: 'status', header: 'Status', render: (r) => <StatusBadge status={String(r.status)} /> },
          { key: 'score', header: 'Score' },
        ]}
        rows={applicantsTable}
        actionLabel="Review"
      />
    </div>
  )
}

export function ApplicantView() {
  const steps = ['Profile', 'Program', 'Documents', 'Submit', 'Decision']
  const current = 3
  return (
    <div className="space-y-8">
      <PageHeader
        title="Your application"
        description="Track progress, upload documents, and monitor admission status — UI preview for applicant@mut.edu & nelsonochan99@gmail.com."
      />
      <Card className="overflow-hidden border-indigo-200/60 bg-gradient-to-br from-indigo-50 via-white to-slate-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-950">
        <CardContent className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Onboarding</p>
          <h2 className="mt-2 text-xl font-semibold">Software Engineering · September 2026</h2>
          <Progress value={68} className="mt-6" />
          <div className="mt-6 flex flex-wrap justify-between gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                    i < current
                      ? 'bg-indigo-600 text-white'
                      : i === current
                        ? 'ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-900'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800'
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Upload credentials and supporting files</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {['Transcript', 'National ID', 'Passport photo'].map((doc) => (
              <div
                key={doc}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 p-6 text-center dark:border-slate-700 dark:bg-slate-800/50"
              >
                <Upload className="h-8 w-8 text-indigo-500" />
                <p className="mt-2 text-sm font-medium">{doc}</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Upload
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <ActivityFeed
          items={[
            { id: '1', title: 'Application draft saved', time: 'Today', tone: 'info' },
            { id: '2', title: 'Transcript uploaded', time: 'Yesterday', tone: 'success' },
            { id: '3', title: 'Interview slot available', time: 'Mon 10:00', tone: 'warning' },
          ]}
          title="Timeline"
        />
      </div>
    </div>
  )
}

export function StudentView() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Academic dashboard"
        description="GPA analytics, courses, assignments, fees, and Moodle quick access — demo@mut.edu preview."
        actions={
          <Button variant="navy" size="sm">
            Open Moodle
          </Button>
        }
      />
      <StatGrid>
        <StatCard label="Current GPA" value="3.72" delta="+0.08 this semester" trend="up" icon={TrendingUp} />
        <StatCard label="Attendance" value="94%" delta="Above faculty average" trend="up" icon={CheckCircle2} />
        <StatCard label="Assignments due" value="4" delta="2 this week" trend="neutral" icon={Clock} />
        <StatCard label="Fee balance" value="SSP 0" delta="Cleared for term" trend="up" icon={Wallet} />
      </StatGrid>
      <ChartGrid>
        <ChartCard title="Performance trend" description="Semester progress">
          <TrendAreaChart data={monthlyTrend} />
        </ChartCard>
        <Card>
          <CardHeader>
            <CardTitle>Registered courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentCourses.map((c) => (
              <div key={c.code} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <div className="flex justify-between text-sm font-medium">
                  <span>
                    {c.code} · {c.title}
                  </span>
                  <span className="text-slate-500">{c.credits} cr</span>
                </div>
                <Progress value={c.progress} className="mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </ChartGrid>
    </div>
  )
}

export function DepartmentAdminView() {
  return (
    <div className="space-y-8">
      <PageHeader title="Department operations" description="Lecturer management, course allocation, and attendance monitoring." actions={<QuickActions />} />
      <StatGrid>
        <StatCard label="Department students" value="612" icon={Users} />
        <StatCard label="Lecturers" value="24" icon={BookOpen} />
        <StatCard label="Courses active" value="38" icon={GraduationCap} />
        <StatCard label="Avg. attendance" value="91%" trend="up" delta="+2%" icon={Activity} />
      </StatGrid>
      <ChartCard title="Student distribution" description="By programme strand">
        <DeptPieChart data={deptDistribution} />
      </ChartCard>
    </div>
  )
}

export function FinanceOfficerView() {
  return (
    <div className="space-y-8">
      <PageHeader title="Financial overview" description="Tuition analytics, outstanding balances, and scholarship management." actions={<QuickActions />} />
      <StatGrid>
        <StatCard label="Total revenue" value="SSP 42.8M" delta="+8.2% MoM" trend="up" icon={Wallet} />
        <StatCard label="Pending payments" value="SSP 1.2M" delta="186 students" trend="down" icon={Clock} />
        <StatCard label="Cleared students" value="3,891" trend="up" icon={CheckCircle2} />
        <StatCard label="Scholarships" value="124" icon={GraduationCap} />
      </StatGrid>
      <ChartGrid>
        <ChartCard title="Monthly collections" description="Tuition & acceptance levies">
          <TrendAreaChart data={monthlyTrend} />
        </ChartCard>
        <Card>
          <CardHeader>
            <CardTitle>Invoice queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {['INV-2401 · SSP 150,000', 'INV-2398 · SSP 320,000', 'INV-2390 · SSP 85,000'].map((row) => (
              <div key={row} className="flex justify-between rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">
                <span>{row}</span>
                <Badge variant="warning">Pending</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </ChartGrid>
    </div>
  )
}

export function HodView() {
  return (
    <div className="space-y-8">
      <PageHeader title="Department performance" description="Lecturer activity, course analytics, and student outcomes." actions={<QuickActions />} />
      <StatGrid>
        <StatCard label="Department GPA" value="3.41" icon={TrendingUp} />
        <StatCard label="Lecturer workload" value="18.2h" delta="avg / week" icon={Users} />
        <StatCard label="Pass rate" value="87%" trend="up" icon={CheckCircle2} />
        <StatCard label="Course completion" value="76%" icon={BookOpen} />
      </StatGrid>
      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>
        <TabsContent value="performance">
          <ChartCard title="Pass / fail analytics" description="Current semester">
            <PipelineBarChart data={pipelineStages} />
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function LecturerView() {
  return (
    <div className="space-y-8">
      <PageHeader title="Teaching dashboard" description="Classes today, grading queue, and course materials." actions={<QuickActions />} />
      <StatGrid>
        <StatCard label="Classes today" value="2" icon={BookOpen} />
        <StatCard label="Pending grading" value="20" icon={FileText} />
        <StatCard label="Attendance avg" value="92%" icon={Users} />
        <StatCard label="Course progress" value="68%" icon={Activity} />
      </StatGrid>
      <div className="grid gap-4 md:grid-cols-2">
        {lecturerClasses.map((c) => (
          <Card key={c.course}>
            <CardHeader>
              <CardTitle>{c.course}</CardTitle>
              <CardDescription>{c.slot}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between text-sm">
              <span>{c.students} students</span>
              <Badge variant="warning">{c.pending} to grade</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function RegistrarView() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Academic records"
        description="Admissions desk, student roster, examination analytics, and graduation eligibility — registrar@mut.edu."
        actions={
          <>
            <Button variant="outline" size="sm">
              Record application
            </Button>
            <Button size="sm">Admit applicant</Button>
          </>
        }
      />
      <StatGrid>
        <StatCard label="Pending approvals" value="42" icon={Clock} />
        <StatCard label="Graduation candidates" value="128" icon={GraduationCap} />
        <StatCard label="Transcripts issued" value="56" delta="This month" icon={FileText} />
        <StatCard label="Active applications" value="248" icon={Users} />
      </StatGrid>
      <DataTable
        title="Applications to review"
        columns={[
          { key: 'id', header: 'Ref' },
          { key: 'name', header: 'Name' },
          { key: 'program', header: 'Program' },
          { key: 'status', header: 'Status', render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        rows={applicantsTable}
        actionLabel="Admit"
      />
    </div>
  )
}
