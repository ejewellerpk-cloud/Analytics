import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function EnterprisePlaceholderPage({ title, description, phase }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <Card glass>
        <CardContent className="p-8 text-center space-y-3">
          <Badge variant="outline">Phase {phase}</Badge>
          <p className="text-muted-foreground max-w-lg mx-auto">
            API routes and database tables are ready. UI workflows for this module are next in the
            implementation roadmap. See <code className="text-xs">docs/ENTERPRISE_INTELLIGENCE.md</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
