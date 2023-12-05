'use client'

import { likeThread } from '@/lib/actions/thread.action'
import { Button } from '../ui/button'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const LikeButton = ({
  threadId,
  userId,
  isLiked
}: {
  threadId: string
  userId: string
  isLiked: boolean
}) => {
  const pathname = usePathname()

  const handleLikeClick = async () => {
    await likeThread(JSON.parse(threadId), JSON.parse(userId), pathname)
  }

  return (
    <div>
      <Button
        className="rounded-full p-2 hover:bg-dark-200"
        onClick={handleLikeClick}
      >
        <Image
          src={`${isLiked ? '/assets/love-full.svg' : '/assets/love.svg'}`}
          alt="love"
          width={24}
          height={24}
          className="cursor-pointer object-contain "
        />
      </Button>
    </div>
  )
}
export default LikeButton
