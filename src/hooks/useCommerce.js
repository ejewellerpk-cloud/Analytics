import { useQuery } from '@tanstack/react-query'
import * as commerce from '@/api/commerce'
import { useAnalyticsContext } from '@/contexts/AnalyticsContext'
import { getEnvConfig } from '@/utils/envConfig'

const envKey = () => [getEnvConfig().apiUrl]

export function useCommerceTotals() {
  return useQuery({
    queryKey: ['commerce-totals', ...envKey()],
    queryFn: () => commerce.fetchCommerceTotals(),
    staleTime: 60_000,
  })
}

export function useOrderStatistics() {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['order-statistics', params, ...envKey()],
    queryFn: () => commerce.fetchOrderStatistics(params),
    enabled: Boolean(params.from && params.to),
  })
}

export function useSalesSummary() {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['sales-summary', params, ...envKey()],
    queryFn: () => commerce.fetchSalesSummary(params),
    enabled: Boolean(params.from && params.to),
  })
}

export function useOrderSummary() {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['order-summary', params, ...envKey()],
    queryFn: () => commerce.fetchOrderSummary(params),
    enabled: Boolean(params.from && params.to),
  })
}

export function useCustomerActivity() {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['customer-activity', params, ...envKey()],
    queryFn: () => commerce.fetchCustomerActivity(params),
    enabled: Boolean(params.from && params.to),
  })
}

export function useTopCustomers() {
  return useQuery({
    queryKey: ['top-customers', ...envKey()],
    queryFn: () => commerce.fetchTopCustomers(),
  })
}

export function useTopSellingProducts() {
  return useQuery({
    queryKey: ['top-selling-products', ...envKey()],
    queryFn: () => commerce.fetchTopSellingProducts(),
  })
}

export function useLowStock() {
  return useQuery({
    queryKey: ['low-stock', ...envKey()],
    queryFn: () => commerce.fetchLowStock(),
  })
}

export function useCartInsights() {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['cart-insights', params, ...envKey()],
    queryFn: () => commerce.fetchCartInsights(params),
    enabled: Boolean(params.siteId),
  })
}

export function useRecentOrders(limit = 20) {
  const { params } = useAnalyticsContext()
  return useQuery({
    queryKey: ['recent-orders', params.siteId, limit, ...envKey()],
    queryFn: () => commerce.fetchRecentOrders({ siteId: params.siteId, limit }),
    refetchInterval: 30_000,
  })
}

export function useIntelligenceSettings() {
  return useQuery({
    queryKey: ['intelligence-settings', ...envKey()],
    queryFn: () => commerce.fetchIntelligenceSettings(),
  })
}

export function useRoles() {
  return useQuery({
    queryKey: ['roles', ...envKey()],
    queryFn: () => commerce.fetchRoles(),
  })
}
