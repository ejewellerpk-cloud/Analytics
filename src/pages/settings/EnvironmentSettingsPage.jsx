import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Copy, RotateCcw, Zap, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useEnvConfig } from '@/contexts/EnvConfigContext'
import { getApiBaseUrl, ENV_FIELD_META, getLicenseKeyHint } from '@/utils/envConfig'
import { apiClient, getErrorMessage } from '@/api/client'

export function EnvironmentSettingsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { config, saveOverrides, resetOverrides } = useEnvConfig()
  const licenseHint = getLicenseKeyHint()

  const [form, setForm] = useState({
    apiUrl: config.apiUrl,
    echoEnabled: config.echoEnabled,
  })
  const [status, setStatus] = useState(null)
  const [testing, setTesting] = useState(false)

  const applyNow = async (goDashboard = false) => {
    setStatus(null)
    saveOverrides({
      apiUrl: form.apiUrl.replace(/\/$/, ''),
      echoEnabled: form.echoEnabled,
    })
    await queryClient.cancelQueries()
    await queryClient.invalidateQueries()
    await queryClient.refetchQueries({ type: 'active' })
    setStatus({ type: 'success', message: 'Live data loading from your Laravel URL.' })
    if (goDashboard) navigate('/')
  }

  const testConnection = async () => {
    setTesting(true)
    setStatus(null)
    saveOverrides({
      apiUrl: form.apiUrl.replace(/\/$/, ''),
    })
    try {
      await apiClient.get('/auth/authcheck')
      setStatus({ type: 'success', message: 'Connected to Laravel API.' })
    } catch (err) {
      setStatus({ type: 'error', message: getErrorMessage(err, 'Connection failed') })
    } finally {
      setTesting(false)
    }
  }

  const handleReset = async () => {
    const next = resetOverrides()
    setForm({
      apiUrl: next.apiUrl,
      echoEnabled: next.echoEnabled,
    })
    await queryClient.invalidateQueries()
    setStatus({ type: 'success', message: 'Reset to .env defaults.' })
  }

  const envFileSnippet = `# analytics/.env
VITE_API_URL=${form.apiUrl}
VITE_ECHO_ENABLED=${form.echoEnabled}
VITE_LICENSE_KEY=${licenseHint ? '(set in .env)' : 'same-as-server-VITE_API_KEY'}`

  return (
    <div className="space-y-6 max-w-2xl">
      <Card glass>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Environment</CardTitle>
              <CardDescription>
                Dashboard always uses live Laravel data. Change URL here to point at another store.
              </CardDescription>
            </div>
            <Badge variant={config.isDev ? 'success' : 'outline'}>{config.mode}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {ENV_FIELD_META.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <p className="text-xs text-muted-foreground">{field.description}</p>
              {field.type === 'url' ? (
                <Input
                  id={field.key}
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                />
              ) : (
                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <span className="text-sm">{field.label}</span>
                  <Switch
                    checked={form[field.key]}
                    onCheckedChange={(checked) =>
                      setForm((f) => ({ ...f, [field.key]: checked }))
                    }
                  />
                </div>
              )}
            </div>
          ))}

          <div className="space-y-2">
            <Label>VITE_LICENSE_KEY</Label>
            <p className="text-xs text-muted-foreground">
              Set in <code>analytics/.env</code> — restart <code>npm run dev</code> after changes.
            </p>
            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm font-mono">
              {licenseHint ? `Loaded: ${licenseHint}` : 'Not loaded — check .env and restart dev server'}
            </div>
          </div>

          <Separator />

          <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
            <p className="font-medium">Active API</p>
            <code className="text-xs break-all block">{getApiBaseUrl()}</code>
            <p className="text-xs text-muted-foreground">Live → {form.apiUrl}</p>
          </div>

          {status && (
            <div
              className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
                status.type === 'error'
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {status.type === 'error' ? (
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              {status.message}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="gradient" onClick={() => applyNow(false)}>
              <Zap className="h-4 w-4 mr-2" />
              Apply now
            </Button>
            <Button variant="secondary" onClick={() => applyNow(true)}>
              Apply & open dashboard
            </Button>
            <Button variant="outline" onClick={testConnection} disabled={testing}>
              {testing ? 'Testing…' : 'Test connection'}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card glass>
        <CardHeader>
          <CardTitle className="text-base">.env template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto font-mono">{envFileSnippet}</pre>
          <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(envFileSnippet)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
