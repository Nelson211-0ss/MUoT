'use client'

/** Primary CTA pointing at the institutional Moodle; URL from env never logged. */
export default function MoodleHubCallout({
  headline = 'Learning, quizzes & course resources',
  body = 'All teaching delivery is handled in Moodle. Use your SSO or Moodle credentials supplied by ICT.',
}) {
  const url = typeof process.env.NEXT_PUBLIC_MOODLE_URL === 'string' ? process.env.NEXT_PUBLIC_MOODLE_URL.trim() : ''

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-primary">{headline}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white hover:opacity-90"
          >
            Open MUT E-Learning
          </a>
        ) : (
          <p className="rounded-xl border border-secondary/50 bg-secondary/10 px-3 py-2 text-xs font-semibold text-primary">
            Set <code className="font-mono">NEXT_PUBLIC_MOODLE_URL</code> in <code className="font-mono">.env</code> to enable the button for your tenant.
          </p>
        )}
      </div>
    </section>
  )
}
