import Profile from '@/components/forms/Profile'
import { getCurrentUser } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'

const page = async () => {
  const user = await getCurrentUser()

  if (!user) redirect('/login')

  if (user.onboarded) redirect('/')

  return (
    <section className="mt-[15vh] w-full p-6 md:max-w-[400px]">
      <h1 className="h1-bold mb-4 text-light-100">Onboarding</h1>
      <p className="mb-4 text-light-100">
        Completa tu perfíl, para usar Threads.
      </p>
      <Profile user={user} btnTitle='Continuar'/>
    </section>
  )
}

export default page
