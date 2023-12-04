'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '../ui/input'

const SearchBar = ({ routeType }: { routeType: string }) => {
  const router = useRouter()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/${routeType}?q=` + search)
      } else {
        router.push(`/${routeType}`)
      }
    }, 300)

    return () => {
      clearTimeout(delayDebounceFn)
    }
  }, [search, routeType, router])

  return (
    <div className="mt-4 flex items-center gap-4 rounded-lg bg-dark-400 px-4">
      <Image
        src="/assets/search.svg"
        alt="search"
        width={20}
        height={20}
        className="object-contain"
      />
      <Input
        id="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar"
        className="base-regular border-none bg-dark-400 text-light-100 shadow-none outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
      />
    </div>
  )
}
export default SearchBar
