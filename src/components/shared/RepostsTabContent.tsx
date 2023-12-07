import { getRepostsByUser } from '@/lib/actions/thread.action'
import ThreadCard from '../cards/ThreadCard'
import { Separator } from '../ui/separator'
import React from 'react'

const RepostsTabContent = async ({
  userId,
  currentUserId
}: {
  userId:string
  currentUserId: string
}) => {
  const result = await getRepostsByUser(userId)

  return (
    <div className="w-full">
      {result.length > 0 ? (
        result.map((thread: any) => (
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
            />

            <Separator className="my-4 bg-light-400/50" />
          </React.Fragment>
        ))
      ) : (
        <div className="flex h-[50vh] w-full items-center justify-center">
          <p className="text-light-400">Aún no hay republicaciones.</p>
        </div>
      )}
    </div>
  )
}

export default RepostsTabContent
