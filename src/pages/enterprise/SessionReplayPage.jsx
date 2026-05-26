import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/tables/DataTable'
import { useReplaySessions } from '@/hooks/useEnterprise'
import { formatDistanceToNow } from 'date-fns'

export function SessionReplayPage() {
  const { data: sessions = [], isLoading } = useReplaySessions()

  const rows = sessions.map((s) => ({
    id: s.id,
    session: s.session_uuid?.slice(0, 8) + '…',
    pages: s.page_count,
    events: s.event_count,
    device: s.device_type || '—',
    started: s.started_at
      ? formatDistanceToNow(new Date(s.started_at), { addSuffix: true })
      : '—',
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Session Replay"
        description="Recorded sessions from intelligence-tracker (player UI — Phase 2)"
      />
      <Card glass>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            loading={isLoading}
            columns={[
              { key: 'session', label: 'Session' },
              { key: 'device', label: 'Device' },
              { key: 'events', label: 'Events' },
              { key: 'started', label: 'Started' },
            ]}
            data={rows}
            searchable={false}
          />
          {!isLoading && rows.length === 0 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              No replays yet. Browse the storefront with intelligence-tracker enabled.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
