/**
 * Transactional outbound mail — optional RESEND_API_KEY + MAIL_FROM in production.
 * Without configuration, logs a clear dev message so local UX still works via in-app notifications.
 */

/** @param {string} html */
function htmlToText(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * @param {{ to: string; subject: string; text?: string; html?: string }} opts
 * @returns {Promise<{ ok: boolean; skipped?: boolean; providerError?: string }>}
 */
export async function sendTransactionalMail({ to, subject, text, html }) {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.MAIL_FROM?.trim()

  const bodyText = text ?? (html ? htmlToText(html) : '')
  if (!bodyText) {
    return { ok: false, providerError: 'No mail body supplied.' }
  }

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[mail:skipped:no-resend] To: ${to}\nSubject: ${subject}\n---\n${bodyText}`)
    }
    return { skipped: true, ok: false }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: bodyText,
        ...(html ? { html } : {}),
      }),
    })
    const data = /** @type {Record<string, unknown>} */ (await res.json().catch(() => ({})))
    if (!res.ok) {
      const msg = typeof data.message === 'string' ? data.message : JSON.stringify(data)
      console.error('[mail:resend]', res.status, msg)
      return { ok: false, providerError: msg }
    }
    return { ok: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Mail send threw'
    console.error('[mail:resend]', message)
    return { ok: false, providerError: message }
  }
}
