'use client'

import {
  followUser,
  isUserFollowing,
  unfollowUser
} from '@/lib/actions/user.action'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const FollowButton = ({
  currentUserId,
  userId
}: {
  currentUserId: string
  userId: string
}) => {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  
  console.log(pathname)
  

  useEffect(() => {
    const checkIsFollowing = async () => {
      try {
        const result = await isUserFollowing(currentUserId, userId)
        setIsFollowing(result)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    checkIsFollowing()
  }, [currentUserId, userId])

  const handleFollowClick = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(currentUserId, userId, pathname)
      } else {
        await followUser(currentUserId, userId, pathname)
      }

      setIsFollowing(prevIsFollowing => !prevIsFollowing)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {!isLoading && (
        <Button
          onClick={handleFollowClick}
          className={`${
            isFollowing
              ? 'border-2 border-light-400 bg-dark-100'
              : 'bg-light-100'
          } h-fit rounded-lg px-4 py-1.5`}
        >
          <p className={`${isFollowing && 'text-light-400'} small-regular`}>
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </p>
        </Button>
      )}
    </>
  )
}

export default FollowButton
