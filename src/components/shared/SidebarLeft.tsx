'use client'

import { sidebarLinks } from '@/constants'
import { SidebarLeftProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SidebarLeft = ({ userId }: SidebarLeftProps) => {
  const pathname = usePathname()

  return (
    <section className="custom-scrollbar sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-400 bg-dark-100 pb-5 pt-28 max-md:hidden">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map(link => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route

          if (link.route === '/profile') {
            if (userId) {
              link.route = `${link.route}/${userId}`
            } else {
              return null
            }
          }

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`relative flex justify-start gap-4 rounded-lg p-4 ${
                isActive && 'bg-dark-500'
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-100 max-lg:hidden">{link.label}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
export default SidebarLeft
