'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Home() {
  const session = useSession()

  if (!session.data?.user) redirect('/login')

  return (
    <main>
      <h1>Threads</h1>
    </main>
  )
}
