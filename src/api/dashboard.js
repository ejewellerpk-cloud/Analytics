import { apiClient } from './client'

const base = '/admin/dashboard'

async function get(path) {
  const { data } = await apiClient.get(`${base}${path}`)
  return data?.data ?? data
}

export const dashboardApi = {
  totalSales: () => get('/total-sales'),
  totalOrders: () => get('/total-orders'),
  totalCustomers: () => get('/total-customers'),
  totalProducts: () => get('/total-products'),
  orderStatistics: () => get('/order-statistics'),
  salesSummary: () => get('/sales-summary'),
  orderSummary: () => get('/order-summary'),
  customerStates: () => get('/customer-states'),
  topCustomers: () => get('/top-customers'),
  topProducts: () => get('/top-products'),
  activeUsers: () => get('/active-users'),
}
