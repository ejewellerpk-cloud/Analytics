import { format, subDays, startOfDay, endOfDay } from 'date-fns'

export function getPresetRange(presetId) {
  const today = new Date()
  const to = format(today, 'yyyy-MM-dd')

  switch (presetId) {
    case 'today':
      return { from: to, to, preset: 'today' }
    case '7d':
      return { from: format(subDays(today, 6), 'yyyy-MM-dd'), to, preset: '7d' }
    case '30d':
      return { from: format(subDays(today, 29), 'yyyy-MM-dd'), to, preset: '30d' }
    case '12m':
      return { from: format(subDays(today, 364), 'yyyy-MM-dd'), to, preset: '12m' }
    default:
      return { from: format(subDays(today, 6), 'yyyy-MM-dd'), to, preset: '7d' }
  }
}

export function parseStoredRange(stored) {
  if (!stored) return getPresetRange('7d')
  try {
    return JSON.parse(stored)
  } catch {
    return getPresetRange('7d')
  }
}

export function labelForRange(range) {
  if (!range?.from || !range?.to) return 'Select dates'
  if (range.preset && range.preset !== 'custom') {
    const labels = { today: 'Today', '7d': 'Last 7 days', '30d': 'Last 30 days', '12m': 'Last 12 months' }
    return labels[range.preset] || `${range.from} – ${range.to}`
  }
  return `${range.from} – ${range.to}`
}
