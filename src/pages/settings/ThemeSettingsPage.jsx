import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeSettingsPage() {
  const { preference, setTheme } = useTheme()

  return (
    <Card glass className="max-w-md">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {['light', 'dark', 'system'].map((t) => (
          <div key={t} className="flex items-center justify-between">
            <Label className="capitalize">{t} mode</Label>
            <Switch checked={preference === t} onCheckedChange={() => setTheme(t)} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
