import { getThreads } from '@/lib/actions/thread.action'
import { RepliesTabContentProps } from '@/types'
import { Separator } from '../ui/separator'
import ThreadCard from '../cards/ThreadCard'
import React from 'react'

const RepliesTabContent = async ({
  currentUserId,
  userId
}: RepliesTabContentProps) => {
  const result = await getThreads()
  const filteredThreads = Object.values(result.threads).filter(thread =>
    thread.children.some(
      (child: any) => child.author._id.toString() === userId.toString()
    )
  )

  if (filteredThreads.length === 0) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <p className="text-light-400">Aún no hay respuestas.</p>
      </div>
    )
  }

  return (
    <div className="mt-2 w-full">
      {filteredThreads.map(async (thread: any) => {
        return (
          <React.Fragment key={thread._id}>
            {thread.children.map((comment: any) => (
              <ThreadCard
                key={comment._id}
                id={comment._id}
                currentUserId={currentUserId}
                parentId={comment.parentId}
                text={comment.text}
                image={comment.image}
                createdAt={comment.createdAt}
                author={{
                  username: comment.author.username,
                  name: comment.author.name,
                  image: comment.author.image,
                  _id: comment.author._id
                }}
                comments={comment.children}
                likes={comment.likes}
                isComment
                isProfile
              />
            ))}
            <Separator className="my-4 bg-light-400/50" />
          </React.Fragment>
        )
      })}
    </div>
  )
}
export default RepliesTabContent
