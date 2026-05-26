import { STORAGE_KEYS } from './constants'

/** Strip quotes/spaces — must match shopperzz .env VITE_API_KEY exactly */
export function normalizeApiKey(value) {
  if (value == null || value === '') return ''
  return String(value).trim().replace(/^["']|["']$/g, '')
}

const DEFAULTS = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  echoEnabled: import.meta.env.VITE_ECHO_ENABLED === 'true',
  laravelApiKey: normalizeApiKey(import.meta.env.VITE_LICENSE_KEY || ''),
}

function readOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENV_CONFIG)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      let dirty = false
      if ('laravelApiKey' in parsed) {
        delete parsed.laravelApiKey
        dirty = true
      }
      if ('useMock' in parsed) {
        delete parsed.useMock
        dirty = true
      }
      if (dirty) {
        if (Object.keys(parsed).length === 0) {
          localStorage.removeItem(STORAGE_KEYS.ENV_CONFIG)
        } else {
          localStorage.setItem(STORAGE_KEYS.ENV_CONFIG, JSON.stringify(parsed))
        }
      }
    }
    return parsed || {}
  } catch {
    return {}
  }
}

/** Merged config: build-time .env + browser overrides (Settings → Environment) */
export function getEnvConfig() {
  const overrides = readOverrides()
  return {
    apiUrl: (overrides.apiUrl ?? DEFAULTS.apiUrl).replace(/\/$/, ''),
    echoEnabled: overrides.echoEnabled ?? DEFAULTS.echoEnabled,
    laravelApiKey: DEFAULTS.laravelApiKey,
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE,
    buildApiUrl: DEFAULTS.apiUrl.replace(/\/$/, ''),
    buildEchoEnabled: DEFAULTS.echoEnabled,
    hasOverrides: Object.keys(readOverrides()).length > 0,
  }
}

export function saveEnvOverrides(partial) {
  const current = readOverrides()
  const next = { ...current, ...partial }
  delete next.laravelApiKey
  delete next.useMock
  Object.keys(next).forEach((key) => {
    if (next[key] === undefined) delete next[key]
  })
  if (Object.keys(next).length === 0) {
    localStorage.removeItem(STORAGE_KEYS.ENV_CONFIG)
  } else {
    localStorage.setItem(STORAGE_KEYS.ENV_CONFIG, JSON.stringify(next))
  }
  return getEnvConfig()
}

export function resetEnvOverrides() {
  localStorage.removeItem(STORAGE_KEYS.ENV_CONFIG)
  return getEnvConfig()
}

export function getApiBaseUrl() {
  const { apiUrl, isDev } = getEnvConfig()
  // Local dev: use Vite proxy (/api → VITE_API_URL) to avoid CORS and route mismatches
  if (isDev && import.meta.env.VITE_DEV_USE_PROXY === 'true') {
    return '/api'
  }
  return `${apiUrl}/api`
}

export function getRuntimeApiKey() {
  return DEFAULTS.laravelApiKey
}

export function getLicenseKeyHint() {
  const key = DEFAULTS.laravelApiKey
  if (!key) return null
  return key.length <= 8 ? '••••' : `${key.slice(0, 4)}…${key.slice(-4)}`
}

export const ENV_FIELD_META = [
  {
    key: 'apiUrl',
    label: 'VITE_API_URL',
    description: 'Laravel shop URL — dashboard loads live data from this server.',
    type: 'url',
    placeholder: 'https://ejeweller.pk',
  },
  {
    key: 'echoEnabled',
    label: 'VITE_ECHO_ENABLED',
    description: 'Enable Laravel Echo / Pusher for live analytics.',
    type: 'boolean',
  },
]
