import { CheckCircle2 } from 'lucide-react'

/** @param {{ steps: { title: string; description: string }[] }} props */
export default function AdmissionsProcessSteps({ steps }) {
  return (
    <ol className="space-y-5">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" strokeWidth={2} aria-hidden />
              <div>
                <h3 className="font-bold text-primary">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
