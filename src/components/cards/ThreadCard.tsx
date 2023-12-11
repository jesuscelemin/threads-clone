import { ThreadCardProps } from '@/types'
import Avatar from '../shared/Avatar'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../ui/button'
import { getTimeStamp } from '@/lib/utils'
import LikeButton from '../shared/LikeButton'
import RepostButton from '../shared/RepostButton'
import MoreButton from '../shared/MoreButton'

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  image,
  text,
  createdAt,
  author,
  comments,
  isComment,
  isProfile,
  likes
}: ThreadCardProps) => {
  const showUsers = new Set()
  const isLiked = likes?.includes(currentUserId)

  return (
    <article
      className={`flex w-full py-3 ${isComment && !isProfile && 'pl-7'}`}
    >
      {/* Left */}
      <div className="flex h-auto flex-col items-center justify-between pr-4">
        <Link
          href={`/profile/${author._id}`}
          className="relative h-[36px] w-[36px]"
        >
          <Avatar
            src={author.image}
            isFill
            className="cursor-pointer rounded-full object-cover"
          />
        </Link>
        {comments && comments.length > 0 && (
          <div className="relative mt-2 w-0.5 flex-1 rounded-full bg-neutral-800 " />
        )}
        {!isComment && comments?.length > 0 && (
          <div className="mt-2 flex w-10 items-center justify-center">
            <div
              className={`${
                showUsers.size > 1 && 'ml-[.7rem]'
              } relative mb-[2px] h-5 w-5`}
            >
              {comments.slice(0, 2).map((comment, index) => {
                const { _id, image } = comment.author

                if (!showUsers.has(_id)) {
                  showUsers.add(_id)

                  return (
                    <Image
                      key={index}
                      src={image}
                      alt={`user_${index}`}
                      fill
                      className={`${
                        showUsers.size > 1 && index === 0 && '-ml-3'
                      } rounded-full border-2 border-dark-100 object-cover`}
                    />
                  )
                }
                return null
              })}
            </div>
          </div>
        )}
      </div>
      {/* Right */}
      <div className="flex h-full w-full flex-col items-start">
        <div className="flex w-full items-start justify-between">
          <Link href={`/profile/${author._id}`}>
            <h2 className="base-semibold cursor-pointer text-light-100">
              {author.username}
            </h2>
          </Link>

          <div className="flex items-start gap-2">
            <div className="text-light-400">{getTimeStamp(createdAt)}</div>
            <div className="text-light-100">
              <MoreButton
                currentUserId={currentUserId}
                authorId={JSON.stringify(author._id)}
                threadId={JSON.stringify(id)}
                parentId={JSON.stringify(parentId)}
                isComment={isComment!}
              />
            </div>
          </div>
        </div>
        <p className="mt-1 text-light-100">{text}</p>
        {image && (
          <div className="mt-2">
            <Image
              src={image}
              alt="Image"
              height={366}
              width={650}
              className="rounded-lg object-cover"
            />
          </div>
        )}

        <div className="mt-3 flex gap-3.5">
          <LikeButton
            threadId={JSON.stringify(id)}
            userId={JSON.stringify(currentUserId)}
            isLiked={isLiked!}
          />

          <Button className="rounded-full p-2 hover:bg-dark-200">
            <Link href={`/thread/${id}`}>
              <Image
                src="/assets/comment.svg"
                alt="comment"
                width={24}
                height={24}
                className="cursor-pointer object-contain "
              />
            </Link>
          </Button>
          <RepostButton
            threadId={JSON.stringify(id)}
            userId={JSON.stringify(currentUserId)}
          />
        </div>

        <div className="flex gap-2 text-light-400">
          {comments && comments.length > 0 && (
            <>
              <Link href={`/thread/${id}`}>
                <p>
                  {comments.length} respuest{comments.length > 1 ? 'as' : 'a'}
                </p>
              </Link>
            </>
          )}
          {comments && comments.length > 0 && likes && likes.length > 0 && (
            <span>·</span>
          )}
          {likes && likes.length > 0 && <div>{likes?.length} Me gusta</div>}
        </div>
      </div>
    </article>
  )
}
export default ThreadCard
