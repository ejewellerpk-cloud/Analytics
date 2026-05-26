import {
  DollarSign,
  ShoppingCart,
  Users,
  Percent,
  TrendingUp,
  MousePointerClick,
  Wallet,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart } from '@/components/charts/AreaChart'
import { BarChart } from '@/components/charts/BarChart'
import { useOverview, useFunnel, useSources, useDailySeries } from '@/hooks/useAnalytics'
import { useCommerceTotals } from '@/hooks/useCommerce'
import { useAnalyticsContext } from '@/contexts/AnalyticsContext'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { labelForRange } from '@/utils/dateRange'

export function DashboardPage() {
  const { dateRange } = useAnalyticsContext()
  const { data: overview, isLoading } = useOverview()
  const { data: totals } = useCommerceTotals()
  const { data: funnel = [], isLoading: funnelLoading } = useFunnel()
  const { data: sources = [], isLoading: sourcesLoading } = useSources()
  const { data: daily = [], isLoading: dailyLoading } = useDailySeries()

  const series = daily.length ? daily : []

  // Revenue/orders: Laravel orders table (same as admin dashboard)
  const allTimeRevenue = overview?.all_time_revenue ?? totals?.total_sales ?? 0
  const allTimeOrders = overview?.all_time_orders ?? totals?.total_orders ?? 0
  const periodRevenue = overview?.revenue ?? 0
  const periodOrders = overview?.orders ?? 0

  const kpis = {
    allTimeRevenue: { value: allTimeRevenue },
    periodRevenue: { value: periodRevenue },
    periodOrders: { value: periodOrders },
    allTimeOrders: { value: allTimeOrders },
    visitors: { value: overview?.visitors ?? 0 },
    conversion: { value: overview?.conversion_rate ?? 0 },
    sessions: { value: overview?.sessions ?? 0 },
    pageViews: { value: overview?.page_views ?? 0 },
  }

  const spark = (key) => series.map((d) => d[key] ?? 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Store data matches Laravel admin · ${labelForRange(dateRange)}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
        <KpiCard
          title="Total earnings"
          value={kpis.allTimeRevenue.value}
          icon={Wallet}
          format={(v) => formatCurrency(v)}
          delay={0}
        />
        <KpiCard
          title="Revenue (period)"
          value={kpis.periodRevenue.value}
          icon={DollarSign}
          format={(v) => formatCurrency(v)}
          sparkline={spark('revenue')}
          delay={0.05}
        />
        <KpiCard
          title="Orders (period)"
          value={kpis.periodOrders.value}
          icon={ShoppingCart}
          format={formatNumber}
          sparkline={spark('orders')}
          delay={0.1}
        />
        <KpiCard
          title="Total orders"
          value={kpis.allTimeOrders.value}
          icon={ShoppingCart}
          format={formatNumber}
          delay={0.15}
        />
        <KpiCard title="Visitors" value={kpis.visitors.value} icon={Users} format={formatNumber} sparkline={spark('visitors')} delay={0.2} />
        <KpiCard title="Conversion" value={kpis.conversion.value} icon={Percent} format={(v) => `${Number(v).toFixed(2)}%`} delay={0.25} />
        <KpiCard title="Sessions" value={kpis.sessions.value} icon={TrendingUp} format={formatNumber} delay={0.3} />
        <KpiCard title="Page views" value={kpis.pageViews.value} icon={MousePointerClick} format={formatNumber} delay={0.35} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card glass>
          <CardHeader><CardTitle>Revenue trend</CardTitle></CardHeader>
          <CardContent>
            <AreaChart
              loading={isLoading || dailyLoading}
              categories={series.map((d) => d.date)}
              series={[{ name: 'Revenue', data: series.map((d) => Number(d.revenue ?? 0)) }]}
            />
          </CardContent>
        </Card>
        <Card glass>
          <CardHeader><CardTitle>Orders trend</CardTitle></CardHeader>
          <CardContent>
            <AreaChart
              loading={isLoading || dailyLoading}
              categories={series.map((d) => d.date)}
              series={[{ name: 'Orders', data: series.map((d) => Number(d.orders ?? 0)) }]}
            />
          </CardContent>
        </Card>
        <Card glass>
          <CardHeader><CardTitle>Conversion funnel</CardTitle></CardHeader>
          <CardContent>
            <BarChart
              loading={funnelLoading}
              categories={funnel.map((s) => s.step)}
              series={[{ name: 'Users', data: funnel.map((s) => s.count ?? 0) }]}
              height={280}
            />
          </CardContent>
        </Card>
        <Card glass>
          <CardHeader><CardTitle>Traffic sources</CardTitle></CardHeader>
          <CardContent>
            <BarChart
              loading={sourcesLoading}
              categories={sources.map((s) => s.source || 'direct')}
              series={[{ name: 'Sessions', data: sources.map((s) => s.sessions ?? 0) }]}
              height={280}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
