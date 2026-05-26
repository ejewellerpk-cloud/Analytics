import { useId, useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { getChartColors } from '@/themes/chartTheme'

/** Lightweight SVG sparkline — avoids ApexCharts mask-reveal errors in KPI grids */
export function MiniSparkline({ data = [], accent = 'primary', className }) {
  const gradientId = `spark-${useId().replace(/:/g, '')}`
  const { isDark } = useTheme()
  const colors = getChartColors(isDark)
  const stroke = accent === 'emerald' ? colors.secondary : colors.primary

  const path = useMemo(() => {
    if (!data.length) return ''
    const w = 120
    const h = 40
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const points = data.map((v, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * w
      const y = h - ((v - min) / range) * (h - 4) - 2
      return `${x},${y}`
    })
    return `M ${points.join(' L ')}`
  }, [data])

  if (!data.length) return null

  const fillPath = `${path} L 120,40 L 0,40 Z`

  return (
    <svg
      viewBox="0 0 120 40"
      preserveAspectRatio="none"
      className={className}
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradientId})`} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
