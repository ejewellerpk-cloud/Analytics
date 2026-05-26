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
const HeatmapsPage = lazy(() => import('@/pages/enterprise/HeatmapsPage').then((m) => ({ default: m.HeatmapsPage })))
const SessionReplayPage = lazy(() => import('@/pages/enterprise/SessionReplayPage').then((m) => ({ default: m.SessionReplayPage })))
const AiInsightsPage = lazy(() => import('@/pages/enterprise/AiInsightsPage').then((m) => ({ default: m.AiInsightsPage })))
const CartRecoveryPage = lazy(() => import('@/pages/enterprise/EnterprisePlaceholderPage').then((m) => ({ default: m.EnterprisePlaceholderPage })))
const CustomerJourneyPage = lazy(() => import('@/pages/enterprise/EnterprisePlaceholderPage').then((m) => ({ default: m.EnterprisePlaceholderPage })))
const SegmentsPage = lazy(() => import('@/pages/enterprise/EnterprisePlaceholderPage').then((m) => ({ default: m.EnterprisePlaceholderPage })))
const ExperimentsPage = lazy(() => import('@/pages/enterprise/EnterprisePlaceholderPage').then((m) => ({ default: m.EnterprisePlaceholderPage })))
const AttributionPage = lazy(() => import('@/pages/enterprise/EnterprisePlaceholderPage').then((m) => ({ default: m.EnterprisePlaceholderPage })))
const AlertsPage = lazy(() => import('@/pages/enterprise/EnterprisePlaceholderPage').then((m) => ({ default: m.EnterprisePlaceholderPage })))
const BillingPage = lazy(() => import('@/pages/enterprise/EnterprisePlaceholderPage').then((m) => ({ default: m.EnterprisePlaceholderPage })))
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
      { path: 'heatmaps', element: <Guard><HeatmapsPage /></Guard> },
      { path: 'session-replay', element: <Guard><SessionReplayPage /></Guard> },
      { path: 'ai-insights', element: <Guard><AiInsightsPage /></Guard> },
      { path: 'marketing/recovery', element: <Guard><CartRecoveryPage title="Cart Recovery" description="Abandoned checkout automation" phase="4" /></Guard> },
      { path: 'customers/journey', element: <Guard><CustomerJourneyPage title="Customer Journey" description="Unified visitor → customer timeline" phase="4" /></Guard> },
      { path: 'customers/segments', element: <Guard><SegmentsPage title="Segments & LTV" description="RFM, VIP, at-risk segments" phase="5" /></Guard> },
      { path: 'optimization/experiments', element: <Guard><ExperimentsPage title="Experiments" description="A/B tests & conversion lift" phase="7" /></Guard> },
      { path: 'marketing/attribution', element: <Guard><AttributionPage title="Attribution & ROAS" description="Multi-touch revenue attribution" phase="8" /></Guard> },
      { path: 'settings/alerts', element: <Guard><AlertsPage title="Smart Alerts" description="Threshold rules & notifications" phase="9" /></Guard> },
      { path: 'admin/billing', element: <Guard><BillingPage title="Billing" description="SaaS plans & white-label" phase="10" /></Guard> },
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
