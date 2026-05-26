import { useTheme } from '@/contexts/ThemeContext'
import { baseChartOptions } from '@/themes/chartTheme'
import { Skeleton } from '@/components/ui/skeleton'
import { SafeApexChart } from './SafeApexChart'

export function AreaChart({ series, categories, loading, height = 320, colors }) {
  const { isDark } = useTheme()

  if (loading) return <Skeleton className="w-full" style={{ height }} />

  const hasData = series?.some((s) => s.data?.length > 0)
  if (!hasData) return <div style={{ height }} className="flex items-center justify-center text-sm text-muted-foreground">No data</div>

  const options = baseChartOptions(isDark, {
    chart: { type: 'area', height },
    xaxis: { categories },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02 },
    },
    dataLabels: { enabled: false },
    colors,
  })

  return (
    <SafeApexChart
      type="area"
      height={height}
      options={options}
      series={series}
    />
  )
}
