import React from 'react'
import Avatar from '../Avatar'
import { auth, signOut } from '@/auth'
import { getUserById } from '@/lib/actions/user.action'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'

const HeaderAuth = async () => {
  const session = await auth()

  if (!session?.user) return null
  const user = await getUserById(session?.user?.id)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar
          src={user.image}
          height={30}
          width={30}
          className="rounded-full"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="absolute right-[-1rem] mt-1 min-w-[160px] border-dark-500 bg-dark-400">
        <DropdownMenuItem className="cursor-pointer gap-4 text-light-200 focus:bg-dark-500">
          <form
            action={async () => {
              'use server'
              await signOut()
            }}
          >
            <button type="submit">Logout</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default HeaderAuth
