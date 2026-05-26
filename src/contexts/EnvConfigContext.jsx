import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  getEnvConfig,
  saveEnvOverrides as persistEnvOverrides,
  resetEnvOverrides as persistReset,
} from '@/utils/envConfig'

const EnvConfigContext = createContext(null)

export function EnvConfigProvider({ children }) {
  const [config, setConfig] = useState(() => getEnvConfig())

  const refresh = useCallback(() => {
    const next = getEnvConfig()
    setConfig(next)
    window.dispatchEvent(new CustomEvent('sz-env-updated', { detail: next }))
    return next
  }, [])

  const saveOverrides = useCallback(
    (partial) => {
      persistEnvOverrides(partial)
      return refresh()
    },
    [refresh],
  )

  const resetOverrides = useCallback(() => {
    persistReset()
    return refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      config,
      refresh,
      saveOverrides,
      resetOverrides,
    }),
    [config, refresh, saveOverrides, resetOverrides],
  )

  return <EnvConfigContext.Provider value={value}>{children}</EnvConfigContext.Provider>
}

export function useEnvConfig() {
  const ctx = useContext(EnvConfigContext)
  if (!ctx) throw new Error('useEnvConfig must be used within EnvConfigProvider')
  return ctx
}
