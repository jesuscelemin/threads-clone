import RepostCard from '@/components/cards/RepostCard'
import ThreadCard from '@/components/cards/ThreadCard'
import Comment from '@/components/forms/Comment'
import { Separator } from '@/components/ui/separator'
import { getThreadById } from '@/lib/actions/thread.action'
import { getCurrentUser } from '@/lib/actions/user.action'
import React from 'react'


const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null

  const user = await getCurrentUser()
  if (!user) return null

  const thread = await getThreadById(params.id)

  return (
    <section>
      <div>
        {thread.repostedFrom ? (
          <RepostCard
            id={thread.id}
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
            key={thread.id}
            id={thread.id}
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
      </div>

      <div className="mt-7">
        <Comment
          threadId={thread.id}
          userImg={user.image}
          userId={user._id}
          username={user.username}
          author={`${
            thread.repostedFrom
              ? thread.repostedFrom.username
              : thread.author.username
          }`}
        />
        <Separator className="my-4 bg-light-400" />
      </div>

      <div className="mt-7">
        {thread.children.map((childItem: any) => (
          <React.Fragment key={childItem.id}>
            <ThreadCard
              id={childItem.id}
              currentUserId={user._id}
              parentId={childItem.parentId}
              text={childItem.text}
              image={childItem.image}
              createdAt={childItem.createdAt}
              author={childItem.author}
              comments={childItem.children}
              likes={childItem.likes}
              isComment
            />
            <Separator className="my-4 bg-light-400/50" />
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}
export default page
