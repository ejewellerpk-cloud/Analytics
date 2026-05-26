import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { Skeleton } from '@/components/ui/skeleton'

const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const LiveAnalyticsPage = lazy(() => import('@/pages/LiveAnalyticsPage').then((m) => ({ default: m.LiveAnalyticsPage })))
const OrdersAnalyticsPage = lazy(() => import('@/pages/OrdersAnalyticsPage').then((m) => ({ default: m.OrdersAnalyticsPage })))
const ProductsAnalyticsPage = lazy(() => import('@/pages/ProductsAnalyticsPage').then((m) => ({ default: m.ProductsAnalyticsPage })))
const CustomersAnalyticsPage = lazy(() => import('@/pages/CustomersAnalyticsPage').then((m) => ({ default: m.CustomersAnalyticsPage })))
const MarketingAnalyticsPage = lazy(() => import('@/pages/MarketingAnalyticsPage').then((m) => ({ default: m.MarketingAnalyticsPage })))
const FunnelsPage = lazy(() => import('@/pages/FunnelsPage').then((m) => ({ default: m.FunnelsPage })))
const ReportsPage = lazy(() => import('@/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })))
const IntegrationsPage = lazy(() => import('@/pages/IntegrationsPage').then((m) => ({ default: m.IntegrationsPage })))
const RolesPage = lazy(() => import('@/pages/RolesPage').then((m) => ({ default: m.RolesPage })))
const AdvancedAnalyticsPage = lazy(() => import('@/pages/AdvancedAnalyticsPage').then((m) => ({ default: m.AdvancedAnalyticsPage })))
const SettingsLayout = lazy(() => import('@/layouts/SettingsLayout').then((m) => ({ default: m.SettingsLayout })))
const EnvironmentSettingsPage = lazy(() => import('@/pages/settings/EnvironmentSettingsPage').then((m) => ({ default: m.EnvironmentSettingsPage })))
const ProfileSettingsPage = lazy(() => import('@/pages/settings/ProfileSettingsPage').then((m) => ({ default: m.ProfileSettingsPage })))
const ThemeSettingsPage = lazy(() => import('@/pages/settings/ThemeSettingsPage').then((m) => ({ default: m.ThemeSettingsPage })))
const ApiSettingsPage = lazy(() => import('@/pages/settings/ApiSettingsPage').then((m) => ({ default: m.ApiSettingsPage })))

function PageLoader() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-xl" />
    </div>
  )
}

function Lazy({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

function Guard({ children }) {
  return (
    <ProtectedRoute>
      <Lazy>{children}</Lazy>
    </ProtectedRoute>
  )
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <Lazy>
            <LoginPage />
          </Lazy>
        ),
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Guard><DashboardPage /></Guard> },
      { path: 'live', element: <Guard><LiveAnalyticsPage /></Guard> },
      { path: 'orders', element: <Guard><OrdersAnalyticsPage /></Guard> },
      { path: 'products', element: <Guard><ProductsAnalyticsPage /></Guard> },
      { path: 'customers', element: <Guard><CustomersAnalyticsPage /></Guard> },
      { path: 'marketing', element: <Guard><MarketingAnalyticsPage /></Guard> },
      { path: 'funnels', element: <Guard><FunnelsPage /></Guard> },
      { path: 'reports', element: <Guard><ReportsPage /></Guard> },
      { path: 'advanced', element: <Guard><AdvancedAnalyticsPage /></Guard> },
      { path: 'integrations', element: <Guard><IntegrationsPage /></Guard> },
      { path: 'roles', element: <Guard><RolesPage /></Guard> },
      {
        path: 'settings',
        element: (
          <Lazy>
            <SettingsLayout />
          </Lazy>
        ),
        children: [
          { index: true, element: <Navigate to="environment" replace /> },
          { path: 'environment', element: <Lazy><EnvironmentSettingsPage /></Lazy> },
          { path: 'profile', element: <Lazy><ProfileSettingsPage /></Lazy> },
          { path: 'theme', element: <Lazy><ThemeSettingsPage /></Lazy> },
          { path: 'api', element: <Lazy><ApiSettingsPage /></Lazy> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
