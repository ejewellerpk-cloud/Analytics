import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart } from '@/components/charts/BarChart'
import { DataTable } from '@/components/tables/DataTable'
import { useOverview, useSources } from '@/hooks/useAnalytics'
import { formatNumber } from '@/lib/utils'

export function MarketingAnalyticsPage() {
  const { data: overview, isLoading } = useOverview()
  const { data: sources = [], isLoading: sourcesLoading } = useSources()

  const sourceRows = sources.map((s, i) => ({
    id: i,
    source: s.source || 'Unknown',
    sessions: s.sessions ?? 0,
    share:
      overview?.sessions > 0
        ? `${(((s.sessions ?? 0) / overview.sessions) * 100).toFixed(1)}%`
        : '0%',
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Analytics"
        description="Live traffic sources from Customer Intelligence"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card glass>
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Sessions</p>
            <p className="text-4xl font-bold mt-1">{formatNumber(overview?.sessions ?? 0)}</p>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Visitors</p>
            <p className="text-4xl font-bold mt-1">{formatNumber(overview?.visitors ?? 0)}</p>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Conversion</p>
            <p className="text-4xl font-bold mt-1">{(overview?.conversion_rate ?? 0).toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      <Card glass>
        <CardHeader><CardTitle>Sessions by source</CardTitle></CardHeader>
        <CardContent>
          <BarChart
            loading={isLoading || sourcesLoading}
            categories={sourceRows.map((r) => r.source)}
            series={[{ name: 'Sessions', data: sourceRows.map((r) => r.sessions) }]}
            height={280}
          />
        </CardContent>
      </Card>

      <Card glass>
        <CardHeader><CardTitle>Traffic sources</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            loading={isLoading || sourcesLoading}
            columns={[
              { key: 'source', label: 'Source' },
              { key: 'sessions', label: 'Sessions' },
              { key: 'share', label: '% of sessions' },
            ]}
            data={sourceRows}
          />
        </CardContent>
      </Card>
    </div>
  )
}
