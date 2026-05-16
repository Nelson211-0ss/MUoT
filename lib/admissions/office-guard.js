import { NextResponse } from 'next/server'
import { getManagementSessionOrError } from '@/lib/adminAuth'

/** @typedef {{ response: Response | null; admin: { id: string; email: string; name: string; role: string } | null; permissionKeys: string[] }} OfficeCtx */

/** @returns {Promise<OfficeCtx>} */
export async function getAdmissionOfficeCtx() {
  return getManagementSessionOrError()
}

/**
 * @param {string[]} permissionKeys
 * @param {string[]} anyOf
 * @returns {Response | null}
 */
export function forbidUnlessAny(permissionKeys, anyOf) {
  if (!anyOf.some((k) => permissionKeys.includes(k))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}
