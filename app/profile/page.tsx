import {
  Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { auth } from '@/auth'
import { getUserRequestCount, getTotalUsage } from '@/app/actions'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

import Upgrade from './upgrade'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Profile'
  }
}

export default async function SignInPage() {
  const session = await auth()
  if (!session?.user) {
    redirect(`/sign-in?next=/profile`)
  }
  const requestCount = await getUserRequestCount(session.user.id)
  const totalUsage = session?.user?.email === 'tu@keva.dev' ? await getTotalUsage() : 0

  return (
    <div className={'m-10 max-w-md'}>
      <Card className="relative">
        <CardHeader className="absolute right-0 top-0">
          <CardTitle>{session.user.name}</CardTitle>
          <CardDescription>{session.user.email}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6">
          <div className="flex items-center space-x-4 rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Account</p>
              <p className="text-sm text-muted-foreground">
                Free Tier
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Daily Requests</p>
              <p className="text-sm text-muted-foreground">
                {requestCount} / 100
              </p>
            </div>
          </div>
          {session?.user?.email === 'tu@keva.dev' && <div className="flex items-center space-x-4 rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Total Usage</p>
              <p className="text-sm text-muted-foreground">
                {totalUsage}$ / 5$
              </p>
            </div>
          </div>}
          <Upgrade/>
        </CardContent>
      </Card>
    </div>
  )
}
