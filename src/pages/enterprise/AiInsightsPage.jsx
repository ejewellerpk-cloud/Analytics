import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAiInsights, useGenerateInsights } from '@/hooks/useEnterprise'
import { Sparkles, RefreshCw } from 'lucide-react'

const severityVariant = {
  critical: 'destructive',
  warning: 'warning',
  info: 'secondary',
}

export function AiInsightsPage() {
  const { data: insights = [], isLoading, refetch } = useAiInsights()
  const generate = useGenerateInsights()

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Insights"
        description="Rule-based ecommerce intelligence (LLM-ready structure)"
        actions={
          <Button
            size="sm"
            onClick={() => generate.mutate()}
            disabled={generate.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${generate.isPending ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        }
      />

      {isLoading && <p className="text-sm text-muted-foreground">Loading insights…</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((item) => (
          <Card glass key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <Badge variant={severityVariant[item.severity] || 'secondary'}>{item.severity}</Badge>
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>{item.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.recommendation}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && insights.length === 0 && (
        <Card glass>
          <CardContent className="p-8 text-center text-muted-foreground">
            No active insights. Click Regenerate or wait for the scheduled job (every 6h).
          </CardContent>
        </Card>
      )}
    </div>
  )
}
