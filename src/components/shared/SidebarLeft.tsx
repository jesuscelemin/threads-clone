'use client'

import { sidebarLinks } from '@/constants'
import { SidebarLeftProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@radix-ui/react-dropdown-menu'
import { Button } from '../ui/button'
import Avatar from './Avatar'
import { signOut } from '@/lib/actions/signout.action'

const SidebarLeft = ({ user }: SidebarLeftProps) => {
  const pathname = usePathname()

  return (
    <section className="custom-scrollbar sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-400 bg-dark-100 max-md:hidden">
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
      <div className="flex-1 pb-5 pt-8">
        <div className="flex w-full flex-1 flex-col gap-6 px-6">
          {sidebarLinks.map(link => {
            const isActive =
              (pathname.includes(link.route) && link.route.length > 1) ||
              pathname === link.route

            if (link.route === '/profile') {
              if (user._id) {
                link.route = `${link.route}/${user._id}`
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
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <div className="flex items-center justify-center px-6 pb-12 lg:justify-between lg:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative h-[36px] w-[36px]">
                <Avatar
                  src={user.image}
                  isFill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="hidden lg:block">
                <p className="small-semibold leading-none text-light-100">
                  {user.name}
                </p>
                <p className="small-regular text-light-400">{user.username}</p>
              </div>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="absolute left-[-1rem] top-[-9rem] min-w-[160px] border border-dark-500 bg-dark-400 lg:left-[-5rem]">
          <DropdownMenuItem className="cursor-pointer gap-4 text-light-200 outline-none focus:bg-dark-500 ">
            <form action={signOut}>
              <Button type="submit">Cerrar sesión</Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  )
}
export default SidebarLeft
