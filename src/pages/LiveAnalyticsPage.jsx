import { motion } from 'framer-motion'
import { Activity, Radio, ShoppingBag, Eye, Globe } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRealtime } from '@/hooks/useAnalytics'
import { useRecentOrders } from '@/hooks/useCommerce'
import { Skeleton } from '@/components/ui/skeleton'
import { AnimatedCounter } from '@/components/common/AnimatedCounter'
import { formatDistanceToNow } from 'date-fns'

function LiveWidget({ icon: Icon, label, value, pulse }) {
  return (
    <Card glass className="relative overflow-hidden">
      {pulse && (
        <span className="absolute top-3 right-3 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold">
              <AnimatedCounter value={value} />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function LiveAnalyticsPage() {
  const { data, isLoading } = useRealtime(10000)
  const { data: orders = [], isLoading: ordersLoading } = useRecentOrders(15)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Analytics"
        description="Real-time intelligence + latest store orders"
        actions={<Badge variant="success" className="gap-1"><Radio className="h-3 w-3" /> Live</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <LiveWidget icon={Activity} label="Active visitors" value={data?.active_visitors ?? 0} pulse />
            <LiveWidget icon={Eye} label="Page views today" value={data?.page_views_today ?? 0} />
            <LiveWidget icon={ShoppingBag} label="Orders today" value={data?.orders_today ?? 0} />
            <LiveWidget icon={ShoppingBag} label="Add to carts" value={data?.add_to_carts_today ?? 0} />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card glass>
          <CardHeader><CardTitle>Top pages (live)</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(data?.top_pages ?? []).map((p, i) => (
                <motion.li
                  key={p.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex justify-between text-sm"
                >
                  <span className="truncate text-muted-foreground">{p.label}</span>
                  <span className="font-semibold tabular-nums">{p.value}</span>
                </motion.li>
              ))}
              {!isLoading && !(data?.top_pages?.length) && (
                <p className="text-sm text-muted-foreground">No page views yet today.</p>
              )}
            </ul>
          </CardContent>
        </Card>
        <Card glass>
          <CardHeader className="flex flex-row items-center gap-2">
            <Globe className="h-4 w-4" />
            <CardTitle>Top sources (live)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(data?.top_sources ?? []).map((s, i) => (
                <li key={s.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-semibold">{s.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card glass>
        <CardHeader><CardTitle>Recent orders (live from store)</CardTitle></CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}</div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {orders.map((o) => (
                <div key={o.id} className="rounded-lg border px-3 py-2 text-sm flex justify-between gap-2">
                  <span>{o.label}</span>
                  <span className="text-muted-foreground text-xs shrink-0">
                    {o.placed_at
                      ? formatDistanceToNow(new Date(o.placed_at), { addSuffix: true })
                      : '—'}
                  </span>
                </div>
              ))}
              {!orders.length && (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
