import Link from 'next/link'
import Avatar from '../shared/Avatar'
import Image from 'next/image'
import { RepostCardProps } from '@/types'
import LikeButton from '../shared/LikeButton'
import { Button } from '../ui/button'
import RepostButton from '../shared/RepostButton'
import MoreButton from '../shared/MoreButton'
import { getTimeStamp } from '@/lib/utils'

const RepostCard = ({
  id,
  currentUserId,
  parentId,
  image,
  text,
  createdAt,
  author,
  comments,
  isComment,
  likes,
  repostedFrom
}: RepostCardProps) => {
  const showUsers = new Set()
  const isLiked = likes?.includes(currentUserId)

  return (
    <article className="flex w-full py-3">
      {/* Left */}
      <div className="flex h-auto flex-col items-center justify-between pr-4">
        <Link
          href={`/profile/${repostedFrom._id}`}
          className="relative h-[36px] w-[36px]"
        >
          <Avatar
            src={repostedFrom.image}
            isFill
            className="cursor-pointer rounded-full object-cover"
          />
        </Link>
        {comments && comments.length > 0 && (
          <div className="relative mt-2 w-0.5 flex-1 rounded-full bg-neutral-800 " />
        )}
        {comments?.length > 0 && (
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
          <Link href={`/profile/${repostedFrom._id}`}>
            <h2 className="base-semibold cursor-pointer text-light-100">
              {repostedFrom.username}
            </h2>
          </Link>

          <div className="flex items-start gap-2">
            <div className="text-light-400">{getTimeStamp(createdAt)}</div>
            <div className="text-light-100">
              <MoreButton
                currentUserId={currentUserId}
                authorId={JSON.stringify(repostedFrom._id)}
                threadId={JSON.stringify(id)}
                parentId={JSON.stringify(parentId)}
                isComment={isComment!}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-2 w-full border-2 border-dark-400 p-4">
          <div className="flex w-full items-start">
            {/* Left */}
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

            {/* Right */}
            <div className="flex h-full w-full flex-col items-start pl-4">
              <div className="flex w-full items-start justify-between">
                <Link href={`/profile/${author._id}`}>
                  <h2 className="base-semibold cursor-pointer text-light-100">
                    {author.username}
                  </h2>
                </Link>

                <div className="text-light-400">
                  {getTimeStamp(parentId?.createdAt)}
                </div>
              </div>

              {/* Content */}
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

              {/* Counts */}
              <div className="mt-4 flex gap-2 text-light-400">
                {parentId?.children && parentId?.children.length > 0 && (
                  <>
                    <Link href={`/thread/${id}`}>
                      <p>
                        {parentId?.children.length} respuest
                        {parentId?.children.length > 1 ? 'as' : 'a'}
                      </p>
                    </Link>
                  </>
                )}
                {parentId?.children &&
                  parentId?.children.length > 0 &&
                  parentId?.likes &&
                  parentId?.likes.length > 0 && <span>·</span>}
                {parentId?.likes && parentId?.likes.length > 0 && (
                  <div>{parentId?.likes?.length} Me gusta</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
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

        {/* Counts */}
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
export default RepostCard
