import Profile from '@/components/shared/Profile'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { profileTabs } from '@/constants'
import { getCurrentUser, getUserById } from '@/lib/actions/user.action'
import ContainerTabs from '@/components/shared/ContainerTabs'

const page = async ({ params }: { params: { id: string } }) => {
  const user = await getCurrentUser()
  if (!user) return null

  const userInfo = await getUserById({ userId: params.id })

  return (
    <section>
      <Profile
        currentUser={user}
        userId={userInfo._id}
        name={userInfo.name}
        image={userInfo.image}
        username={userInfo.username}
        bio={userInfo.bio}
        followersNumber={userInfo.followers.length}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="flex">
            {profileTabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="tab">
                <p>{tab.label}</p>
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map(tab => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="flex h-full w-full text-light-100"
            >
              <ContainerTabs
                currentUserId={user._id}
                userId={userInfo._id}
                tabType={tab.value}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
export default page
