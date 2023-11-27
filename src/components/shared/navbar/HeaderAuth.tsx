import React from 'react'
import Avatar from '../Avatar'
import { signOut } from '@/auth'
import { getCurrentUser } from '@/lib/actions/user.action'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'

const HeaderAuth = async () => {
  const user = await getCurrentUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className='relative h-[30px] w-[30px]'>
          <Avatar
            src={user?.image}
            isFill
            className="rounded-full object-cover"
          />
        </div>
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
