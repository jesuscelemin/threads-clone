import PostThread from '@/components/forms/PostThread'
import { getCurrentUser } from '@/lib/actions/user.action'

const page = async () => {
  const user = await getCurrentUser()

  if (!user) return null

  return (
    <section>
      <h1 className="h1-semibold text-light-100">Crear Hilo</h1>

      <PostThread user={user} />
    </section>
  )
}
export default page
