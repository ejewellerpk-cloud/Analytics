import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { fetchProfile } from '@/api/auth'
import { unwrap } from '@/api/client'

export function ProfileSettingsPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
      .then((res) => setProfile(unwrap({ data: res }) ?? res?.data ?? res))
      .catch(() => setProfile(user))
      .finally(() => setLoading(false))
  }, [user])

  const display = profile || user

  return (
    <Card glass className="max-w-md">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Account from Laravel (read-only)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={display?.name ?? ''} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={display?.email ?? ''} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={display?.phone ?? '—'} readOnly />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
