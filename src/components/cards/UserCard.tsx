'use client'

import { UserCardProps } from '@/types'
import Avatar from '../shared/Avatar'
import Link from 'next/link'
import FollowButton from '../shared/FollowButton'

const UserCard = ({
  currentUserId,
  id,
  name,
  username,
  image
}: UserCardProps) => {

  return (
    <article className="flex justify-between">
      <Link
        href={`/profile/${JSON.parse(id)}`}
        className="flex cursor-pointer gap-4"
      >
        <div className="relative h-12 w-12">
          <Avatar src={image} isFill className="rounded-full object-cover" />
        </div>

        <div className="flex flex-col">
          <h3 className="base-semibold text-light-100">{name}</h3>
          <p className="text-light-400">{username}</p>
        </div>
      </Link>

      <FollowButton
        currentUserId={JSON.parse(currentUserId)}
        userId={JSON.parse(id)}
      />
    </article>
  )
}
export default UserCard
