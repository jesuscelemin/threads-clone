import ThreadCard from '@/components/cards/ThreadCard'
import PostThread from '@/components/forms/PostThread'
import { Separator } from '@/components/ui/separator'
import { getThreads } from '@/lib/actions/thread.action'
import { getCurrentUser } from '@/lib/actions/user.action'

export default async function Home() {
  const user = await getCurrentUser()
  if (!user) return null

  const result = await getThreads(1, 30)

  return (
    <main>
      <PostThread user={user} />
      <Separator className="mt-4 bg-light-400" />

      {result?.threads.length === 0 ? (
        <p className="text-light-400">Aún no hay lios</p>
      ) : (
        <>
          {result?.threads.map(thread => (
            <ThreadCard
              key={thread.id}
              id={thread.id}
              currentUserId={user._id}
              parentId={thread.parentId}
              text={thread.text}
              image={thread.image}
              createdAt={thread.createdAt}
              author={thread.author}
              community={thread.community}
              comments={thread.children}
            />
          ))}
        </>
      )}
    </main>
  )
}
