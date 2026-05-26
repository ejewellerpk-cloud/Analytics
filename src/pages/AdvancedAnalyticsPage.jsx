import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable } from '@/components/tables/DataTable'
import { BarChart } from '@/components/charts/BarChart'
import { DonutChart } from '@/components/charts/DonutChart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  useCohortRetention,
  useRfm,
  useProductAffinity,
  usePayments,
  useReturns,
  useGeoDevice,
  useHourlyHeatmap,
  useInventoryForecast,
  useMultiStoreCompare,
  useReportSchedule,
  useSaveReportSchedule,
} from '@/hooks/useAdvanced'
import { useAnalyticsContext } from '@/contexts/AnalyticsContext'
import { sendReportNow } from '@/api/advanced'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { labelForRange } from '@/utils/dateRange'

export function AdvancedAnalyticsPage() {
  const { dateRange, params } = useAnalyticsContext()
  const [scheduleForm, setScheduleForm] = useState(null)

  const cohort = useCohortRetention()
  const rfm = useRfm()
  const affinity = useProductAffinity()
  const payments = usePayments()
  const returns = useReturns()
  const geo = useGeoDevice()
  const heatmap = useHourlyHeatmap()
  const inventory = useInventoryForecast()
  const multi = useMultiStoreCompare()
  const schedule = useReportSchedule()
  const saveSchedule = useSaveReportSchedule()

  useEffect(() => {
    if (schedule.data) setScheduleForm(schedule.data)
  }, [schedule.data])

  const cohortRows = (cohort.data ?? []).flatMap((c) =>
    (c.retention ?? []).map((r, i) => ({
      id: `${c.cohort}-${i}`,
      cohort: c.cohort,
      period: r.period,
      customers: r.customers,
      rate: `${r.rate}%`,
      size: c.size,
    })),
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Advanced Analytics"
        description={`Pro insights from live store + tracking data · ${labelForRange(dateRange)}`}
      />

      <Tabs defaultValue="cohort" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="cohort">Cohort</TabsTrigger>
          <TabsTrigger value="rfm">RFM</TabsTrigger>
          <TabsTrigger value="affinity">Affinity</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="geo">Geo & device</TabsTrigger>
          <TabsTrigger value="heatmap">Hourly</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="stores">Multi-store</TabsTrigger>
          <TabsTrigger value="schedule">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="cohort">
          <Card glass>
            <CardHeader>
              <CardTitle>Cohort retention</CardTitle>
              <CardDescription>Customers grouped by first order month — who came back?</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                loading={cohort.isLoading}
                columns={[
                  { key: 'cohort', label: 'Cohort' },
                  { key: 'size', label: 'Size' },
                  { key: 'period', label: 'Period' },
                  { key: 'customers', label: 'Active' },
                  { key: 'rate', label: 'Retention' },
                ]}
                data={cohortRows}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rfm">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card glass>
              <CardHeader><CardTitle>RFM segments</CardTitle></CardHeader>
              <CardContent>
                <DonutChart
                  loading={rfm.isLoading}
                  labels={(rfm.data?.segments ?? []).map((s) => s.segment)}
                  series={(rfm.data?.segments ?? []).map((s) => s.customers)}
                />
              </CardContent>
            </Card>
            <Card glass>
              <CardHeader><CardTitle>Top customers by spend</CardTitle></CardHeader>
              <CardContent>
                <DataTable
                  loading={rfm.isLoading}
                  columns={[
                    { key: 'name', label: 'Customer' },
                    { key: 'segment', label: 'Segment', render: (r) => <Badge>{r.segment}</Badge> },
                    { key: 'monetary', label: 'Spent', render: (r) => formatCurrency(r.monetary) },
                    { key: 'frequency', label: 'Orders' },
                  ]}
                  data={(rfm.data?.customers ?? []).map((c, i) => ({ ...c, id: i }))}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="affinity">
          <Card glass>
            <CardHeader>
              <CardTitle>Product affinity</CardTitle>
              <CardDescription>Often bought together in the same order</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                loading={affinity.isLoading}
                columns={[
                  { key: 'product_a', label: 'Product A' },
                  { key: 'product_b', label: 'Product B' },
                  { key: 'times_bought_together', label: 'Together' },
                ]}
                data={(affinity.data ?? []).map((r, i) => ({ ...r, id: i }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card glass>
              <CardHeader><CardTitle>COD vs prepaid</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">COD orders</p>
                  <p className="text-2xl font-bold">{payments.data?.summary?.cod_orders ?? 0}</p>
                  <p className="text-sm">{formatCurrency(payments.data?.summary?.cod_revenue ?? 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Prepaid orders</p>
                  <p className="text-2xl font-bold">{payments.data?.summary?.prepaid_orders ?? 0}</p>
                  <p className="text-sm">{formatCurrency(payments.data?.summary?.prepaid_revenue ?? 0)}</p>
                </div>
              </CardContent>
            </Card>
            <Card glass>
              <CardHeader><CardTitle>By gateway</CardTitle></CardHeader>
              <CardContent>
                <BarChart
                  loading={payments.isLoading}
                  categories={(payments.data?.methods ?? []).map((m) => m.name)}
                  series={[{ name: 'Orders', data: (payments.data?.methods ?? []).map((m) => m.orders) }]}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="returns">
          <div className="grid gap-4 sm:grid-cols-3 mb-4">
            <Card glass><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Returns</p><p className="text-2xl font-bold">{returns.data?.returns_count ?? 0}</p></CardContent></Card>
            <Card glass><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Return rate</p><p className="text-2xl font-bold">{(returns.data?.return_rate ?? 0)}%</p></CardContent></Card>
            <Card glass><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Lost revenue</p><p className="text-2xl font-bold">{formatCurrency(returns.data?.lost_revenue ?? 0)}</p></CardContent></Card>
          </div>
          <Card glass>
            <CardHeader><CardTitle>Recent returns</CardTitle></CardHeader>
            <CardContent>
              <DataTable
                loading={returns.isLoading}
                columns={[
                  { key: 'order_serial', label: 'Order' },
                  { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.amount) },
                  { key: 'status', label: 'Status' },
                ]}
                data={(returns.data?.recent ?? []).map((r, i) => ({ ...r, id: i }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geo">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card glass>
              <CardHeader><CardTitle>Countries</CardTitle></CardHeader>
              <CardContent>
                <BarChart loading={geo.isLoading} categories={(geo.data?.countries ?? []).map((c) => c.label)} series={[{ name: 'Sessions', data: (geo.data?.countries ?? []).map((c) => c.sessions) }]} />
              </CardContent>
            </Card>
            <Card glass>
              <CardHeader><CardTitle>Devices</CardTitle></CardHeader>
              <CardContent>
                <DonutChart loading={geo.isLoading} labels={(geo.data?.devices ?? []).map((d) => d.label)} series={(geo.data?.devices ?? []).map((d) => d.sessions)} />
              </CardContent>
            </Card>
            <Card glass className="lg:col-span-2">
              <CardHeader><CardTitle>Top cities</CardTitle></CardHeader>
              <CardContent>
                <DataTable loading={geo.isLoading} columns={[{ key: 'label', label: 'City' }, { key: 'sessions', label: 'Sessions' }]} data={(geo.data?.cities ?? []).map((c, i) => ({ ...c, id: i }))} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="heatmap">
          <Card glass>
            <CardHeader><CardTitle>Orders by hour</CardTitle></CardHeader>
            <CardContent>
              <BarChart
                loading={heatmap.isLoading}
                categories={(heatmap.data?.orders_by_hour ?? []).map((h) => h.hour)}
                series={[{ name: 'Orders', data: (heatmap.data?.orders_by_hour ?? []).map((h) => h.orders) }]}
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card glass>
            <CardHeader>
              <CardTitle>Inventory forecast</CardTitle>
              <CardDescription>30-day velocity · days until stockout</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                loading={inventory.isLoading}
                columns={[
                  { key: 'name', label: 'Product' },
                  { key: 'stock', label: 'Stock' },
                  { key: 'sold_30d', label: 'Sold (30d)' },
                  { key: 'daily_velocity', label: 'Daily' },
                  { key: 'days_until_stockout', label: 'Days left', render: (r) => r.days_until_stockout ?? '—' },
                  { key: 'risk', label: 'Risk', render: (r) => <Badge variant={r.risk === 'high' ? 'destructive' : r.risk === 'medium' ? 'warning' : 'success'}>{r.risk}</Badge> },
                ]}
                data={(inventory.data ?? []).map((r) => ({ ...r, id: r.product_id }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores">
          <Card glass>
            <CardHeader>
              <CardTitle>Multi-site compare</CardTitle>
              <CardDescription>Tracking per site · store orders/revenue are shared across sites</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                loading={multi.isLoading}
                columns={[
                  { key: 'name', label: 'Site' },
                  { key: 'visitors', label: 'Visitors' },
                  { key: 'sessions', label: 'Sessions' },
                  { key: 'store_orders', label: 'Store orders' },
                  { key: 'store_revenue', label: 'Store revenue', render: (r) => formatCurrency(r.store_revenue) },
                ]}
                data={(multi.data ?? []).map((r) => ({ ...r, id: r.site_id }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card glass>
              <CardHeader><CardTitle>Scheduled email reports</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {scheduleForm && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label>Enabled</Label>
                      <Switch checked={scheduleForm.enabled} onCheckedChange={(v) => setScheduleForm((f) => ({ ...f, enabled: v }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={scheduleForm.email} onChange={(e) => setScheduleForm((f) => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <select className="w-full rounded-lg border bg-background px-3 py-2 text-sm" value={scheduleForm.frequency} onChange={(e) => setScheduleForm((f) => ({ ...f, frequency: e.target.value }))}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <Button variant="gradient" onClick={() => saveSchedule.mutate(scheduleForm)} disabled={saveSchedule.isPending}>
                      Save schedule
                    </Button>
                  </>
                )}
                <p className="text-xs text-muted-foreground">Server cron: <code>php artisan schedule:run</code> every minute.</p>
              </CardContent>
            </Card>
            <Card glass>
              <CardHeader><CardTitle>Send now</CardTitle></CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => sendReportNow(params)}>Download CSV report</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
