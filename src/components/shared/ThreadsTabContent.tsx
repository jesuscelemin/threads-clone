import { getUserThreads } from '@/lib/actions/user.action'
import { ThreadsTabContentProps } from '@/types'
import ThreadCard from '../cards/ThreadCard'
import { Separator } from '../ui/separator'
import React from 'react'

const ThreadsTabContent = async ({
  currentUserId,
  userId
}: ThreadsTabContentProps) => {
  const result = await getUserThreads(userId)
  const threads = result.threads || []

  return (
    <div className="mt-4 w-full">
      {threads.length > 0 ? (
        <>
          {threads.map((thread: any) => (
            <React.Fragment key={thread._id}>
              <ThreadCard
                id={thread._id}
                currentUserId={currentUserId}
                parentId={thread.parentId}
                text={thread.text}
                image={thread.image}
                author={{
                  name: thread.author.name,
                  image: thread.author.image,
                  _id: thread.author.id
                }}
                createdAt={thread.createdAt}
                comments={thread.comments}
                community={thread.community}
                likes={thread.likes}
              />

              <Separator className="mt-4 bg-light-400/50" />
            </React.Fragment>
          ))}
        </>
      ) : (
        <div className="flex h-[50vh] w-full items-center justify-center">
          <p className="text-light-400">Aún no hay hilos.</p>
        </div>
      )}
    </div>
  )
}
export default ThreadsTabContent
