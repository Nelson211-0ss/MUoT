'use client'

import { useMemo, useState } from 'react'

async function refreshApplication() {
  const res = await fetch('/api/admissions/me/application')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Unable to load application')
  return data
}

async function patchApplication(payload) {
  const res = await fetch('/api/admissions/me/application', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Unable to save')
  return data
}

export default function AdmissionApplicationWizard({ catalog, snapshot }) {
  const steps = ['Personal', 'Academic', 'Program', 'Documents', 'Review']
  const [step, setStep] = useState(0)
  const [data, setData] = useState(snapshot)
  const [status, setStatus] = useState(null)
  const [pendingSave, setPendingSave] = useState(false)

  const applicantMode = data.applicantMode
  const draft = data.application

  const facultyPrograms = catalog?.faculties ?? []

  const programOptions = useMemo(() => {
    const fid = draft?.admissionFacultyId ?? ''
    if (!fid) return []
    const f = facultyPrograms.find((x) => x.id === fid)
    return f?.programs ?? []
  }, [draft?.admissionFacultyId, facultyPrograms])

  const canEdit = applicantMode === 'edit' && (draft?.status === 'DRAFT' || draft?.status === 'AWAITING_DOCUMENTS')

  async function persistAndRefresh(partial, advance) {
    setStatus(null)
    setPendingSave(true)
    try {
      await patchApplication(partial)
      const next = await refreshApplication()
      setData(next)
      if (advance && step < steps.length - 1) setStep((s) => s + 1)
    } catch (e) {
      setStatus({ kind: 'error', msg: String(e.message ?? '') })
    } finally {
      setPendingSave(false)
    }
  }

  async function reopenCycle() {
    setPendingSave(true)
    setStatus(null)
    try {
      const res = await fetch('/api/admissions/me/application/reopen', { method: 'POST' })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Cannot restart application')
      window.location.reload()
    } catch (e) {
      setStatus({ kind: 'error', msg: String(e.message ?? '') })
    } finally {
      setPendingSave(false)
    }
  }

  async function submitApplication() {
    setPendingSave(true)
    setStatus(null)
    try {
      const res = await fetch('/api/admissions/me/application/submit', { method: 'POST' })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Unable to submit')
      window.location.reload()
    } catch (e) {
      setStatus({ kind: 'error', msg: String(e.message ?? '') })
    } finally {
      setPendingSave(false)
    }
  }

  return (
    <div className="space-y-6">
          {applicantMode === 'reapply' ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-400/40 dark:bg-amber-500/15 p-4 text-sm font-medium text-primary dark:text-secondary">
              <p>
                Your last decision was <span className="font-bold">{draft?.status}</span>. Start a fresh intake window to
                reapply.
              </p>
              <button
                type="button"
                onClick={() => reopenCycle()}
                disabled={pendingSave}
                className="mt-3 rounded-lg bg-secondary text-primary px-4 py-2 text-xs font-bold hover:brightness-95"
              >
                Start new application
              </button>
            </div>
          ) : null}

          {applicantMode !== 'reapply' ? (
            <>
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {steps.map((label, i) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setStep(i)}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${
                        i === step
                          ? 'bg-primary text-white border-primary dark:bg-secondary dark:text-primary'
                          : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-400'
                      }`}
                    >
                      {i + 1}. {label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] uppercase font-bold tracking-widest text-primary dark:text-secondary">
                  Status · {draft?.status ?? '—'}
                </p>
              </div>

              {status?.kind === 'error' ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/60 dark:bg-red-500/15 dark:text-red-100">
                  {status.msg}
                </div>
              ) : null}

              {!canEdit ? (
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  This dossier is now managed by Admissions. Follow messages in Notifications for any additional uploads.
                </p>
              ) : null}

              {canEdit && step === 0 ? (
                <PersonalStep
                  draft={draft}
                  pendingSave={pendingSave}
                  onNext={(payload) => persistAndRefresh(payload, true)}
                />
              ) : null}
              {canEdit && step === 1 ? (
                <AcademicStep
                  draft={draft}
                  pendingSave={pendingSave}
                  onPrev={() => setStep(0)}
                  onContinue={(payload) => persistAndRefresh(payload, true)}
                />
              ) : null}
              {canEdit && step === 2 ? (
                <ProgramStep
                  draft={draft}
                  facultyPrograms={facultyPrograms}
                  intakes={catalog?.intakes ?? []}
                  programOptions={programOptions}
                  pendingSave={pendingSave}
                  onPrev={() => setStep(1)}
                  persistApp={(payload) => persistAndRefresh(payload, true)}
                />
              ) : null}
              {canEdit && step === 3 ? (
                <DocsStep draft={draft} pendingSave={pendingSave} onPrev={() => setStep(2)} />
              ) : null}
              {canEdit && step === 4 ? (
                <ReviewStep
                  pendingSave={pendingSave}
                  draft={draft}
                  onPrev={() => setStep(3)}
                  onSubmit={submitApplication}
                />
              ) : null}
            </>
          ) : null}
    </div>
  )
}

function PersonalStep({ draft, onNext, pendingSave }) {
  return (
    <form
      className="grid gap-4 md:grid-cols-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault()
        const fd = /** @type {HTMLFormElement} */ (e.currentTarget)
        onNext({
          fullName: fd.fullName.value,
          gender: fd.gender.value,
          dateOfBirth: fd.dateOfBirth.value || undefined,
          nationality: fd.nationality.value,
          address: fd.address.value,
          phone: fd.phone.value,
        })
      }}
    >
      <div className="md:col-span-2">
        <h2 className="text-lg font-bold text-primary dark:text-secondary">Personal information</h2>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Passport uploads happen in Documents.</p>
      </div>
      <label className="text-sm font-semibold md:col-span-2 grid gap-1">
        Full name
        <input
          required
          name="fullName"
          defaultValue={draft?.fullName ?? ''}
          className="border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-950"
        />
      </label>
      <label className="text-sm font-semibold grid gap-1">
        Gender
        <select
          required
          name="gender"
          defaultValue={draft?.gender ?? ''}
          className="border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-950"
        >
          <option value="">Choose</option>
          <option>Female</option>
          <option>Male</option>
          <option>Non-binary</option>
          <option>Prefer not to say</option>
        </select>
      </label>
      <label className="text-sm font-semibold grid gap-1">
        Date of birth
        <input
          type="date"
          name="dateOfBirth"
          defaultValue={draft?.dateOfBirth ? String(draft.dateOfBirth).slice(0, 10) : ''}
          required
          className="border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-950"
        />
      </label>
      <label className="text-sm font-semibold grid gap-1">
        Nationality
        <input
          required
          name="nationality"
          defaultValue={draft?.nationality ?? ''}
          className="border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-950"
        />
      </label>
      <label className="text-sm font-semibold grid gap-1">
        Phone number
        <input
          required
          type="tel"
          name="phone"
          defaultValue={draft?.phone ?? ''}
          className="border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-950"
        />
      </label>
      <label className="text-sm font-semibold md:col-span-2 grid gap-1">
        Postal address / City
        <textarea
          required
          rows={3}
          name="address"
          defaultValue={draft?.address ?? ''}
          className="border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm resize-none bg-white dark:bg-slate-950"
        />
      </label>
      <div className="md:col-span-2 flex gap-3 justify-end">
        <button
          disabled={pendingSave}
          type="submit"
          className="rounded-lg bg-primary text-white px-5 py-2 text-sm font-bold hover:opacity-90 dark:bg-secondary dark:text-primary"
        >
          Save & Continue
        </button>
      </div>
    </form>
  )
}

function AcademicStep({ draft, onPrev, pendingSave, onContinue }) {
  return (
    <form
      className="grid md:grid-cols-2 gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault()
        const fd = e.currentTarget
        onContinue({
          previousSchool: fd.previousSchool.value,
          academicQualifications: fd.academicQualifications.value,
          nationalExamResults: fd.nationalExamResults.value,
          graduationYear: fd.graduationYear.value ? Number(fd.graduationYear.value) : null,
        })
      }}
    >
      <div className="md:col-span-2 flex items-start justify-between">
        <h2 className="text-lg font-bold text-primary dark:text-secondary">Academic background</h2>
        <button type="button" onClick={() => onPrev()} className="text-xs font-semibold text-blue-700 dark:text-secondary">
          Back
        </button>
      </div>
      <label className="md:col-span-2 grid gap-1 text-sm font-semibold">
        Previous school / institution
        <input
          name="previousSchool"
          defaultValue={draft?.previousSchool ?? ''}
          required
          className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 text-sm bg-white dark:bg-slate-950"
        />
      </label>
      <label className="md:col-span-2 grid gap-1 text-sm font-semibold">
        Qualifications narrative
        <textarea
          name="academicQualifications"
          rows={5}
          required
          defaultValue={draft?.academicQualifications ?? ''}
          placeholder="Subjects, distinctions, honours"
          className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 text-sm resize-none bg-white dark:bg-slate-950"
        />
      </label>
      <label className="md:col-span-2 grid gap-1 text-sm font-semibold">
        National exams / aptitude
        <textarea
          name="nationalExamResults"
          rows={3}
          required
          defaultValue={draft?.nationalExamResults ?? ''}
          className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 text-sm resize-none bg-white dark:bg-slate-950"
        />
      </label>
      <label className="text-sm font-semibold grid gap-1">
        Graduation year
        <input
          type="number"
          name="graduationYear"
          required
          min={1970}
          max={2060}
          defaultValue={draft?.graduationYear ?? ''}
          className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 text-sm bg-white dark:bg-slate-950"
        />
      </label>
      <div className="md:col-span-2 flex justify-end gap-3">
        <button type="button" onClick={() => onPrev()} className="rounded-lg border px-4 py-2 text-sm font-semibold">
          Back
        </button>
        <button
          disabled={pendingSave}
          className="rounded-lg bg-primary text-white px-5 py-2 text-sm font-bold dark:bg-secondary dark:text-primary"
          type="submit"
        >
          Save & Continue
        </button>
      </div>
    </form>
  )
}

function ProgramStep({ draft, facultyPrograms, intakes, programOptions, onPrev, persistApp, pendingSave }) {
  const [facultyId, setFacultyId] = useState(draft?.admissionFacultyId ?? '')
  const [programId, setProgramId] = useState(draft?.programId ?? '')

  return (
    <form
      className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        const fd = e.currentTarget
        persistApp({
          admissionFacultyId: fd.faculty.value || null,
          programId: fd.program.value || null,
          intakeId: fd.intake.value || null,
          studyMode: fd.studyMode.value || null,
        })
      }}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-bold text-primary dark:text-secondary">Program selection</h2>
        <button type="button" className="text-xs font-semibold text-blue-700 dark:text-secondary" onClick={onPrev}>
          Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <label className="grid gap-1 text-sm font-semibold">
          School / faculty
          <select
            required
            name="faculty"
            value={facultyId}
            onChange={(e) => {
              const v = e.target.value
              setFacultyId(v)
              setProgramId('')
            }}
            className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 bg-white dark:bg-slate-950"
          >
            <option value="">Select</option>
            {facultyPrograms.map((fac) => (
              <option key={fac.id} value={fac.id}>
                {fac.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Preferred program
          <select
            required
            name="program"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 bg-white dark:bg-slate-950"
          >
            <option value="">Select program</option>
            {programOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Intake
          <select
            required
            name="intake"
            defaultValue={draft?.intakeId ?? ''}
            className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 bg-white dark:bg-slate-950"
          >
            <option value="">Select cohort</option>
            {intakes.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label} ({i.year})
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Study mode
          <select
            required
            name="studyMode"
            defaultValue={draft?.studyMode ?? ''}
            className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 bg-white dark:bg-slate-950"
          >
            <option value="">Pick modality</option>
            <option value="FULL_TIME">Full-time · on-campus</option>
            <option value="PART_TIME">Part-time · evening</option>
            <option value="ONLINE">Online / blended</option>
          </select>
        </label>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={() => onPrev()} className="rounded-lg border px-4 py-2 text-sm font-semibold">
          Back
        </button>
        <button disabled={pendingSave} className="rounded-lg bg-secondary text-primary px-5 py-2 text-sm font-bold" type="submit">
          Continue
        </button>
      </div>
    </form>
  )
}

function DocsStep({ draft, pendingSave, onPrev }) {
  async function upload(form) {
    const fd = new FormData(form)
    const res = await fetch('/api/admissions/me/documents', {
      method: 'POST',
      body: fd,
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.error || 'Upload failed')
      return
    }
    form.reset()
    window.location.reload()
  }

  return (
    <section className="space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-primary dark:text-secondary">Document uploads</h2>
          <p className="text-xs text-gray-500 mt-2">PDF/JPG/PNG · max ~5 MB · stored under encrypted disk paths.</p>
        </div>
        <button type="button" onClick={onPrev} className="text-xs font-semibold text-blue-700 dark:text-secondary">
          Back
        </button>
      </div>

      <ul className="text-xs space-y-2">
        {(draft?.documents ?? []).map((doc) => (
          <li key={doc.id} className="flex justify-between rounded-lg border px-3 py-2 bg-slate-50 dark:bg-slate-800/70 dark:border-white/10">
            <span className="font-semibold text-primary">{doc.docType}</span>
            <a className="text-blue-600 dark:text-secondary hover:underline" href={`/api/admissions/me/documents/${doc.id}/file`} target="_blank" rel="noreferrer">
              Preview
            </a>
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          upload(/** @type {HTMLFormElement} */ (e.currentTarget))
        }}
        className="grid gap-4 border-t border-gray-50 dark:border-white/10 pt-4"
      >
        <label className="text-sm font-semibold grid gap-2">
          Document type
          <select required name="docType" className="rounded-lg border px-3 py-2 bg-white dark:bg-slate-950 dark:border-white/10">
            <option value="">Select</option>
            <option value="TRANSCRIPT">Academic transcripts</option>
            <option value="IDENTITY">National ID / passport</option>
            <option value="RECOMMENDATION">Recommendation</option>
            <option value="CERTIFICATE">Certificates</option>
            <option value="PASSPORT_PHOTO">Passport photo</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label className="text-sm font-semibold grid gap-2">
          Cover note / title (optional)
          <input name="title" className="rounded-lg border px-3 py-2 bg-white dark:bg-slate-950 dark:border-white/10" />
        </label>
        <label className="text-sm font-semibold grid gap-2">
          File
          <input required name="file" type="file" accept=".pdf,.png,.jpg,.jpeg" />
        </label>
        <div className="flex justify-between">
          <button type="button" onClick={onPrev} className="rounded-lg border px-4 py-2 text-sm font-semibold">
            Back
          </button>
          <button
            disabled={pendingSave}
            className="rounded-lg bg-primary text-white px-5 py-2 text-sm font-bold dark:bg-secondary dark:text-primary"
            type="submit"
          >
            Upload
          </button>
        </div>
      </form>
    </section>
  )
}

function ReviewStep({ draft, pendingSave, onPrev, onSubmit }) {
  return (
    <section className="space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-lg font-bold text-primary dark:text-secondary">Review & certify</h2>
          <p className="text-xs text-gray-500 mt-1">By submitting you affirm that your declarations are truthful.</p>
        </div>
        <button type="button" onClick={onPrev} className="text-xs font-semibold text-blue-700 dark:text-secondary">
          Back
        </button>
      </div>
      <dl className="grid sm:grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[11px] font-bold uppercase text-gray-400">Applicant</dt>
          <dd className="font-semibold text-primary">{draft?.fullName ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase text-gray-400">Programme</dt>
          <dd className="font-semibold text-primary">{draft?.program?.name ?? '—'}</dd>
        </div>
      </dl>
      <button
        type="button"
        disabled={pendingSave}
        className="w-full rounded-lg bg-secondary text-primary py-3 text-sm font-bold hover:brightness-95"
        onClick={onSubmit}
      >
        Submit to Admissions
      </button>
    </section>
  )
}
