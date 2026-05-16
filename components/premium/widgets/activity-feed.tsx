'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Item = { id: string; title: string; time: string; tone?: 'info' | 'success' | 'warning' }

export function ActivityFeed({ items, title = 'Recent activity' }: { items: Item[]; title?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60"
          >
            <span
              className={cn(
                'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                item.tone === 'success' && 'bg-emerald-500',
                item.tone === 'warning' && 'bg-amber-500',
                (!item.tone || item.tone === 'info') && 'bg-indigo-500',
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.title}</p>
              <p className="text-xs text-slate-500">{item.time}</p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
