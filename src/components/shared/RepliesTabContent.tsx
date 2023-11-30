import { getAllChildThreads } from '@/lib/actions/thread.action'
import { getUserThreads } from '@/lib/actions/user.action'
import { RepliesTabContentProps } from '@/types'
import { Separator } from '../ui/separator'
import ThreadCard from '../cards/ThreadCard'

const RepliesTabContent = async ({
  currentUserId,
  userId
}: RepliesTabContentProps) => {
  const result = await getUserThreads(userId)

  return (
    <div className="w-full">
      {result.threads.map(async (thread: any) => {
        const comments = await getAllChildThreads(thread._id)
        return (
          <>
            {comments.map(comment => (
              <ThreadCard
                key={comment.id}
                id={comment.id}
                currentUserId={userId}
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
                isComment
              />
            ))}
            <Separator className="mt-4 bg-light-400/50" />
          </>
        )
      })}
    </div>
  )
}
export default RepliesTabContent
