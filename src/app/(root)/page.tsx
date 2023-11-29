import PostThread from '@/components/forms/PostThread'
import { Separator } from '@/components/ui/separator'
import { getCurrentUser } from '@/lib/actions/user.action'

export default async function Home() {
  const user = await getCurrentUser()
  if (!user) return null

  return (
    <main>
      <PostThread user={user} />
      <Separator className="mt-4 bg-light-400" />
    </main>
  )
}
