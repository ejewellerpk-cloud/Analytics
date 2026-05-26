import { useQuery } from '@tanstack/react-query'
import * as intelligence from '@/api/intelligence'
import { useAnalyticsContext } from '@/contexts/AnalyticsContext'
import { getEnvConfig } from '@/utils/envConfig'

const envKey = () => {
  const e = getEnvConfig()
  return [e.apiUrl]
}

export function useSites() {
  const { setSites, setSiteId } = useAnalyticsContext()

  return useQuery({
    queryKey: ['sites', ...envKey()],
    queryFn: async () => {
      const result = await intelligence.fetchSites()
      setSites(result.data)
      if (result.meta?.default_site_id) setSiteId(result.meta.default_site_id)
      return result
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useOverview() {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['overview', params, ...envKey()],
    queryFn: () =>
      intelligence.fetchOverview({
        siteId: params.siteId,
        from: params.from,
        to: params.to,
      }),
    enabled: Boolean(params.siteId),
  })
}

export function useRealtime(pollMs = 15000) {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['realtime', params.siteId, ...envKey()],
    queryFn: () => intelligence.fetchRealtime({ siteId: params.siteId }),
    enabled: Boolean(params.siteId),
    refetchInterval: pollMs,
  })
}

export function useFunnel() {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['funnel', params, ...envKey()],
    queryFn: () =>
      intelligence.fetchFunnel({
        siteId: params.siteId,
        from: params.from,
        to: params.to,
      }),
    enabled: Boolean(params.siteId),
  })
}

export function useSources() {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['sources', params, ...envKey()],
    queryFn: () =>
      intelligence.fetchSources({
        siteId: params.siteId,
        from: params.from,
        to: params.to,
      }),
    enabled: Boolean(params.siteId),
  })
}

export function useTopProducts() {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['products', params, ...envKey()],
    queryFn: () =>
      intelligence.fetchTopProducts({
        siteId: params.siteId,
        from: params.from,
        to: params.to,
      }),
    enabled: Boolean(params.siteId),
  })
}

export function useProductCatalog(search = '') {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['product-catalog', params, search, ...envKey()],
    queryFn: () =>
      intelligence.fetchProductCatalog({
        siteId: params.siteId,
        from: params.from,
        to: params.to,
        search,
      }),
    enabled: Boolean(params.siteId && params.from && params.to),
  })
}

export function useProductInsights(productId) {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['product-insights', productId, params, ...envKey()],
    queryFn: () =>
      intelligence.fetchProductInsights({
        siteId: params.siteId,
        from: params.from,
        to: params.to,
        productId,
      }),
    enabled: Boolean(params.siteId && productId),
  })
}

export function useDailySeries() {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['daily-series', params, ...envKey()],
    queryFn: () =>
      intelligence.fetchDailySeries({
        siteId: params.siteId,
        from: params.from,
        to: params.to,
      }),
    enabled: Boolean(params.siteId && params.from && params.to),
  })
}
