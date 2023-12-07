'use client'

import { UserCardProps } from '@/types'
import Avatar from '../shared/Avatar'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

const UserCard = ({ id, name, username, image }: UserCardProps) => {
  const router = useRouter()

  return (
    <article className="flex justify-between">
      <div className='flex gap-4'>
        <div className="relative h-12 w-12">
          <Avatar src={image} isFill className="rounded-full object-cover" />
        </div>

        <div className="flex flex-col">
          <h3 className="base-semibold text-light-100">{name}</h3>
          <p className="text-light-400">{username}</p>
        </div>
      </div>

      <Button
        variant="outline"
        className="text-light-100"
        onClick={() => router.push(`/profile/${JSON.parse(id)}`)}
      >
        Ver
      </Button>
    </article>
  )
}
export default UserCard
