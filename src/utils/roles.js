import { ROLES } from './constants'

export function normalizeRole(user) {
  const name = user?.role_name || user?.roles?.[0]?.name || user?.role?.name || ''
  if (/super|admin|administrator/i.test(name)) return ROLES.SUPER_ADMIN
  if (/manager/i.test(name)) return ROLES.MANAGER
  if (/analyst/i.test(name)) return ROLES.ANALYST
  // Logged-in store staff default to Manager (settings + integrations access)
  if (user) return ROLES.MANAGER
  return ROLES.ANALYST
}

export function canAccess(role, permission) {
  const matrix = {
    [ROLES.SUPER_ADMIN]: ['*'],
    [ROLES.MANAGER]: ['dashboard', 'live', 'orders', 'products', 'customers', 'marketing', 'funnels', 'advanced', 'reports', 'integrations', 'settings'],
    [ROLES.ANALYST]: ['dashboard', 'live', 'orders', 'products', 'customers', 'marketing', 'funnels', 'advanced', 'reports', 'settings'],
  }
  const allowed = matrix[role] || matrix[ROLES.ANALYST]
  return allowed.includes('*') || allowed.includes(permission)
}
