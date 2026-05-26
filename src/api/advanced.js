import { apiClient, unwrap } from './client'

const base = '/admin/intelligence/advanced'

function q({ siteId, from, to, ...rest }) {
  return { site_id: siteId, from, to, ...rest }
}

export const fetchCohortRetention = () =>
  apiClient.get(`${base}/cohort-retention`).then((r) => unwrap(r))

export const fetchRfm = () => apiClient.get(`${base}/rfm`).then((r) => unwrap(r))

export const fetchProductAffinity = (params) =>
  apiClient.get(`${base}/product-affinity`, { params }).then((r) => unwrap(r))

export const fetchPayments = (params) =>
  apiClient.get(`${base}/payments`, { params: q(params) }).then((r) => unwrap(r))

export const fetchReturns = (params) =>
  apiClient.get(`${base}/returns`, { params: q(params) }).then((r) => unwrap(r))

export const fetchGeoDevice = (params) =>
  apiClient.get(`${base}/geo-device`, { params: q(params) }).then((r) => unwrap(r))

export const fetchHourlyHeatmap = (params) =>
  apiClient.get(`${base}/hourly-heatmap`, { params: q(params) }).then((r) => unwrap(r))

export const fetchInventoryForecast = () =>
  apiClient.get(`${base}/inventory-forecast`).then((r) => unwrap(r))

export const fetchMultiStoreCompare = (params) =>
  apiClient.get(`${base}/multi-store-compare`, { params: q(params) }).then((r) => unwrap(r))

export const fetchReportSchedule = () =>
  apiClient.get(`${base}/report-schedule`).then((r) => unwrap(r))

export const saveReportSchedule = (body) =>
  apiClient.post(`${base}/report-schedule`, body).then((r) => unwrap(r))

export async function sendReportNow(params) {
  const response = await apiClient.get(`${base}/report-send-now`, {
    params: q(params),
    responseType: 'blob',
  })
  const blob = new Blob([response.data], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `analytics-advanced-${params.from}-to-${params.to}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}
