import { getCurrentUser, getUsersNotFollowing } from '@/lib/actions/user.action'
import Avatar from './Avatar'
import FollowButton from './FollowButton'

const SidebarRight = async () => {
  const currentUser = await getCurrentUser()
  const users = await getUsersNotFollowing(currentUser._id)

  return (
    <section className="custom-scrollbar sticky right-0 top-0 z-20 flex h-screen w-fit min-w-[340px] flex-col justify-between gap-12 overflow-auto border-l border-l-dark-400 bg-dark-100 px-10 pb-6 pt-28 max-xl:hidden">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="h2-semibold mb-4 text-light-100">Usuarios sugeridos</h3>

        <div>
          {users.map(user => (
            <div
              key={user._id}
              className="mt-2 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="relative h-9 w-9">
                  <Avatar
                    src={user.image}
                    isFill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="ml-2 flex flex-col items-start">
                  <h2 className="base-semibold text-light-100">{user.name}</h2>
                  <p className="small-regular text-light-400">
                    {user.username}
                  </p>
                </div>
              </div>

              <FollowButton
                currentUserId={currentUser._id}
                userId={user._id.toString()}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default SidebarRight
