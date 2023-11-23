import '../globals.css'
import Image from 'next/image'
import React from 'react'

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main className="bg-dark-100">
      <div className="relative flex h-screen w-full grow flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-0 h-[520px] w-full">
          <Image
            src="/assets/threads-login.png"
            alt="hero-auth"
            fill
            style={{ objectFit: 'cover' }}
            priority
            placeholder="blur"
            blurDataURL={'/assets/threads-login.png'}
          />
        </div>
        <div className="z-10 flex w-full justify-center">{children}</div>
      </div>
    </main>
  )
}
