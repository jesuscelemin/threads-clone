import { getUserThreads } from '@/lib/actions/user.action'
import { ThreadsTabContentProps } from '@/types'
import ThreadCard from '../cards/ThreadCard'
import { Separator } from '../ui/separator'

const ThreadsTabContent = async ({
  currentUserId,
  userId
}: ThreadsTabContentProps) => {
  const result = await getUserThreads(userId)

  return (
    <section className="mt-4">
      {result.threads.map((thread: any) => (
        <>
          {result.threads.length === 0 ? (
            <div className="flex h-[50vh] w-full items-center justify-center">
              <p className="text-light-400">Aún no hay hilos</p>
            </div>
          ) : (
            <>
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={currentUserId}
                parentId={thread.parentId}
                text={thread.text}
                image={thread.image}
                author={{
                  name: result.name,
                  image: result.image,
                  _id: result.id
                }}
                createdAt={thread.createdAt}
                comments={thread.comments}
                community={thread.community}
                likes={thread.likes}
              />

              <Separator className="mt-4 bg-light-400/50" />
            </>
          )}
        </>
      ))}
    </section>
  )
}
export default ThreadsTabContent
