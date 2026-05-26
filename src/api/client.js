import axios from 'axios'
import { STORAGE_KEYS } from '@/utils/constants'
import { getApiBaseUrl, getRuntimeApiKey } from '@/utils/envConfig'

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 30000,
})

apiClient.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl()
  const apiKey = getRuntimeApiKey()
  if (apiKey) {
    config.headers['x-api-key'] = apiKey
  }
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['x-localization'] = 'en'
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

function extractApiMessage(data) {
  if (!data) return null
  if (typeof data === 'string') return data
  if (data.message) return String(data.message)
  if (data.errors) {
    if (typeof data.errors === 'string') return data.errors
    if (data.errors.validation) return String(data.errors.validation)
    const flat = Object.values(data.errors).flat()
    if (flat[0]) return String(flat[0])
  }
  return null
}

export function unwrap(response) {
  const body = response?.data
  if (typeof body === 'string' && /^\s*<!DOCTYPE/i.test(body)) {
    throw new Error('Server returned HTML instead of JSON. Check API URL and routes.')
  }
  if (body?.success === false) {
    throw new Error(body?.message || 'Request failed')
  }
  return body?.data ?? body
}

export function getErrorMessage(error, fallback = 'Something went wrong') {
  const status = error?.response?.status
  const data = error?.response?.data
  const msg = extractApiMessage(data) || error?.message || fallback
  const isLicenseError =
    status === 400 &&
    (/api.?key|license|invalid/i.test(String(msg)) ||
      !getRuntimeApiKey())

  if (status === 401) return `${msg} (Please sign in again.)`
  if (isLicenseError) {
    return `${msg} — Set VITE_LICENSE_KEY in analytics/.env to match that server's VITE_API_KEY, then restart npm run dev.`
  }
  return status ? `${msg} (HTTP ${status})` : msg
}
