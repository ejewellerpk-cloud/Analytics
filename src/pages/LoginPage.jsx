import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { BarChart3, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useEnvConfig } from '@/contexts/EnvConfigContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getApiBaseUrl, getLicenseKeyHint } from '@/utils/envConfig'

export function LoginPage() {
  const { login, loading, error, isAuthenticated, setError } = useAuth()
  const { config, saveOverrides } = useEnvConfig()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [apiUrl, setApiUrl] = useState(config.apiUrl || 'https://ejeweller.pk')

  const licenseHint = getLicenseKeyHint()

  if (isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    saveOverrides({
      apiUrl: apiUrl.replace(/\/$/, ''),
    })
    try {
      await login({ email, password })
      navigate('/')
    } catch {
      /* error set in context */
    }
  }

  return (
    <Card glass className="border-border/50 shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground lg:hidden">
          <BarChart3 className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to Shopperzz Analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">Shop URL (optional)</Label>
            <Input
              id="apiUrl"
              type="url"
              placeholder="https://ejeweller.pk"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Default from <code className="text-[10px]">.env</code> — change only for another server.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@ejeweller.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive rounded-lg bg-destructive/10 p-3" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground break-all">
          API: {getApiBaseUrl()}
          {licenseHint ? (
            <span className="block mt-1">License: {licenseHint}</span>
          ) : (
            <span className="block text-destructive mt-1">
              Missing VITE_LICENSE_KEY — edit analytics/.env and restart npm run dev.
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
