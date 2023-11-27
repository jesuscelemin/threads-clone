'use client'

import { sidebarLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BottomNav = () => {
  const pathname = usePathname()

  return (
    <section className="xs:px-7 fixed bottom-0 z-10 w-full rounded-t-3xl bg-glassmorphism p-4 backdrop-blur-lg md:hidden">
      <div className="xs:gap-5 flex items-center justify-between gap-3">
        {sidebarLinks.map(link => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5 ${
                isActive && 'bg-dark-500'
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="x-small-medium text-light-100 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
export default BottomNav
