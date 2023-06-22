import {
  Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { auth } from '@/auth'
import { getUserRequestCount } from '@/app/actions'
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

  return (
    <div className={'m-10 max-w-md'}>
      <Card>
        <CardHeader>
          <CardTitle>{session.user.name}</CardTitle>
          <CardDescription>{session.user.email}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center space-x-4 rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Account Type</p>
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
          <Upgrade/>
        </CardContent>
      </Card>
    </div>
  )
}
