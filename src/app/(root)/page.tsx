import RepostCard from '@/components/cards/RepostCard'
import ThreadCard from '@/components/cards/ThreadCard'
import PostThread from '@/components/forms/PostThread'
import { Separator } from '@/components/ui/separator'
import { getThreads } from '@/lib/actions/thread.action'
import { getCurrentUser } from '@/lib/actions/user.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default async function Home() {
  const user = await getCurrentUser()
  if (!user) return null

  const result = await getThreads(1, 30)

  return (
    <main>
      <div className="fixed left-0 top-0 z-10 mb-2 flex h-[74px] w-full items-center justify-center bg-dark-100 md:hidden">
        <Link
          href="/"
          className="flex items-center justify-center gap-4 p-6 lg:justify-start"
        >
          <Image
            src="/assets/logo.svg"
            alt="logo"
            width={32}
            height={32}
            className="transition duration-500 hover:scale-110"
          />
        </Link>
      </div>

      <PostThread user={user} />
      <Separator className="my-4 bg-light-400" />

      {result?.threads.length === 0 ? (
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-light-400">Aún no hay hilos</p>
        </div>
      ) : (
        <>
          {result?.threads.map(thread => {
            return (
              <React.Fragment key={thread.id}>
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

                <Separator className="my-4 bg-light-400/50" />
              </React.Fragment>
            )
          })}
        </>
      )}
    </main>
  )
}
