import { getAllChildThreads } from '@/lib/actions/thread.action'
import { getUserThreads } from '@/lib/actions/user.action'
import { RepliesTabContentProps } from '@/types'
import { Separator } from '../ui/separator'
import ThreadCard from '../cards/ThreadCard'
import React from 'react'

const RepliesTabContent = async ({
  currentUserId,
  userId
}: RepliesTabContentProps) => {
  const result = await getUserThreads(userId)
  const threads = result.threads || []

  return (
    <div className="mt-2 w-full">
      {threads.map(async (thread: any) => {
        const comments = (await getAllChildThreads(thread._id)) || []

        return (
          <React.Fragment key={thread._id}>
            {comments.length > 0 ? (
              <>
                {comments.map((comment: any) => (
                  <React.Fragment key={comment.id}>
                    <ThreadCard
                      id={comment.id}
                      currentUserId={currentUserId}
                      parentId={comment.parentId}
                      text={comment.text}
                      image={comment.image}
                      createdAt={comment.createdAt}
                      author={{
                        name: result.name,
                        image: result.image,
                        _id: result.id
                      }}
                      community={comment.community}
                      comments={comment.children}
                      likes={comment.likes}
                      isComment
                      isProfile
                    />
                    <Separator className="mt-4 bg-light-400/50" />
                  </React.Fragment>
                ))}
              </>
            ) : (
              <div className="flex h-[50vh] w-full items-center justify-center">
                <p className="text-light-400">Aún no hay respuestas.</p>
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
export default RepliesTabContent
