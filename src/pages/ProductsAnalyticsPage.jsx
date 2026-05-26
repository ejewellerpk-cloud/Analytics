import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BarChart } from '@/components/charts/BarChart'
import { DataTable } from '@/components/tables/DataTable'
import { FunnelChart } from '@/components/charts/FunnelChart'
import { useProductCatalog, useProductInsights } from '@/hooks/useAnalytics'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { labelForRange } from '@/utils/dateRange'
import { useAnalyticsContext } from '@/contexts/AnalyticsContext'
import { Search, X, AlertCircle } from 'lucide-react'
import { getErrorMessage } from '@/api/client'

function ProductDetailPanel({ productId, onClose }) {
  const { data, isLoading } = useProductInsights(productId)

  if (!productId) return null

  const metrics = data?.metrics ?? {}
  const metricRows = Object.entries(metrics).map(([key, val], i) => ({
    id: i,
    event: key.replace(/_/g, ' '),
    count: val,
  }))

  return (
    <Card glass className="border-primary/30">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{data?.product?.name ?? 'Product'}</CardTitle>
          <CardDescription>
            SKU: {data?.product?.sku ?? '—'} · Stock: {data?.product?.stock ?? 0}
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-3 text-center">
            <p className="text-xs text-muted-foreground">Views</p>
            <p className="text-xl font-bold">{metrics.product_viewed ?? 0}</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-xs text-muted-foreground">Add to cart</p>
            <p className="text-xl font-bold">{metrics.add_to_cart ?? 0}</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-xl font-bold">{formatCurrency(data?.commerce?.revenue ?? 0)}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium mb-2">Product funnel</p>
            <FunnelChart steps={data?.funnel ?? []} loading={isLoading} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Daily activity</p>
            <BarChart
              loading={isLoading}
              categories={(data?.daily_series ?? []).map((d) => d.date)}
              series={[
                { name: 'Views', data: (data?.daily_series ?? []).map((d) => d.views) },
                { name: 'Cart', data: (data?.daily_series ?? []).map((d) => d.add_to_cart) },
              ]}
              height={220}
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">All tracked events</p>
          <DataTable
            loading={isLoading}
            columns={[
              { key: 'event', label: 'Event' },
              { key: 'count', label: 'Count' },
            ]}
            data={metricRows}
            searchable={false}
          />
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Page URLs (product views)</p>
          <DataTable
            loading={isLoading}
            columns={[
              { key: 'url', label: 'Page' },
              { key: 'views', label: 'Views' },
            ]}
            data={(data?.top_pages ?? []).map((p, i) => ({ ...p, id: i }))}
            searchable={false}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductsAnalyticsPage() {
  const { dateRange } = useAnalyticsContext()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const { data: catalog = [], isLoading, isError, error } = useProductCatalog(search)

  const rows = catalog.map((p) => ({
    ...p,
    id: p.product_id,
    view_to_cart: `${p.view_to_cart_rate}%`,
    cart_to_buy: `${p.cart_to_purchase_rate}%`,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products Analytics"
        description={`Per-product tracking: views, cart, checkout, sales · ${labelForRange(dateRange)}`}
      />

      {isError && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4 flex gap-3 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Could not load products</p>
              <p className="text-muted-foreground mt-1">{getErrorMessage(error)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card glass>
        <CardContent className="p-4 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search product name or SKU…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground self-center">
            {catalog.length} products · click row for full breakdown
          </p>
        </CardContent>
      </Card>

      {selectedId && (
        <ProductDetailPanel productId={selectedId} onClose={() => setSelectedId(null)} />
      )}

      <Card glass>
        <CardHeader>
          <CardTitle>All products</CardTitle>
          <CardDescription>
            Tracking from storefront · sales from orders table
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            loading={isLoading}
            columns={[
              { key: 'name', label: 'Product' },
              { key: 'page_views', label: 'Views', render: (r) => formatNumber(r.page_views) },
              { key: 'add_to_cart', label: 'Add to cart' },
              { key: 'remove_from_cart', label: 'Removed' },
              { key: 'checkout_started', label: 'Checkout' },
              { key: 'units_sold', label: 'Sold' },
              { key: 'revenue', label: 'Revenue', render: (r) => formatCurrency(r.revenue) },
              { key: 'view_to_cart', label: 'View→Cart' },
              { key: 'cart_to_buy', label: 'Cart→Buy' },
              {
                key: 'stock',
                label: 'Stock',
                render: (r) => (
                  <Badge variant={r.stock <= 5 ? 'warning' : 'success'}>{r.stock}</Badge>
                ),
              },
            ]}
            data={rows}
            exportable
            searchable={false}
            pageSize={25}
            onRowClick={(row) => setSelectedId(row.product_id)}
          />
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Views count product page URLs (/product/…) and tracked product events. Sales come from paid orders.
        Use <strong>Last 7 days</strong> if today looks empty. Deploy latest backend (products/catalog API).
      </p>
    </div>
  )
}
