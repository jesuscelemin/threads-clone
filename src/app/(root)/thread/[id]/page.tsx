import ThreadCard from '@/components/cards/ThreadCard'
import Comment from '@/components/forms/Comment'
import { getThreadById } from '@/lib/actions/thread.action'
import { getCurrentUser } from '@/lib/actions/user.action'

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null

  const user = await getCurrentUser()
  if (!user) return null

  const thread = await getThreadById(params.id)

  return (
    <section>
      <div>
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
          likes={thread.likes}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={thread.id}
          userImg={user.image}
          userId={user._id}
          username={user.username}
          author={thread.author.username}
        />
      </div>

      <div className="mt-7">
        {thread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem.id}
            id={childItem.id}
            currentUserId={user._id}
            parentId={childItem.parentId}
            text={childItem.text}
            image={childItem.image}
            createdAt={childItem.createdAt}
            author={childItem.author}
            community={childItem.community}
            comments={childItem.children}
            likes={childItem.likes}
            isComment
          />
        ))}
      </div>
    </section>
  )
}
export default page
