import { NavLink, Outlet } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { SETTINGS_NAV } from '@/utils/constants'
import { cn } from '@/lib/utils'

function NavIcon({ name, className }) {
  const Icon = Icons[name] || Icons.Settings
  return <Icon className={className} />
}

export function SettingsLayout() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Environment, profile, theme, and API configuration"
      />

      <nav className="flex flex-wrap gap-2 border-b border-border pb-2">
        {SETTINGS_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }
          >
            <NavIcon name={item.icon} className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  )
}
