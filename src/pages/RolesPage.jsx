import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/tables/DataTable'
import { Badge } from '@/components/ui/badge'
import { useRoles } from '@/hooks/useCommerce'

export function RolesPage() {
  const { data: roles = [], isLoading, error } = useRoles()

  const rows = roles.map((r) => ({
    id: r.id,
    name: r.name,
    users: r.users_count,
    permissions: r.guard_name === 'sanctum' ? 'API / Sanctum' : r.guard_name,
  }))

  return (
    <div className="space-y-6">
      <PageHeader title="User Roles" description="Live roles from your Shopperzz database" />

      {error && (
        <p className="text-sm text-destructive">Unable to load roles. Admin permission may be required.</p>
      )}

      <Card glass>
        <CardHeader><CardTitle>Roles & users</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            loading={isLoading}
            columns={[
              { key: 'name', label: 'Role', render: (r) => <Badge>{r.name}</Badge> },
              { key: 'users', label: 'Users' },
              { key: 'permissions', label: 'Guard' },
            ]}
            data={rows}
            searchable={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}
