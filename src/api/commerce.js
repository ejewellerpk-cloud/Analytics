import { apiClient, unwrap } from './client'

const commerce = '/admin/intelligence/commerce'
const intelligence = '/admin/intelligence'

function q({ siteId, from, to, ...rest }) {
  return { site_id: siteId, from, to, ...rest }
}

export async function fetchCommerceTotals() {
  const res = await apiClient.get(`${commerce}/totals`)
  return unwrap(res)
}

export async function fetchOrderStatistics(params) {
  const res = await apiClient.get(`${commerce}/order-statistics`, { params: q(params) })
  return unwrap(res)
}

export async function fetchSalesSummary(params) {
  const res = await apiClient.get(`${commerce}/sales-summary`, { params: q(params) })
  return unwrap(res)
}

export async function fetchOrderSummary(params) {
  const res = await apiClient.get(`${commerce}/order-summary`, { params: q(params) })
  return unwrap(res)
}

export async function fetchCustomerActivity(params) {
  const res = await apiClient.get(`${commerce}/customer-activity`, { params: q(params) })
  return unwrap(res)
}

export async function fetchTopCustomers() {
  const res = await apiClient.get(`${commerce}/top-customers`)
  return unwrap(res)
}

export async function fetchTopSellingProducts() {
  const res = await apiClient.get(`${commerce}/top-selling-products`)
  return unwrap(res)
}

export async function fetchLowStock() {
  const res = await apiClient.get(`${commerce}/low-stock`)
  return unwrap(res)
}

export async function fetchCartInsights(params) {
  const res = await apiClient.get(`${commerce}/cart-insights`, { params: q(params) })
  return unwrap(res)
}

export async function fetchRecentOrders(params = {}) {
  const res = await apiClient.get(`${commerce}/recent-orders`, {
    params: { site_id: params.siteId, limit: params.limit ?? 20 },
  })
  return unwrap(res)
}

export async function fetchIntelligenceSettings() {
  const res = await apiClient.get(`${intelligence}/settings`)
  return unwrap(res)
}

export async function fetchRoles() {
  const res = await apiClient.get(`${intelligence}/roles`)
  return unwrap(res)
}

export async function downloadAnalyticsExport(params) {
  const response = await apiClient.get(`${intelligence}/export`, {
    params: q(params),
    responseType: 'blob',
  })
  const blob = new Blob([response.data], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `analytics-${params.from}-to-${params.to}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}
