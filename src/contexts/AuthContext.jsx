import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { login as apiLogin, logout as apiLogout } from '@/api/auth'
import { getErrorMessage } from '@/api/client'
import { STORAGE_KEYS } from '@/utils/constants'
import { normalizeRole } from '@/utils/roles'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isAuthenticated = Boolean(token && user)

  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiLogin(credentials)
      const authToken = data.token
      const authUser = {
        ...data.user,
        role_name: data.user?.role_name || data.user?.roles?.[0]?.name,
      }
      localStorage.setItem(STORAGE_KEYS.TOKEN, authToken)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authUser))
      setToken(authToken)
      setUser(authUser)
      return data
    } catch (err) {
      const msg = getErrorMessage(err, 'Login failed')
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await apiLogout()
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      setToken(null)
      setUser(null)
      setLoading(false)
    }
  }, [])

  const role = useMemo(() => normalizeRole(user), [user])

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      loading,
      error,
      isAuthenticated,
      login,
      logout,
      setError,
    }),
    [user, token, role, loading, error, isAuthenticated, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
