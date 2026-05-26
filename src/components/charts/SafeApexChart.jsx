import { useEffect, useId, useRef, useState } from 'react'
import Chart from 'react-apexcharts'

/**
 * Guards ApexCharts against mount/unmount races (mask reveal on null DOM).
 * Common with React Strict Mode, route transitions, and many charts on one page.
 */
export function SafeApexChart({ type, height, width, options, series, className }) {
  const id = useId()
  const containerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const chartKey = `${id}-${type}-${height}-${width ?? 'auto'}`

  useEffect(() => {
    let cancelled = false
    const frame = requestAnimationFrame(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [chartKey])

  if (!ready || !series?.length) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={{ height: typeof height === 'number' ? height : undefined, minHeight: 48 }}
        aria-hidden
      />
    )
  }

  const safeOptions = {
    ...options,
    chart: {
      ...options?.chart,
      animations: {
        enabled: false,
        dynamicAnimation: { enabled: false },
        ...options?.chart?.animations,
      },
      redrawOnParentResize: true,
    },
  }

  return (
    <div ref={containerRef} className={className} style={{ width: width ?? '100%' }}>
      <Chart
        key={chartKey}
        type={type}
        height={height}
        width={width ?? '100%'}
        options={safeOptions}
        series={series}
      />
    </div>
  )
}
