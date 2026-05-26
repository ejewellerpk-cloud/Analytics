import { useMemo } from 'react'

export function HeatmapCanvas({ snapshot, loading }) {
  const grid = snapshot?.grid_size ?? 32
  const cells = snapshot?.cells ?? []
  const max = useMemo(() => Math.max(1, ...cells.map((c) => c.count)), [cells])

  if (loading) {
    return <div className="aspect-video rounded-xl bg-muted animate-pulse" />
  }

  return (
    <div className="relative aspect-video rounded-xl border bg-slate-950 overflow-hidden">
      <div
        className="absolute inset-0 grid gap-px"
        style={{ gridTemplateColumns: `repeat(${grid}, 1fr)` }}
      >
        {Array.from({ length: grid * grid }).map((_, i) => {
          const x = i % grid
          const y = Math.floor(i / grid)
          const cell = cells.find((c) => c.x === x && c.y === y)
          const intensity = cell ? cell.count / max : 0
          return (
            <div
              key={i}
              className="min-h-0"
              style={{
                backgroundColor: intensity
                  ? `rgba(249, 115, 22, ${0.15 + intensity * 0.85})`
                  : 'transparent',
              }}
              title={cell ? `${cell.count} interactions` : ''}
            />
          )
        })}
      </div>
      <p className="absolute bottom-2 right-2 text-[10px] text-white/60">
        {snapshot?.page_path || '—'} · {snapshot?.type || 'click'}
      </p>
    </div>
  )
}
