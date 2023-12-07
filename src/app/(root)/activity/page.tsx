import Avatar from '@/components/shared/Avatar'
import { getActivity, getCurrentUser } from '@/lib/actions/user.action'
import Link from 'next/link'

const page = async () => {
  const user = await getCurrentUser()

  const activity = await getActivity(user._id)

  return (
    <section>
      <h1 className="h1-bold text-light-100">Actividad</h1>

      <div className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map(activity => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="flex items-center gap-2 rounded-md bg-dark-200 px-7 py-4">
                  <div className="relative mr-2 h-6 w-6">
                    <Avatar
                      src={activity.author.image}
                      isFill
                      className="rounded-full border border-light-400 object-cover"
                    />
                  </div>
                  <p className="text-light-100">
                    <span className="base-semibold mr-1 text-accent-blue">
                      {activity.author.name}
                    </span>{' '}
                    respondió a tu hilo
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="text-light-400">Sin actividad aún.</p>
        )}
      </div>
    </section>
  )
}
export default page
