import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart } from '@/components/charts/AreaChart'
import { DataTable } from '@/components/tables/DataTable'
import { useOverview } from '@/hooks/useAnalytics'
import { useCustomerActivity, useTopCustomers, useCommerceTotals } from '@/hooks/useCommerce'
import { formatCurrency, formatNumber } from '@/lib/utils'

export function CustomersAnalyticsPage() {
  const { data: overview, isLoading } = useOverview()
  const { data: totals } = useCommerceTotals()
  const { data: activity, isLoading: activityLoading } = useCustomerActivity()
  const { data: topCustomers = [], isLoading: customersLoading } = useTopCustomers()

  const times = activity?.times ?? []
  const ordersByHour = activity?.total_customers ?? []

  const customerRows = topCustomers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    orders: c.orders_count,
    spent: '—',
  }))

  return (
    <div className="space-y-6">
      <PageHeader title="Customers Analytics" description="Live customers, activity peaks & top buyers" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card glass>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total customers</p>
            <p className="text-3xl font-bold mt-1">{formatNumber(totals?.total_customers ?? 0)}</p>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Visitors (range)</p>
            <p className="text-3xl font-bold mt-1">{formatNumber(overview?.visitors ?? 0)}</p>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Sessions</p>
            <p className="text-3xl font-bold mt-1">{formatNumber(overview?.sessions ?? 0)}</p>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Bounce rate</p>
            <p className="text-3xl font-bold mt-1">{(overview?.bounce_rate ?? 0).toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      <Card glass>
        <CardHeader><CardTitle>Orders by hour of day</CardTitle></CardHeader>
        <CardContent>
          <AreaChart
            loading={isLoading || activityLoading}
            categories={times}
            series={[{ name: 'Orders', data: ordersByHour }]}
          />
        </CardContent>
      </Card>

      <Card glass>
        <CardHeader><CardTitle>Top customers</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            loading={customersLoading}
            columns={[
              { key: 'name', label: 'Customer' },
              { key: 'email', label: 'Email' },
              { key: 'orders', label: 'Orders' },
            ]}
            data={customerRows}
            searchable
          />
        </CardContent>
      </Card>
    </div>
  )
}
