'use client'

/** Primary CTA pointing at the institutional Moodle; URL from env never logged. */
export default function MoodleHubCallout({
  headline = 'Learning, quizzes & course resources',
  body = 'All teaching delivery is handled in Moodle. Use your SSO or Moodle credentials supplied by ICT.',
}) {
  const url = typeof process.env.NEXT_PUBLIC_MOODLE_URL === 'string' ? process.env.NEXT_PUBLIC_MOODLE_URL.trim() : ''

  return (
    <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-emerald-900">{headline}</h2>
      <p className="mt-2 text-sm leading-relaxed text-emerald-900/80">{body}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Open Moodle LMS
          </a>
        ) : (
          <p className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            Set <code className="font-mono">NEXT_PUBLIC_MOODLE_URL</code> in <code className="font-mono">.env</code> to enable the button for your tenant.
          </p>
        )}
      </div>
    </section>
  )
}
