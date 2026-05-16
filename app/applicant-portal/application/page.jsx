'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import AdmissionApplicationWizard from '@/components/admissions/ApplicationWizard'

export default function ApplicantApplicationPage() {
  const router = useRouter()
  const [catalog, setCatalog] = useState(null)
  const [snapshot, setSnapshot] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let canceled = false
    ;(async () => {
      try {
        const [cRes, meRes] = await Promise.all([
          fetch('/api/admissions/catalog'),
          fetch('/api/admissions/me/application'),
        ])
        const cData = await cRes.json().catch(() => ({}))
        const meData = await meRes.json().catch(() => ({}))

        if (!meRes.ok) {
          if (!canceled && meRes.status === 401) {
            router.replace(`/login?intent=applicant&next=${encodeURIComponent('/applicant-portal/application')}`)
            return
          }
          throw new Error(meData.error ?? 'Unauthorized')
        }
        if (!canceled) {
          setCatalog({
            faculties: cData.faculties ?? [],
            intakes: cData.intakes ?? [],
          })
          setSnapshot(meData)
        }
      } catch (e) {
        if (!canceled) setError(String(e.message ?? e))
      }
    })()
    return () => {
      canceled = true
    }
  }, [router])

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Unable to reach applicant services: <span className="font-semibold">{error}</span>
      </p>
    )
  }

  if (!snapshot || catalog === null) {
    return <p className="text-sm text-gray-600">Loading your dossier…</p>
  }

  return <AdmissionApplicationWizard catalog={catalog} snapshot={snapshot} />
}
