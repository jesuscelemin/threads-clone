import RepostCard from '@/components/cards/RepostCard'
import ThreadCard from '@/components/cards/ThreadCard'
import PostThread from '@/components/forms/PostThread'
import LoadMore from '@/components/shared/LoadMore'
import { Separator } from '@/components/ui/separator'
import { getThreads } from '@/lib/actions/thread.action'
import { getCurrentUser } from '@/lib/actions/user.action'
import React from 'react'

export default async function Home() {
  const user = await getCurrentUser()
  if (!user) return null

  const { threads } = await getThreads(1)

  return (
    <main>
      <PostThread user={user} />
      <Separator className="my-4 bg-light-400" />

      {threads?.length === 0 ? (
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-light-400">Aún no hay hilos</p>
        </div>
      ) : (
        <>
          <section>
            {threads?.map((thread: any) => {
              return (
                <React.Fragment key={thread._id}>
                  {thread.repostedFrom ? (
                    <RepostCard
                      id={thread._id}
                      currentUserId={user._id}
                      parentId={thread.parentId}
                      text={thread.text}
                      image={thread.image}
                      author={thread.author}
                      likes={thread.likes}
                      comments={thread.children}
                      createdAt={thread.createdAt}
                      repostedFrom={thread.repostedFrom}
                    />
                  ) : (
                    <ThreadCard
                      id={thread._id}
                      currentUserId={user._id}
                      parentId={thread.parentId}
                      text={thread.text}
                      image={thread.image}
                      createdAt={thread.createdAt}
                      author={thread.author}
                      comments={thread.children}
                      likes={thread.likes}
                    />
                  )}

                  <Separator className="my-4 bg-light-400/50" />
                </React.Fragment>
              )
            })}
          </section>
        </>
      )}

      <LoadMore userId={user._id} />
    </main>
  )
}
