import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HeatmapCanvas } from '@/components/heatmap/HeatmapCanvas'
import { useHeatmapPages, useHeatmapSnapshot } from '@/hooks/useEnterprise'
import { useAnalyticsContext } from '@/contexts/AnalyticsContext'
import { labelForRange } from '@/utils/dateRange'
import { Badge } from '@/components/ui/badge'
import { getErrorMessage } from '@/api/client'

const DEVICES = ['all', 'mobile', 'desktop']

export function HeatmapsPage() {
  const { dateRange, siteId } = useAnalyticsContext()
  const [device, setDevice] = useState('all')
  const [pagePath, setPagePath] = useState(null)
  const [type, setType] = useState('scroll')
  const {
    data: pages = [],
    isLoading: pagesLoading,
    isError: pagesError,
    error: pagesErr,
  } = useHeatmapPages(device === 'all' ? null : device)
  const {
    data: snapshot,
    isLoading: snapLoading,
    isError: snapError,
    error: snapErr,
  } = useHeatmapSnapshot(pagePath, type, device === 'all' ? null : device)

  useEffect(() => {
    if (pages.length === 0) return
    const paths = pages.map((p) => p.page_path)
    if (!pagePath || !paths.includes(pagePath)) {
      setPagePath(pages[0].page_path)
    }
  }, [pages, pagePath])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Heatmaps"
        description={`Click, scroll, rage & dead clicks · ${labelForRange(dateRange)}`}
      />

      <div className="flex flex-wrap gap-2">
        {DEVICES.map((d) => (
          <Badge
            key={d}
            variant={device === d ? 'default' : 'outline'}
            className="cursor-pointer capitalize"
            onClick={() => setDevice(d)}
          >
            {d}
          </Badge>
        ))}
        {['click', 'scroll'].map((t) => (
          <Badge
            key={t}
            variant={type === t ? 'default' : 'outline'}
            className="cursor-pointer capitalize"
            onClick={() => setType(t)}
          >
            {t}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card glass className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Pages</CardTitle>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto space-y-1">
            {!siteId && (
              <p className="text-sm text-amber-600">
                Select an analytics site in the header (site_id required).
              </p>
            )}
            {pagesLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {pagesError && (
              <p className="text-sm text-destructive">{getErrorMessage(pagesErr, 'Failed to load pages')}</p>
            )}
            {pages.map((p) => (
              <button
                key={p.page_path}
                type="button"
                onClick={() => setPagePath(p.page_path)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded-lg hover:bg-muted ${
                  pagePath === p.page_path ? 'bg-primary/10 text-primary font-medium' : ''
                }`}
              >
                {p.page_path}
                <span className="text-muted-foreground ml-1">({p.interactions})</span>
              </button>
            ))}
            {!pagesLoading && pages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No heatmap data yet. Ensure intelligence-tracker.js is deployed and visitors browse the store.
              </p>
            )}
          </CardContent>
        </Card>
        <Card glass className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Heatmap viewer</CardTitle>
          </CardHeader>
          <CardContent>
            {snapError && (
              <p className="text-sm text-destructive mb-3">{getErrorMessage(snapErr, 'Failed to load heatmap')}</p>
            )}
            <HeatmapCanvas snapshot={snapshot} loading={snapLoading || !pagePath} />
            {!snapLoading && snapshot?.cells?.length === 0 && pagePath && (
              <p className="text-sm text-muted-foreground mt-3">
                No cells for this page/type. Try Scroll, pick another page, or set date range to Today.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
