export const STORAGE_KEYS = {
  TOKEN: 'sz_analytics_token',
  USER: 'sz_analytics_user',
  THEME: 'sz_analytics_theme',
  SITE_ID: 'sz_analytics_site_id',
  DATE_RANGE: 'sz_analytics_date_range',
  ENV_CONFIG: 'sz_analytics_env_config',
}

export const SETTINGS_NAV = [
  { label: 'Environment', path: '/settings/environment', icon: 'Server' },
  { label: 'Profile', path: '/settings/profile', icon: 'User' },
  { label: 'Theme', path: '/settings/theme', icon: 'Palette' },
  { label: 'API', path: '/settings/api', icon: 'Key' },
]

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  MANAGER: 'Manager',
  ANALYST: 'Analyst',
}

export const DATE_PRESETS = [
  { id: 'today', label: 'Today', days: 0 },
  { id: '7d', label: '7 Days', days: 6 },
  { id: '30d', label: '30 Days', days: 29 },
  { id: '12m', label: '12 Months', days: 364 },
  { id: 'custom', label: 'Custom', days: null },
]

export const SIDEBAR_NAV = [
  { title: 'Overview', items: [
    { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
    { label: 'Live Analytics', path: '/live', icon: 'Radio' },
  ]},
  { title: 'Commerce', items: [
    { label: 'Orders', path: '/orders', icon: 'ShoppingCart' },
    { label: 'Products', path: '/products', icon: 'Package' },
    { label: 'Customers', path: '/customers', icon: 'Users' },
    { label: 'Journey', path: '/customers/journey', icon: 'Route' },
    { label: 'Segments', path: '/customers/segments', icon: 'Tags' },
  ]},
  { title: 'Intelligence', items: [
    { label: 'Heatmaps', path: '/heatmaps', icon: 'MousePointerClick' },
    { label: 'Session Replay', path: '/session-replay', icon: 'PlayCircle' },
    { label: 'AI Insights', path: '/ai-insights', icon: 'Brain' },
  ]},
  { title: 'Growth', items: [
    { label: 'Marketing', path: '/marketing', icon: 'Megaphone' },
    { label: 'Attribution', path: '/marketing/attribution', icon: 'GitBranch' },
    { label: 'Cart Recovery', path: '/marketing/recovery', icon: 'ShoppingBag' },
    { label: 'Funnels', path: '/funnels', icon: 'Filter' },
    { label: 'Experiments', path: '/optimization/experiments', icon: 'FlaskConical' },
    { label: 'Advanced', path: '/advanced', icon: 'Sparkles' },
    { label: 'Reports', path: '/reports', icon: 'FileBarChart' },
  ]},
  { title: 'System', items: [
    { label: 'Integrations', path: '/integrations', icon: 'Plug' },
    { label: 'Alerts', path: '/settings/alerts', icon: 'Bell' },
    { label: 'Billing', path: '/admin/billing', icon: 'CreditCard' },
    { label: 'User Roles', path: '/roles', icon: 'Shield' },
    { label: 'Settings', path: '/settings/environment', icon: 'Settings' },
  ]},
]
