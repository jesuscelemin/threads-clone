/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { getThreads } from '@/lib/actions/thread.action'
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import RepostCard from '../cards/RepostCard'
import ThreadCard from '../cards/ThreadCard'
import { Separator } from '../ui/separator'
import { Spinner } from '../ui/spinner'

const LoadMore = ({ userId }: { userId: string }) => {
  const [data, setData] = useState<any[]>([])
  const [page, setPage] = useState<number>(2)
  const [isNext, setIsNext] = useState(true)

  const { ref, inView } = useInView({
    threshold: 0.5
  })

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const fetchNextThreads = async () => {
    await delay(1000)
    const { threads, isNext: hasNext } = await getThreads(page)
    setData(prevData => [...prevData, ...threads])
    setPage(prevPage => prevPage + 1)
    setIsNext(hasNext)
  }

  useEffect(() => {
    if (inView) {
      fetchNextThreads()
    }
  }, [inView])

  return (
    <>
      {data &&
        data.map(thread => {
          return (
            <React.Fragment key={thread.id}>
              {thread.repostedFrom ? (
                <RepostCard
                  id={thread.id}
                  currentUserId={userId}
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
                  currentUserId={userId}
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

      {isNext && (
        <div className="col-span-1 flex items-center justify-center p-4 sm:col-span-2 md:col-span-3">
          <Spinner />
        </div>
      )}

      <div className="h-5" ref={ref} />
    </>
  )
}
export default LoadMore
