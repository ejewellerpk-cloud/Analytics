import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedCounter } from '@/components/common/AnimatedCounter'
import { MiniSparkline } from '@/components/charts/MiniSparkline'
import { cn, formatPercent } from '@/lib/utils'

export function KpiCard({ title, value, change, icon: Icon, format, sparkline = [], accent = 'primary', delay = 0 }) {
  const positive = Number(change) >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card glass className="overflow-hidden h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold tracking-tight">
                <AnimatedCounter value={value} format={format} />
              </p>
              {change != null && (
                <div className={cn('flex items-center gap-1 text-xs font-medium', positive ? 'text-emerald-500' : 'text-red-500')}>
                  {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {formatPercent(change)}
                </div>
              )}
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {Icon && <Icon className="h-5 w-5" />}
            </div>
          </div>
          {sparkline.length > 0 && (
            <div className="mt-3 -mb-2 h-10 w-full">
              <MiniSparkline data={sparkline} accent={accent} className="h-10 w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
