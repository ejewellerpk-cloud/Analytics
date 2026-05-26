import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { STORAGE_KEYS } from '@/utils/constants'
import { parseStoredRange } from '@/utils/dateRange'

const AnalyticsContext = createContext(null)

export function AnalyticsProvider({ children }) {
  const [sites, setSites] = useState([])
  const [siteId, setSiteIdState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SITE_ID)
    return stored ? Number(stored) : null
  })

  const [dateRange, setDateRangeState] = useState(() =>
    parseStoredRange(localStorage.getItem(STORAGE_KEYS.DATE_RANGE)),
  )

  const setSiteId = useCallback((id) => {
    const num = Number(id) || null
    setSiteIdState(num)
    if (num) localStorage.setItem(STORAGE_KEYS.SITE_ID, String(num))
  }, [])

  const setDateRange = useCallback((range) => {
    setDateRangeState(range)
    localStorage.setItem(STORAGE_KEYS.DATE_RANGE, JSON.stringify(range))
  }, [])

  const activeSite = useMemo(
    () => sites.find((s) => s.id === siteId) || sites[0] || null,
    [sites, siteId],
  )

  const value = useMemo(
    () => ({
      sites,
      setSites,
      siteId: siteId || activeSite?.id,
      setSiteId,
      activeSite,
      dateRange,
      setDateRange,
      params: {
        siteId: siteId || activeSite?.id,
        from: dateRange.from,
        to: dateRange.to,
      },
    }),
    [sites, siteId, setSiteId, activeSite, dateRange, setDateRange],
  )

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>
}

export function useAnalyticsContext() {
  const ctx = useContext(AnalyticsContext)
  if (!ctx) throw new Error('useAnalyticsContext must be used within AnalyticsProvider')
  return ctx
}
