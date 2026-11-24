import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/tables/DataTable'
import { useCartRecovery, useEnsureRecoveryCampaign } from '@/hooks/useEnterprise'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { ShoppingBag, Mail, RefreshCw } from 'lucide-react'

export function CartRecoveryPage() {
  const { data, isLoading, refetch } = useCartRecovery()
  const ensure = useEnsureRecoveryCampaign()
  const kpis = data?.kpis || {}
  const queue = data?.queue || {}
  const campaigns = data?.campaigns || []
  const abandons = (data?.recent_abandons || []).map((row) => ({
    ...row,
    when: row.occurred_at ? new Date(row.occurred_at).toLocaleString() : '—',
    value_label: formatCurrency(row.value || 0),
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Abandoned carts"
        description="See shoppers who left without buying, estimate lost revenue, and send recovery emails."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              size="sm"
              variant="gradient"
              disabled={ensure.isPending}
              onClick={() => ensure.mutate()}
            >
              <Mail className="h-4 w-4 mr-2" />
              {ensure.isPending ? 'Enabling…' : 'Turn on recovery emails'}
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Add to cart', value: formatNumber(kpis.add_to_cart || 0) },
          { label: 'Checkout started', value: formatNumber(kpis.checkout_started || 0) },
          { label: 'Cart abandon rate', value: `${kpis.cart_abandonment_rate ?? 0}%` },
          {
            label: 'Recoverable value',
            value: formatCurrency(kpis.recoverable_value_estimate || 0),
          },
        ].map((kpi) => (
          <Card glass key={kpi.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="text-2xl font-bold mt-1">{isLoading ? '…' : kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card glass>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" />
              Recovery queue
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {['pending', 'sent', 'recovered', 'failed'].map((status) => (
              <div key={status} className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground capitalize">{status}</p>
                <p className="text-xl font-semibold">{formatNumber(queue[status] || 0)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card glass className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Campaigns</CardTitle>
            <CardDescription>Active automation sequences for abandoned checkouts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaigns.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No campaigns yet. Click <strong>Turn on recovery emails</strong> to start a simple follow-up sequence.
              </p>
            )}
            {campaigns.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.channel} · delays {(c.delays_minutes || []).join(', ')} min
                    {c.discount_percent ? ` · ${c.discount_percent}% off` : ''}
                  </p>
                </div>
                <Badge variant={c.is_active ? 'success' : 'secondary'}>
                  {c.is_active ? 'Active' : 'Paused'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card glass>
        <CardHeader>
          <CardTitle className="text-base">Recent cart &amp; checkout signals</CardTitle>
          <CardDescription>
            Add-to-cart without order (cart abandoned), plus checkout started / left checkout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            loading={isLoading}
            columns={[
              { key: 'event', label: 'Event' },
              { key: 'when', label: 'When' },
              { key: 'value_label', label: 'Value' },
              { key: 'email', label: 'Email' },
              { key: 'page_url', label: 'Page' },
            ]}
            data={abandons}
            searchable
            emptyTitle="No cart signals yet"
            emptyDescription="Add to cart without buying, or leaving checkout, will show here"
          />
        </CardContent>
      </Card>
    </div>
  )
}
