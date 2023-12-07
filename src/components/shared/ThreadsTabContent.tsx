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

  return (
    <div className="mt-4 w-full">
      {result.threads.length > 0 ? (
        <>
          {result.threads.map((thread: any) => (
            <React.Fragment key={thread._id}>
              <ThreadCard
                id={thread._id}
                currentUserId={currentUserId}
                parentId={thread.parentId}
                text={thread.text}
                image={thread.image}
                author={{
                  username: thread.author.username,
                  name: thread.author.name,
                  image: thread.author.image,
                  _id: thread.author._id
                }}
                createdAt={thread.createdAt}
                comments={thread.children}
                likes={thread.likes}
                isProfile
              />

              <Separator className="my-4 bg-light-400/50" />
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
