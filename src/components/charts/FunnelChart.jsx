import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function FunnelChart({ steps = [], loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" style={{ width: `${100 - i * 12}%`, margin: '0 auto' }} />
        ))}
      </div>
    )
  }

  const max = Math.max(...steps.map((s) => s.count || 0), 1)

  return (
    <div className="space-y-2 py-2">
      {steps.map((step, i) => {
        const width = Math.max(20, (step.count / max) * 100)
        const dropoff = i > 0 && steps[i - 1]?.count
          ? (((steps[i - 1].count - step.count) / steps[i - 1].count) * 100).toFixed(1)
          : null

        return (
          <motion.div
            key={step.step || i}
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: i * 0.08 }}
            className="mx-auto"
            style={{ width: `${width}%` }}
          >
            <div
              className={cn(
                'rounded-lg px-4 py-3 text-sm transition-all',
                'bg-gradient-to-r from-primary/80 to-accent/80 text-white shadow-md',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium truncate">{step.step}</span>
                <span className="font-bold tabular-nums">{step.count?.toLocaleString()}</span>
              </div>
              <div className="mt-1 flex justify-between text-xs text-white/80">
                <span>{step.conversion_pct}% of top</span>
                {dropoff != null && <span>−{dropoff}% drop</span>}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
