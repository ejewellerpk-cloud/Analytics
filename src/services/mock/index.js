import { subDays, format } from 'date-fns'

const today = new Date()

function series(days, fn) {
  return Array.from({ length: days }, (_, i) => {
    const d = subDays(today, days - 1 - i)
    return { date: format(d, 'yyyy-MM-dd'), ...fn(i, d) }
  })
}

export const mockSites = {
  data: [{ id: 1, name: 'Shopperzz Store', domain: 'shopperzz.test', public_key: 'pk_demo', is_active: true }],
  meta: {
    default_site_id: 1,
    server_today: format(today, 'yyyy-MM-dd'),
    default_from: format(subDays(today, 6), 'yyyy-MM-dd'),
    default_to: format(today, 'yyyy-MM-dd'),
  },
}

export const mockRealtime = {
  active_visitors: 47,
  page_views_today: 1823,
  orders_today: 34,
  add_to_carts_today: 128,
  top_pages: [
    { label: '/products', value: 412 },
    { label: '/', value: 380 },
    { label: '/checkout', value: 95 },
  ],
  top_sources: [
    { label: 'google', value: 520 },
    { label: 'facebook', value: 310 },
    { label: 'direct', value: 280 },
  ],
  updated_at: new Date().toISOString(),
}

export const mockOverview = {
  visitors: 12480,
  sessions: 15820,
  page_views: 42350,
  orders: 892,
  revenue: 128450,
  bounce_rate: 42.5,
  conversion_rate: 5.64,
  realtime: mockRealtime,
}

export const mockFunnel = [
  { step: 'Homepage / Pages', count: 42350, conversion_pct: 100 },
  { step: 'Category', count: 18200, conversion_pct: 42.98 },
  { step: 'Product', count: 12400, conversion_pct: 29.28 },
  { step: 'Cart', count: 3200, conversion_pct: 7.56 },
  { step: 'Checkout', count: 1450, conversion_pct: 3.42 },
  { step: 'Order', count: 892, conversion_pct: 2.11 },
]

export const mockSources = [
  { source: 'google', sessions: 5200 },
  { source: 'facebook', sessions: 3100 },
  { source: 'instagram', sessions: 1800 },
  { source: 'direct', sessions: 4200 },
  { source: 'email', sessions: 920 },
]

export const mockProducts = [
  { product_id: 1, name: 'Wireless Headphones Pro', views: 2840 },
  { product_id: 2, name: 'Smart Watch Series X', views: 2210 },
  { product_id: 3, name: 'Organic Cotton Tee', views: 1890 },
  { product_id: 4, name: 'Leather Crossbody Bag', views: 1560 },
  { product_id: 5, name: 'Running Shoes Elite', views: 1420 },
]

export const mockChartSeries = series(14, (i) => ({
  revenue: 8000 + Math.round(Math.random() * 4000 + i * 200),
  orders: 40 + Math.round(Math.random() * 30 + i * 2),
  visitors: 600 + Math.round(Math.random() * 200 + i * 15),
  conversion: 3 + Math.random() * 2,
  profit: 5000 + Math.round(Math.random() * 2500 + i * 150),
}))

export const mockKpis = {
  revenue: { value: 128450, change: 12.4 },
  orders: { value: 892, change: 8.2 },
  visitors: { value: 12480, change: 15.6 },
  conversion: { value: 5.64, change: -0.8 },
  profit: { value: 48200, change: 9.1 },
  returning: { value: 34.2, change: 2.3 },
}

export const mockOrdersAnalytics = {
  statusBreakdown: [
    { status: 'Completed', count: 620, pct: 69.5 },
    { status: 'Processing', count: 142, pct: 15.9 },
    { status: 'Pending', count: 78, pct: 8.7 },
    { status: 'Cancelled', count: 52, pct: 5.9 },
  ],
  paymentMethods: [
    { method: 'Card', count: 520, pct: 58.3 },
    { method: 'COD', count: 248, pct: 27.8 },
    { method: 'Wallet', count: 124, pct: 13.9 },
  ],
  refunds: { count: 28, amount: 3420, rate: 3.1 },
}

export const mockCustomerAnalytics = {
  newVsReturning: { new: 8200, returning: 4280 },
  clv: 186.5,
  topCustomers: [
    { name: 'Sarah Johnson', orders: 24, spent: 4820 },
    { name: 'Michael Chen', orders: 18, spent: 3940 },
    { name: 'Emma Williams', orders: 15, spent: 3210 },
  ],
  geo: [
    { country: 'United States', users: 4200 },
    { country: 'United Kingdom', users: 2100 },
    { country: 'Canada', users: 1800 },
  ],
  devices: [
    { device: 'Mobile', pct: 62 },
    { device: 'Desktop', pct: 32 },
    { device: 'Tablet', pct: 6 },
  ],
}

export const mockMarketing = {
  roas: 3.8,
  campaigns: [
    { name: 'Summer Sale 2026', spend: 2400, revenue: 12400, roas: 5.17 },
    { name: 'Retargeting Cart', spend: 1200, revenue: 4800, roas: 4.0 },
    { name: 'Brand Awareness', spend: 3600, revenue: 7200, roas: 2.0 },
  ],
  utm: [
    { source: 'facebook', medium: 'cpc', sessions: 3100, conversions: 124 },
    { source: 'google', medium: 'cpc', sessions: 5200, conversions: 286 },
  ],
}

