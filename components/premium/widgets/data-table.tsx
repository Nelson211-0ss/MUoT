'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Column<T> = { key: keyof T | string; header: string; render?: (row: T) => React.ReactNode }

export function DataTable<T extends Record<string, unknown>>({
  title,
  columns,
  rows,
  actionLabel = 'View',
}: {
  title: string
  columns: Column<T>[]
  rows: T[]
  actionLabel?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button variant="outline" size="sm">
          Export
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800">
              {columns.map((c) => (
                <th key={String(c.key)} className="pb-3 pr-4 font-semibold">
                  {c.header}
                </th>
              ))}
              <th className="pb-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row, idx) => (
              <tr key={idx} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                {columns.map((c) => (
                  <td key={String(c.key)} className="py-3 pr-4 text-slate-700 dark:text-slate-300">
                    {c.render ? c.render(row) : String(row[c.key as keyof T] ?? '')}
                  </td>
                ))}
                <td className="py-3 text-right">
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                    {actionLabel}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  const variant =
    s.includes('approv') || s.includes('enroll') || s.includes('verified')
      ? 'success'
      : s.includes('reject') || s.includes('fail')
        ? 'danger'
        : s.includes('review') || s.includes('pending') || s.includes('submit')
          ? 'warning'
          : 'secondary'
  return <Badge variant={variant}>{status}</Badge>
}
