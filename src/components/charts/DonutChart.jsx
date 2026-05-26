import { useTheme } from '@/contexts/ThemeContext'
import { baseChartOptions } from '@/themes/chartTheme'
import { Skeleton } from '@/components/ui/skeleton'
import { SafeApexChart } from './SafeApexChart'

export function DonutChart({ series, labels, loading, height = 280 }) {
  const { isDark } = useTheme()

  if (loading) return <Skeleton className="w-full rounded-full mx-auto max-w-[280px]" style={{ height }} />

  const options = baseChartOptions(isDark, {
    chart: { type: 'donut' },
    labels,
    legend: { position: 'bottom' },
    plotOptions: { pie: { donut: { size: '68%' } } },
    dataLabels: { enabled: false },
  })

  return (
    <SafeApexChart
      type="donut"
      height={height}
      options={options}
      series={series}
    />
  )
}
