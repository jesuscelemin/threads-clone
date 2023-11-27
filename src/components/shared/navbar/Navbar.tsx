import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import HeaderAuth from './HeaderAuth'

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-30 flex h-[74px] w-full items-center justify-center bg-dark-100 px-6 py-3">
      <Link href="/" className="flex items-center justify-center gap-4">
        <Image
          src="/assets/logo.svg"
          alt="logo"
          width={32}
          height={32}
          className="transition duration-500 hover:scale-110"
        />
      </Link>

      <div className="absolute right-[40px]">
        <HeaderAuth />
      </div>
    </nav>
  )
}
export default Navbar
