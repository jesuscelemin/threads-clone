import UserCard from '@/components/cards/UserCard'
import SearchBar from '@/components/shared/SearchBar'
import { Separator } from '@/components/ui/separator'
import { getCurrentUser, getUsers } from '@/lib/actions/user.action'

const page = async ({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined }
}) => {
  const user = await getCurrentUser()

  const result = await getUsers({
    userId: user._id,
    searchString: searchParams.q,
    pageNumber: searchParams.page ? +searchParams.page : 1,
    pageSize: 25
  })

  return (
    <section>
      <h1 className="h1-bold text-light-100">Buscar</h1>

      <SearchBar routeType="search" />

      <div className="mt-14 flex flex-col gap-8">
        {result.users.length === 0 ? (
          <div className="flex h-[50vh] items-center justify-center">
            <p className="text-light-400">No hay usuarios</p>
          </div>
        ) : (
          <>
            {result.users.map(user => (
              <>
                <UserCard
                  key={user._id}
                  id={JSON.stringify(user._id)}
                  name={user.name}
                  username={user.username}
                  image={user.image}
                />

                <Separator className="bg-light-400/50" />
              </>
            ))}
          </>
        )}
      </div>
    </section>
  )
}
export default page
