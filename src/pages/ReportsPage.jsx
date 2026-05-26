import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAnalyticsContext } from '@/contexts/AnalyticsContext'
import { downloadAnalyticsExport } from '@/api/commerce'
import { useOverview, useFunnel, useSources } from '@/hooks/useAnalytics'
import { DataTable } from '@/components/tables/DataTable'
import { formatCurrency, formatNumber } from '@/lib/utils'

export function ReportsPage() {
  const { params } = useAnalyticsContext()
  const { data: overview } = useOverview()
  const { data: funnel = [] } = useFunnel()
  const { data: sources = [] } = useSources()
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)

  const summaryRows = overview
    ? [
        { id: 1, metric: 'Visitors', value: formatNumber(overview.visitors) },
        { id: 2, metric: 'Sessions', value: formatNumber(overview.sessions) },
        { id: 3, metric: 'Page views', value: formatNumber(overview.page_views) },
        { id: 4, metric: 'Orders', value: formatNumber(overview.orders) },
        { id: 5, metric: 'Revenue', value: formatCurrency(overview.revenue) },
        { id: 6, metric: 'Conversion', value: `${overview.conversion_rate}%` },
      ]
    : []

  const handleExport = async () => {
    setExporting(true)
    setError(null)
    try {
      await downloadAnalyticsExport(params)
    } catch (e) {
      setError(e.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description={`Export analytics for ${params.from} → ${params.to}`}
      />

      <Card glass>
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">CSV export</CardTitle>
            <CardDescription>Overview, funnel, and traffic sources — one file</CardDescription>
          </div>
          <Button variant="gradient" onClick={handleExport} disabled={exporting || !params.siteId}>
            {exporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
            Download CSV
          </Button>
        </CardContent>
        {error && <p className="px-6 pb-4 text-sm text-destructive">{error}</p>}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card glass>
          <CardHeader><CardTitle>Period summary</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: 'metric', label: 'Metric' },
                { key: 'value', label: 'Value' },
              ]}
              data={summaryRows}
              searchable={false}
              exportable={false}
            />
          </CardContent>
        </Card>
        <Card glass>
          <CardHeader><CardTitle>Funnel snapshot</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: 'step', label: 'Step' },
                { key: 'count', label: 'Count' },
                { key: 'conversion_pct', label: '%' },
              ]}
              data={funnel.map((s, i) => ({ ...s, id: i }))}
              searchable={false}
            />
          </CardContent>
        </Card>
      </div>

      <Card glass>
        <CardHeader><CardTitle>Sources snapshot</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'source', label: 'Source' },
              { key: 'sessions', label: 'Sessions' },
            ]}
            data={sources.map((s, i) => ({ ...s, id: i }))}
          />
        </CardContent>
      </Card>
    </div>
  )
}
