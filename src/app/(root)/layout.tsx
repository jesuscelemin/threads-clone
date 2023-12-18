import type { Metadata } from 'next'
import '../globals.css'
import React from 'react'
import AuthProvider from '@/context/AuthProvider'
import SidebarLeft from '@/components/shared/SidebarLeft'
import BottomNav from '@/components/shared/BottomNav'
import { inter } from '@/components/ui/font'
import { redirect } from 'next/navigation'
import SidebarRight from '@/components/shared/SidebarRight'
import { getCurrentUser } from '@/lib/actions/user.action'
import { Toaster } from '@/components/ui/toaster'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Threads Clone',
  description: 'Threads Clone by Jesus Celemin'
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <html lang="en">
      <body className={inter.variable}>
        <AuthProvider>
          <main className="flex flex-row">
            <SidebarLeft user={user} />
            <section className="flex min-h-screen flex-1 flex-col items-center bg-dark-100 px-6 pb-10 pt-5 max-md:pb-32 sm:px-10 md:pt-28">
              <div className="mt-[74px] w-full max-w-[620px] md:mt-0">
                <div className="fixed left-0 top-0 z-10 mb-2 flex h-[74px] w-full items-center justify-center bg-dark-100 md:hidden">
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-4 p-6 lg:justify-start"
                  >
                    <Image
                      src="/assets/logo.svg"
                      alt="logo"
                      width={32}
                      height={32}
                      className="transition duration-500 hover:scale-110"
                    />
                  </Link>
                </div>
                {children}
              </div>
            </section>
            <SidebarRight />
          </main>
          <BottomNav />
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
