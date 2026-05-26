import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DonutChart } from '@/components/charts/DonutChart'
import { BarChart } from '@/components/charts/BarChart'
import { DataTable } from '@/components/tables/DataTable'
import { useOverview, useFunnel } from '@/hooks/useAnalytics'
import { useOrderStatistics, useOrderSummary, useSalesSummary } from '@/hooks/useCommerce'
import { formatCurrency, formatNumber } from '@/lib/utils'

export function OrdersAnalyticsPage() {
  const { data: overview, isLoading } = useOverview()
  const { data: stats, isLoading: statsLoading } = useOrderStatistics()
  const { data: summary } = useOrderSummary()
  const { data: salesSummary, isLoading: salesSumLoading } = useSalesSummary()
  const { data: funnel = [], isLoading: funnelLoading } = useFunnel()

  const statusRows = stats
    ? [
        { id: 1, status: 'Pending', count: stats.pending_order },
        { id: 2, status: 'Confirmed', count: stats.confirmed_order },
        { id: 3, status: 'Ongoing', count: stats.ongoing_order },
        { id: 4, status: 'Delivered', count: stats.delivered_order },
        { id: 5, status: 'Canceled', count: stats.canceled_order },
        { id: 6, status: 'Returned', count: stats.returned_order },
        { id: 7, status: 'Rejected', count: stats.rejected_order },
      ]
    : []

  const series = salesSummary?.series ?? []

  return (
    <div className="space-y-6">
      <PageHeader title="Orders Analytics" description="Live order pipeline from your store database" />

      <div className="grid gap-4 md:grid-cols-4">
        <Card glass>
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Total orders</p>
            <p className="text-3xl font-bold mt-1">{formatNumber(stats?.total_order ?? overview?.orders ?? 0)}</p>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Delivered</p>
            <p className="text-3xl font-bold text-emerald-500 mt-1">{formatNumber(stats?.delivered_order ?? 0)}</p>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Revenue (range)</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(overview?.revenue ?? 0)}</p>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Canceled / Rejected</p>
            <p className="text-3xl font-bold mt-1">
              {formatNumber((stats?.canceled_order ?? 0) + (stats?.rejected_order ?? 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card glass>
          <CardHeader><CardTitle>Sales trend</CardTitle></CardHeader>
          <CardContent>
            <BarChart
              loading={salesSumLoading}
              categories={series.map((d) => d.date)}
              series={[{ name: 'Revenue', data: series.map((d) => d.revenue) }]}
              height={260}
            />
          </CardContent>
        </Card>
        <Card glass>
          <CardHeader><CardTitle>Order status mix</CardTitle></CardHeader>
          <CardContent>
            <DonutChart
              loading={statsLoading}
              labels={statusRows.map((s) => s.status)}
              series={statusRows.map((s) => s.count)}
            />
          </CardContent>
        </Card>
      </div>

      {summary && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card glass><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Delivered %</p><p className="text-2xl font-bold">{summary.delivered}%</p></CardContent></Card>
          <Card glass><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Canceled %</p><p className="text-2xl font-bold">{summary.canceled}%</p></CardContent></Card>
          <Card glass><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Rejected %</p><p className="text-2xl font-bold">{summary.rejected}%</p></CardContent></Card>
        </div>
      )}

      <Card glass>
        <CardHeader><CardTitle>Checkout funnel</CardTitle></CardHeader>
        <CardContent>
          <BarChart
            loading={isLoading || funnelLoading}
            categories={funnel.map((s) => s.step)}
            series={[{ name: 'Events', data: funnel.map((s) => s.count ?? 0) }]}
            height={280}
          />
        </CardContent>
      </Card>

      <Card glass>
        <CardHeader><CardTitle>Status breakdown</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            loading={statsLoading}
            columns={[
              { key: 'status', label: 'Status' },
              { key: 'count', label: 'Count' },
            ]}
            data={statusRows}
            exportable
          />
        </CardContent>
      </Card>
    </div>
  )
}
