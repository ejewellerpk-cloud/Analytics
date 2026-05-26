import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getEnvConfig, getApiBaseUrl, getLicenseKeyHint } from '@/utils/envConfig'
import { useIntelligenceSettings } from '@/hooks/useCommerce'
import { Skeleton } from '@/components/ui/skeleton'

const ENDPOINTS = [
  'GET /api/admin/intelligence/sites',
  'GET /api/admin/intelligence/overview',
  'GET /api/admin/intelligence/daily-series',
  'GET /api/admin/intelligence/realtime',
  'GET /api/admin/intelligence/funnel',
  'GET /api/admin/intelligence/sources',
  'GET /api/admin/intelligence/products',
  'GET /api/admin/intelligence/commerce/*',
  'GET /api/admin/intelligence/export',
  'GET /api/admin/intelligence/settings',
]

export function ApiSettingsPage() {
  const env = getEnvConfig()
  const { data: settings, isLoading } = useIntelligenceSettings()

  return (
    <div className="space-y-6 max-w-lg">
      <Card glass>
        <CardHeader>
          <CardTitle>API & authentication</CardTitle>
          <CardDescription>Sanctum token + intelligence endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Resolved API base</Label>
            <Input value={getApiBaseUrl()} readOnly className="font-mono text-xs" />
          </div>
          <div className="space-y-2">
            <Label>License key</Label>
            <Input value={getLicenseKeyHint() || 'Not loaded'} readOnly />
          </div>
          <Separator />
          {isLoading ? (
            <Skeleton className="h-20" />
          ) : settings ? (
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Site:</span> {settings.name}</p>
              <p><span className="text-muted-foreground">Domain:</span> {settings.domain}</p>
              <p className="break-all"><span className="text-muted-foreground">Collect:</span> {settings.collect_url}</p>
            </div>
          ) : null}
          <Button variant="gradient" onClick={() => window.open(env.apiUrl, '_blank', 'noreferrer')}>
            Open store admin
          </Button>
        </CardContent>
      </Card>

      <Card glass>
        <CardHeader><CardTitle className="text-base">Endpoints in use</CardTitle></CardHeader>
        <CardContent>
          <ul className="text-xs font-mono space-y-1 text-muted-foreground">
            {ENDPOINTS.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
