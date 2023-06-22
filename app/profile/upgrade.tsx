'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'

export default function Upgrade() {
  const upgrade = () => {
    toast.loading('This is working in progress', {
      duration: 2000
    })
  }

  return (
    <div>
      <Button variant="outline" size="lg" onClick={upgrade}>Upgrade to Premium</Button>
    </div>
  )
}
