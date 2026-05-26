import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as enterprise from '@/api/enterprise'
import { useAnalyticsContext } from '@/contexts/AnalyticsContext'

export function useEnterpriseFeatures() {
  return useQuery({
    queryKey: ['enterprise-features'],
    queryFn: () => enterprise.fetchEnterpriseFeatures(),
    staleTime: 10 * 60 * 1000,
  })
}

export function useHeatmapPages(device) {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['heatmap-pages', params, device],
    queryFn: () => enterprise.fetchHeatmapPages({ ...params, device }),
    enabled: Boolean(params.siteId),
  })
}

export function useHeatmapSnapshot(pagePath, type, device) {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['heatmap-snapshot', params, pagePath, type, device],
    queryFn: () =>
      enterprise.fetchHeatmapSnapshot({
        ...params,
        page_path: pagePath,
        type,
        device,
      }),
    enabled: Boolean(params.siteId && pagePath),
  })
}

export function useAiInsights() {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['ai-insights', params],
    queryFn: () => enterprise.fetchAiInsights(params),
    enabled: Boolean(params.siteId),
  })
}

export function useGenerateInsights() {
  const qc = useQueryClient()
  const { params } = useAnalyticsContext()
  return useMutation({
    mutationFn: () => enterprise.generateAiInsights(params),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ai-insights'] }),
  })
}

export function useReplaySessions() {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['replay-sessions', params],
    queryFn: () => enterprise.fetchReplaySessions(params),
    enabled: Boolean(params.siteId),
  })
}

export function useSegments() {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['segments', params],
    queryFn: () => enterprise.fetchSegments(params),
    enabled: Boolean(params.siteId),
  })
}

export function useExperiments() {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['experiments', params],
    queryFn: () => enterprise.fetchExperiments(params),
    enabled: Boolean(params.siteId),
  })
}

export function useAttribution(model = 'last_click') {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['attribution', params, model],
    queryFn: () => enterprise.fetchAttribution({ ...params, model }),
    enabled: Boolean(params.siteId),
  })
}
