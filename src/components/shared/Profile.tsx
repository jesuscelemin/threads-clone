import { ProfileInfoProps } from '@/types'
import Avatar from './Avatar'
import { formatNumber } from '@/lib/utils'
import EditProfile from './EditProfile'

const Profile = ({
  currentUser,
  userId,
  name,
  image,
  username,
  bio,
  followersNumber
}: ProfileInfoProps) => {
  return (
    <section className="flex w-full flex-col">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="h1-bold text-light-100">{name}</div>
          <div className="mt-1 flex">
            <div className="text-light-100">{username}</div>
            <div className="ml-1 rounded-lg bg-dark-200 px-2 py-[6px]">
              <p className="subtle-regular text-light-400">threads.net</p>
            </div>
          </div>
        </div>

        <div className="relative h-[64px] w-[64px] md:h-[84px] md:w-[84px]">
          <Avatar src={image} isFill className="rounded-full object-cover" />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-4">
        <p className="text-light-100">{bio}</p>

        <div className="flex items-end justify-between">
          <div className="flex">
            {followersNumber > 0 && (
              <p className="text-light-400">
                {formatNumber(followersNumber)} seguido
                {followersNumber > 1 ? 'res' : 'r'}
              </p>
            )}
          </div>

          {userId === currentUser._id && <EditProfile user={currentUser} />}
        </div>
      </div>
    </section>
  )
}
export default Profile
