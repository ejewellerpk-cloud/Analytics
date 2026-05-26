import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { canAccess } from '@/utils/roles'

const PATH_PERMISSION = {
  '/': 'dashboard',
  '/live': 'live',
  '/orders': 'orders',
  '/products': 'products',
  '/customers': 'customers',
  '/marketing': 'marketing',
  '/funnels': 'funnels',
  '/advanced': 'advanced',
  '/reports': 'reports',
  '/integrations': 'integrations',
  '/roles': 'roles',
  '/settings': 'settings',
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const basePath = location.pathname.startsWith('/settings')
    ? '/settings'
    : location.pathname
  const permission = PATH_PERMISSION[basePath] ?? PATH_PERMISSION[location.pathname]
  if (permission && !canAccess(role, permission)) {
    return <Navigate to="/" replace />
  }

  return children
}
