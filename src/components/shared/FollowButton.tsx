import {
  followUser,
  isUserFollowing,
  unfollowUser
} from '@/lib/actions/user.action'
import { Button } from '../ui/button'

const FollowButton = async ({
  currentUserId,
  userId
}: {
  currentUserId: string
  userId: string
}) => {
  const isFollowing = await isUserFollowing(currentUserId, userId)

  const handleFollowClick = async () => {
    if (isFollowing) {
      await unfollowUser(currentUserId, userId)
    } else {
      await followUser(currentUserId, userId)
    }
  }
  return <Button onClick={handleFollowClick}></Button>
}
export default FollowButton
