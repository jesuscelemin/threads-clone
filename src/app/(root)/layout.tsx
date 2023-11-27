import type { Metadata } from 'next'
import '../globals.css'
import React from 'react'
import AuthProvider from '@/context/AuthProvider'
import Navbar from '@/components/shared/navbar/Navbar'
import BottomNav from '@/components/shared/BottomNav'
import SidebarLeft from '@/components/shared/SidebarLeft'
import SidebarRight from '@/components/shared/SidebarRight'
import { inter } from '@/components/ui/font'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Threads Clone',
  description: 'Threads Clone by Jesus Celemin'
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <html lang="en">
      <body className={inter.variable}>
        <AuthProvider>
          <Navbar />
          <main className="flex flex-row">
            <SidebarLeft userId={session?.user.id} />
            <section className="flex min-h-screen flex-1 flex-col items-center bg-dark-100 px-6 pb-10 pt-28 max-md:pb-32 sm:px-10">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <SidebarRight />
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  )
}
