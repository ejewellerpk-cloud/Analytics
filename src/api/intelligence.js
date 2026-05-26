import { apiClient, unwrap } from './client'

const base = '/admin/intelligence'

export async function fetchSites() {
  const res = await apiClient.get(`${base}/sites`)
  return { data: unwrap(res), meta: res.data?.meta }
}

export async function fetchOverview({ siteId, from, to }) {
  const res = await apiClient.get(`${base}/overview`, {
    params: { site_id: siteId, from, to },
  })
  return unwrap(res)
}

export async function fetchRealtime({ siteId }) {
  const res = await apiClient.get(`${base}/realtime`, {
    params: { site_id: siteId },
  })
  return unwrap(res)
}

export async function fetchFunnel({ siteId, from, to }) {
  const res = await apiClient.get(`${base}/funnel`, {
    params: { site_id: siteId, from, to },
  })
  return unwrap(res)
}

export async function fetchSources({ siteId, from, to }) {
  const res = await apiClient.get(`${base}/sources`, {
    params: { site_id: siteId, from, to },
  })
  return unwrap(res)
}

export async function fetchTopProducts({ siteId, from, to }) {
  const res = await apiClient.get(`${base}/products`, {
    params: { site_id: siteId, from, to },
  })
  return unwrap(res)
}

export async function fetchDailySeries({ siteId, from, to }) {
  const res = await apiClient.get(`${base}/daily-series`, {
    params: { site_id: siteId, from, to },
  })
  return unwrap(res)
}

export async function fetchProductCatalog({ siteId, from, to, search }) {
  const res = await apiClient.get(`${base}/products/catalog`, {
    params: { site_id: siteId, from, to, search: search || undefined },
  })
  return unwrap(res)
}

export async function fetchProductInsights({ siteId, from, to, productId }) {
  const res = await apiClient.get(`${base}/products/${productId}/insights`, {
    params: { site_id: siteId, from, to },
  })
  return unwrap(res)
}
