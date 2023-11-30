import { ProfileInfoProps } from '@/types'
import Avatar from './Avatar'

const Profile = ({
  currentUserId,
  userId,
  name,
  image,
  username,
  bio
}: ProfileInfoProps) => {
  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
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

      <div className="mt-4">
        <p className="text-light-100">{bio}</p>

        
      </div>
    </section>
  )
}
export default Profile
