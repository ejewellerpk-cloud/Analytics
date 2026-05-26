export function getChartColors(isDark) {
  return {
    primary: isDark ? '#818cf8' : '#6366f1',
    secondary: isDark ? '#34d399' : '#10b981',
    tertiary: isDark ? '#fbbf24' : '#f59e0b',
    quaternary: isDark ? '#c084fc' : '#a855f7',
    quinary: isDark ? '#f472b6' : '#ec4899',
    grid: isDark ? '#334155' : '#e2e8f0',
    text: isDark ? '#94a3b8' : '#64748b',
    tooltipBg: isDark ? '#1e293b' : '#ffffff',
    tooltipText: isDark ? '#f1f5f9' : '#0f172a',
  }
}

export function baseChartOptions(isDark, overrides = {}) {
  const colors = getChartColors(isDark)
  return {
    chart: {
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: false, dynamicAnimation: { enabled: false } },
      background: 'transparent',
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    grid: {
      borderColor: colors.grid,
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      labels: { style: { colors: colors.text, fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: colors.text, fontSize: '11px' } },
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      style: { fontSize: '12px' },
    },
    legend: {
      labels: { colors: colors.text },
      fontSize: '12px',
    },
    colors: [colors.primary, colors.secondary, colors.tertiary, colors.quaternary, colors.quinary],
    ...overrides,
  }
}
