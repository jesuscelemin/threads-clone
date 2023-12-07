'use client'

import Image from 'next/image'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@radix-ui/react-dropdown-menu'
import { usePathname, useRouter } from 'next/navigation'
import { deleteThread } from '@/lib/actions/thread.action'

const MoreButton = ({
  currentUserId,
  authorId,
  threadId,
  parentId,
  isComment
}: {
  currentUserId: string
  authorId: string
  threadId: string
  parentId: string
  isComment: boolean
}) => {
  const pathname = usePathname()
  const router = useRouter()

  const handleRemoveThread = async () => {
    await deleteThread(JSON.parse(threadId), pathname)
    if (!parentId || !isComment) {
      router.push('/')
    }
  }

  return (
    <>
      {currentUserId === JSON.parse(authorId) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="relative">
            <div className="mt-[-.4rem] cursor-pointer rounded-full p-2 outline-none hover:bg-dark-200 focus:bg-dark-500">
              <Image src="/assets/more.svg" alt="more" width={20} height={20} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute left-[-9rem] top-[.5rem] min-w-[160px] border border-dark-500 bg-dark-400">
            <DropdownMenuItem className="cursor-pointer gap-4 text-light-200 outline-none focus:bg-dark-500 ">
              <Button onClick={handleRemoveThread} className="text-red-500">
                Borrar
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}
export default MoreButton
