import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, AlertCircle, Link2, Loader2, Plug } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEnvConfig } from '@/contexts/EnvConfigContext'
import { parseConnectionCode } from '@/utils/connectionCode'
import { apiClient, getErrorMessage } from '@/api/client'
import { isShopConnected } from '@/utils/envConfig'
import { useAuth } from '@/contexts/AuthContext'

export function ConnectPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { saveOverrides, refresh } = useEnvConfig()
  const { isAuthenticated } = useAuth()

  const reconnect = searchParams.get('reconnect') === '1'
  const [code, setCode] = useState('')
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const [connected, setConnected] = useState(() => isShopConnected())

  useEffect(() => {
    const fromQuery = searchParams.get('code')
    if (fromQuery) {
      setCode(fromQuery)
      void applyFromCode(fromQuery, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (connected && isAuthenticated && !reconnect) {
    return <Navigate to="/" replace />
  }

  const applyFromCode = async (raw, auto = false) => {
    setBusy(true)
    setStatus(null)
    try {
      const parsed = parseConnectionCode(raw)
      saveOverrides({
        apiUrl: parsed.shop,
        laravelApiKey: parsed.key,
      })
      refresh()
      await ping()
      setConnected(true)
      if (isAuthenticated) {
        setStatus({ type: 'success', message: 'Shop updated. Opening dashboard…' })
        setTimeout(() => navigate('/settings/shop', { replace: true }), auto ? 400 : 200)
      } else {
        setStatus({
          type: 'success',
          message: 'Shop connected. Sign in with your admin email & password.',
        })
        setTimeout(() => navigate('/login', { replace: true }), auto ? 600 : 300)
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || getErrorMessage(err, 'Could not connect'),
      })
    } finally {
      setBusy(false)
    }
  }

  const ping = async () => {
    try {
      await apiClient.get('/auth/authcheck')
    } catch (err) {
      if (!err.response) {
        throw new Error(
          getErrorMessage(err, 'Could not reach shop. Check that the code is fresh and the shop is online.'),
        )
      }
      if (err.response.status >= 500) {
        throw new Error(getErrorMessage(err, 'Shop API error'))
      }
      // 401 = API + license OK, just not logged in yet
    }
  }

  return (
    <Card glass className="border-border/50 shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Plug className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl">{reconnect ? 'Reconnect shop' : 'Connect your shop'}</CardTitle>
        <CardDescription>
          Shop Admin → Settings → Intelligence Keys → copy <strong>Connect key</strong> (
          <code className="text-xs">sz1.…</code>). Not <code className="text-xs">pk_</code> /{' '}
          <code className="text-xs">sk_</code>.
          <span className="mt-2 block text-muted-foreground">
            Incognito / new browser always asks for this key (nothing is saved). Normal browser
            remembers after one connect — only login next time.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
          <strong>sk_…</strong> = Secret key (tracker only). <strong>sz1.…</strong> = Dashboard Connect key.
        </div>
        <div className="space-y-3">
          <label htmlFor="connCode" className="text-sm font-medium leading-none">
            Connect key (sz1.…)
          </label>
          <textarea
            id="connCode"
            rows={4}
            placeholder="sz1.eyJ2IjoxLCJzaG9wIjoiaHR0cHM6Ly9..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex min-h-[96px] w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            autoFocus
          />
          <Button
            variant="gradient"
            className="w-full"
            disabled={busy || !code.trim()}
            onClick={() => applyFromCode(code)}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                Connect &amp; continue
              </>
            )}
          </Button>
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

        {connected && (
          <p className="text-center text-sm">
            <Link to="/login" className="text-primary font-medium hover:underline">
              Continue to sign in
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
