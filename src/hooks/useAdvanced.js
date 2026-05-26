import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as advanced from '@/api/advanced'
import { useAnalyticsContext } from '@/contexts/AnalyticsContext'
import { getEnvConfig } from '@/utils/envConfig'

const envKey = () => [getEnvConfig().apiUrl]

function useParams() {
  const { params } = useAnalyticsContext()
  return params
}

export function useCohortRetention() {
  return useQuery({ queryKey: ['adv-cohort', ...envKey()], queryFn: advanced.fetchCohortRetention })
}

export function useRfm() {
  return useQuery({ queryKey: ['adv-rfm', ...envKey()], queryFn: advanced.fetchRfm })
}

export function useProductAffinity() {
  return useQuery({ queryKey: ['adv-affinity', ...envKey()], queryFn: () => advanced.fetchProductAffinity({ limit: 20 }) })
}

export function usePayments() {
  const params = useParams()
  return useQuery({
    queryKey: ['adv-payments', params, ...envKey()],
    queryFn: () => advanced.fetchPayments(params),
    enabled: Boolean(params.from && params.to),
  })
}

export function useReturns() {
  const params = useParams()
  return useQuery({
    queryKey: ['adv-returns', params, ...envKey()],
    queryFn: () => advanced.fetchReturns(params),
    enabled: Boolean(params.from && params.to),
  })
}

export function useGeoDevice() {
  const params = useParams()
  return useQuery({
    queryKey: ['adv-geo', params, ...envKey()],
    queryFn: () => advanced.fetchGeoDevice(params),
    enabled: Boolean(params.siteId),
  })
}

export function useHourlyHeatmap() {
  const params = useParams()
  return useQuery({
    queryKey: ['adv-heatmap', params, ...envKey()],
    queryFn: () => advanced.fetchHourlyHeatmap(params),
    enabled: Boolean(params.from && params.to),
  })
}

export function useInventoryForecast() {
  return useQuery({ queryKey: ['adv-inventory', ...envKey()], queryFn: advanced.fetchInventoryForecast })
}

export function useMultiStoreCompare() {
  const params = useParams()
  return useQuery({
    queryKey: ['adv-multistore', params, ...envKey()],
    queryFn: () => advanced.fetchMultiStoreCompare(params),
    enabled: Boolean(params.from && params.to),
  })
}

export function useReportSchedule() {
  return useQuery({ queryKey: ['adv-schedule', ...envKey()], queryFn: advanced.fetchReportSchedule })
}

export function useSaveReportSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: advanced.saveReportSchedule,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adv-schedule'] }),
  })
}
