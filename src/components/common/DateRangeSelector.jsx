import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAnalyticsContext } from '@/contexts/AnalyticsContext'
import { DATE_PRESETS } from '@/utils/constants'
import { getPresetRange, labelForRange } from '@/utils/dateRange'
import { cn } from '@/lib/utils'

export function DateRangeSelector({ className }) {
  const { dateRange, setDateRange } = useAnalyticsContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn('gap-2', className)}>
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">{labelForRange(dateRange)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {DATE_PRESETS.filter((p) => p.id !== 'custom').map((preset) => (
          <DropdownMenuItem
            key={preset.id}
            onClick={() => setDateRange(getPresetRange(preset.id))}
            className={dateRange.preset === preset.id ? 'bg-accent/10' : ''}
          >
            {preset.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
