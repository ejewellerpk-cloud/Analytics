import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value, options = {}) {
  const num = Number(value) || 0
  return new Intl.NumberFormat('en-US', options).format(num)
}

export function formatCurrency(value) {
  const num = Number(value) || 0
  const symbol = import.meta.env.VITE_CURRENCY_SYMBOL || 'Rs'
  const decimals = Number(import.meta.env.VITE_CURRENCY_DECIMALS ?? 0)
  const formatted = new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
  return `${symbol}${formatted}`
}

export function formatPercent(value, decimals = 1) {
  const num = Number(value) || 0
  const sign = num >= 0 ? '+' : ''
  return `${sign}${num.toFixed(decimals)}%`
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
