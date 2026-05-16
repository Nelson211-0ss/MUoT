'use client'

import { useCallback, useEffect, useState } from 'react'

/** @typedef {{ id: string, code: string, name: string }} ProgramLite */

/** @param {{ programs: ProgramLite[] }} props */
export default function HodWorkspaceClient({ programs }) {
  const firstId = programs[0]?.id ?? ''
  const [programId, setProgramId] = useState(firstId)
  const [units, setUnits] = useState([])
  const [loadingUnits, setLoadingUnits] = useState(false)

  const [unitCode, setUnitCode] = useState('')
  const [unitTitle, setUnitTitle] = useState('')
  const [creditHours, setCreditHours] = useState('3')

  const [studentNumber, setStudentNumber] = useState('')
  const [gradeUnitId, setGradeUnitId] = useState('')
  const [academicYear, setAcademicYear] = useState(String(new Date().getFullYear()))
  const [semesterNumber, setSemesterNumber] = useState('1')
  const [scorePercent, setScorePercent] = useState('')

  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  const loadUnits = useCallback(async () => {
    if (!programId) {
      setUnits([])
      return
    }
    setLoadingUnits(true)
    try {
      const res = await fetch(`/api/hod/units?admissionProgramId=${encodeURIComponent(programId)}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg({ tone: 'err', text: data.error ?? 'Cannot load units.' })
        setUnits([])
        return
      }
      setUnits(data.units ?? [])
      if (data.units?.length) setGradeUnitId((id) => id || data.units[0].id)
    } catch {
      setMsg({ tone: 'err', text: 'Network error loading units.' })
    } finally {
      setLoadingUnits(false)
    }
  }, [programId])

  useEffect(() => {
    void loadUnits()
  }, [loadUnits])

  async function submitUnit(ev) {
    ev.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      const res = await fetch('/api/hod/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admissionProgramId: programId,
          unitCode,
          title: unitTitle,
          creditHours: Number.parseInt(String(creditHours), 10) || 3,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg({ tone: 'err', text: data.error ?? 'Could not save unit.' })
        return
      }
      setUnitCode('')
      setUnitTitle('')
      setCreditHours('3')
      await loadUnits()
      setGradeUnitId(data.unit?.id ?? gradeUnitId)
      setMsg({ tone: 'ok', text: 'Course unit recorded.' })
    } catch {
      setMsg({ tone: 'err', text: 'Network error.' })
    } finally {
      setBusy(false)
    }
  }

  async function dropUnit(unitId) {
    if (!window.confirm('Delete this unit definition? Existing marks will block deletes.')) return
    setBusy(true)
    try {
      const res = await fetch(`/api/hod/units/${encodeURIComponent(unitId)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg({ tone: 'err', text: data.error ?? 'Delete rejected.' })
        return
      }
      await loadUnits()
      setMsg({ tone: 'ok', text: 'Unit deleted.' })
    } catch {
      setMsg({ tone: 'err', text: 'Network error.' })
    } finally {
      setBusy(false)
    }
  }

  async function submitGrade(ev) {
    ev.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      const res = await fetch('/api/hod/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentLoginNumber: studentNumber.trim(),
          programCourseUnitId: gradeUnitId,
          academicYear: Number.parseInt(String(academicYear), 10),
          semesterNumber: Number.parseInt(String(semesterNumber), 10),
          scorePercent: Number.parseInt(String(scorePercent), 10),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg({ tone: 'err', text: data.error ?? 'Could not save grade.' })
        return
      }
      setMsg({ tone: 'ok', text: 'Marks saved.' })
    } catch {
      setMsg({ tone: 'err', text: 'Network error.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {msg ? (
        <p
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            msg.tone === 'ok' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
          }`}
        >
          {msg.text}
        </p>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-primary">Programme course units</h2>
        <p className="text-sm text-gray-600">Units configured here unlock mark entry below for learners registered on that degree.</p>

        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm font-semibold text-gray-700">
            Programme
            <select
              className="block mt-1 w-64 rounded-lg border border-gray-200 p-2 text-sm"
              value={programId}
              onChange={(e) => {
                setProgramId(e.target.value)
                setGradeUnitId('')
              }}
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} · {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loadingUnits ? <p className="text-xs text-gray-500">Refreshing catalogue…</p> : null}

        <form onSubmit={submitUnit} className="grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm sm:col-span-1"
            placeholder="Unit code (e.g. CS201)"
            value={unitCode}
            onChange={(e) => setUnitCode(e.target.value)}
            disabled={busy}
          />
          <input
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm sm:col-span-1"
            type="number"
            min={1}
            max={30}
            value={creditHours}
            onChange={(e) => setCreditHours(e.target.value)}
            disabled={busy}
          />
          <input
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm sm:col-span-2"
            placeholder="Unit title"
            value={unitTitle}
            onChange={(e) => setUnitTitle(e.target.value)}
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy || !programId || !unitCode.trim() || !unitTitle.trim()}
            className="sm:col-span-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-bold disabled:opacity-50"
          >
            Save unit definition
          </button>
        </form>

        <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl">
          {units.length === 0 ? (
            <li className="p-4 text-sm text-gray-500">No units yet for this programme.</li>
          ) : (
            units.map((u) => (
              <li key={u.id} className="p-4 flex justify-between gap-3 text-sm items-start">
                <div>
                  <p className="font-bold text-gray-900">
                    {u.unitCode}{' '}
                    <span className="font-normal text-gray-500">{u.creditHours ?? 3} credits</span>
                  </p>
                  <p className="text-gray-700">{u.title}</p>
                </div>
                <button type="button" className="text-xs font-semibold text-red-600" onClick={() => void dropUnit(u.id)} disabled={busy}>
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-primary">Semester marks</h2>
        <p className="text-sm text-gray-600">Enter percentage scores once the learner sits the unit.</p>

        <form onSubmit={submitGrade} className="grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder="10-digit student number"
            inputMode="numeric"
            maxLength={10}
            pattern="\d{10}"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            disabled={busy}
          />
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            value={gradeUnitId}
            onChange={(e) => setGradeUnitId(e.target.value)}
            disabled={busy || units.length === 0}
          >
            {units.length === 0 ? <option value="">Add units above first</option> : null}
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.unitCode}
              </option>
            ))}
          </select>
          <input
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            type="number"
            placeholder="Academic year"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            disabled={busy}
          />
          <input
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            type="number"
            placeholder="Semester no."
            min={1}
            value={semesterNumber}
            onChange={(e) => setSemesterNumber(e.target.value)}
            disabled={busy}
          />
          <input
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm sm:col-span-2"
            type="number"
            placeholder="Percentage (0‑100)"
            min={0}
            max={100}
            value={scorePercent}
            onChange={(e) => setScorePercent(e.target.value)}
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy || !studentNumber.trim() || !gradeUnitId || scorePercent === ''}
            className="sm:col-span-2 rounded-xl bg-gray-900 text-white px-4 py-2 text-sm font-bold disabled:opacity-50"
          >
            Save mark
          </button>
        </form>
      </section>
    </div>
  )
}
