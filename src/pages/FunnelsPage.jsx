import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FunnelChart } from '@/components/charts/FunnelChart'
import { useFunnel } from '@/hooks/useAnalytics'

export function FunnelsPage() {
  const { data: steps = [], isLoading } = useFunnel()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Funnel Analytics"
        description="Ecommerce conversion funnel from visit to purchase"
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card glass className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Conversion funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <FunnelChart steps={steps} loading={isLoading} />
          </CardContent>
        </Card>
        <Card glass className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Step metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {steps.map((step, i) => (
                <li key={step.step} className="flex justify-between items-center text-sm border-b pb-3 last:border-0">
                  <span className="text-muted-foreground">{i + 1}. {step.step}</span>
                  <span className="font-semibold">{step.conversion_pct}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
