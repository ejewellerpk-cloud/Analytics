import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyState({ icon: Icon = Inbox, title = 'No data yet', description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && actionLabel && (
        <Button className="mt-4" onClick={action}>{actionLabel}</Button>
      )}
    </div>
  )
}
