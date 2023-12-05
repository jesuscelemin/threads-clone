'use client'

import Image from 'next/image'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'
import { repostThread } from '@/lib/actions/thread.action'

const RepostButton = ({
  threadId,
  userId
}: {
  threadId: string
  userId: string
}) => {
  const pathname = usePathname()

  const handleRepostThread = async () => {
    await repostThread({
      originalThreadId: JSON.parse(threadId),
      userId: JSON.parse(userId),
      path: pathname
    })
  }

  return (
    <Button
      className="rounded-full p-2 hover:bg-dark-200"
      onClick={handleRepostThread}
    >
      <Image
        src="/assets/reply.svg"
        alt="reply"
        width={24}
        height={24}
        className="cursor-pointer object-contain "
      />
    </Button>
  )
}
export default RepostButton
