import { apiClient, unwrap } from './client'

const base = '/admin/intelligence/enterprise'

function q({ siteId, from, to, ...rest }) {
  return { site_id: siteId, from, to, ...rest }
}

export const fetchEnterpriseFeatures = () =>
  apiClient.get(`${base}/features`).then((r) => unwrap(r))

export const fetchHeatmapPages = (params) =>
  apiClient.get(`${base}/heatmaps/pages`, { params: q(params) }).then((r) => unwrap(r))

export const fetchHeatmapSnapshot = (params) =>
  apiClient.get(`${base}/heatmaps/snapshot`, { params: q(params) }).then((r) => unwrap(r))

export const fetchReplaySessions = (params) =>
  apiClient.get(`${base}/replay/sessions`, { params: q(params) }).then((r) => unwrap(r))

export const fetchAiInsights = (params) =>
  apiClient.get(`${base}/insights`, { params: q(params) }).then((r) => unwrap(r))

export const generateAiInsights = (params) =>
  apiClient.post(`${base}/insights/generate`, null, { params: q(params) }).then((r) => unwrap(r))

export const dismissInsight = (id, params) =>
  apiClient.patch(`${base}/insights/${id}/dismiss`, null, { params: q(params) }).then((r) => unwrap(r))

export const fetchJourneyVisitor = (visitorUuid, params) =>
  apiClient.get(`${base}/journey/visitors/${visitorUuid}`, { params: q(params) }).then((r) => unwrap(r))

export const fetchSegments = (params) =>
  apiClient.get(`${base}/segments`, { params: q(params) }).then((r) => unwrap(r))

export const fetchExperiments = (params) =>
  apiClient.get(`${base}/experiments`, { params: q(params) }).then((r) => unwrap(r))

export const fetchAttribution = (params) =>
  apiClient.get(`${base}/attribution`, { params: q(params) }).then((r) => unwrap(r))

export const fetchAlertRules = (params) =>
  apiClient.get(`${base}/alerts/rules`, { params: q(params) }).then((r) => unwrap(r))

export const fetchBillingPlans = () =>
  apiClient.get(`${base}/billing/plans`).then((r) => unwrap(r))
