import { useTheme } from '@/contexts/ThemeContext'
import { baseChartOptions } from '@/themes/chartTheme'
import { Skeleton } from '@/components/ui/skeleton'
import { SafeApexChart } from './SafeApexChart'

export function BarChart({ series, categories, loading, height = 320, horizontal = false }) {
  const { isDark } = useTheme()

  if (loading) return <Skeleton className="w-full" style={{ height }} />

  const options = baseChartOptions(isDark, {
    chart: { type: 'bar', height },
    plotOptions: { bar: { borderRadius: 6, horizontal } },
    xaxis: horizontal ? undefined : { categories },
    dataLabels: { enabled: false },
  })

  return (
    <SafeApexChart
      type="bar"
      height={height}
      options={options}
      series={series}
    />
  )
}
