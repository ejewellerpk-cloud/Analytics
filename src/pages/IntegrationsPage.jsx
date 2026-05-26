import { Plug, Globe, Key, Activity } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useIntelligenceSettings } from '@/hooks/useCommerce'
import { getEnvConfig } from '@/utils/envConfig'

export function IntegrationsPage() {
  const { data: settings, isLoading, error } = useIntelligenceSettings()
  const env = getEnvConfig()

  const trackingOn = settings?.analytics_enabled === 5 || settings?.analytics_enabled === 1 || settings?.analytics_enabled === true

  const items = [
    {
      name: 'Customer Intelligence',
      icon: Activity,
      status: trackingOn ? 'active' : 'inactive',
      desc: settings?.name ? `${settings.name} · ${settings.domain}` : 'Analytics site',
      detail: settings?.collect_url,
    },
    {
      name: 'Tracker script',
      icon: Plug,
      status: settings?.public_key ? 'ready' : 'setup',
      desc: 'Storefront event collection',
      detail: settings?.tracker_url,
    },
    {
      name: 'Allowed origins',
      icon: Globe,
      status: 'configured',
      desc: settings?.allowed_origins || '*',
      detail: null,
    },
    {
      name: 'API connection',
      icon: Key,
      status: env.laravelApiKey ? 'connected' : 'missing',
      desc: getEnvConfig().apiUrl,
      detail: 'Sanctum + license key',
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Integrations" description="Live intelligence & tracking configuration from Laravel" />

      {isLoading && <Skeleton className="h-40 rounded-xl" />}
      {error && (
        <p className="text-sm text-destructive rounded-lg bg-destructive/10 p-3">
          Could not load settings. Ensure you have admin access.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card glass key={item.name}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </div>
              </div>
              <Badge
                variant={
                  item.status === 'active' || item.status === 'ready' || item.status === 'connected'
                    ? 'success'
                    : 'warning'
                }
              >
                {item.status}
              </Badge>
            </CardHeader>
            {item.detail && (
              <CardContent>
                <code className="text-xs break-all text-muted-foreground">{item.detail}</code>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card glass>
        <CardHeader><CardTitle>Public key</CardTitle></CardHeader>
        <CardContent>
          <code className="text-xs break-all">{settings?.public_key || '—'}</code>
          <p className="text-xs text-muted-foreground mt-2">
            Tracking keys are managed here. Intelligence dashboard runs on your analytics subdomain only.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
