import RepliesTabContent from './RepliesTabContent'
import RepostsTabContent from './RepostsTabContent'
import ThreadsTabContent from './ThreadsTabContent'

const ContainerTabs = ({
  currentUserId,
  userId,
  tabType
}: {
  currentUserId: string
  userId: string
  tabType: string
}) => {
  return (
    <>
      {tabType === 'threads' && (
        <ThreadsTabContent currentUserId={currentUserId} userId={userId} />
      )}
      {tabType === 'replies' && (
        <RepliesTabContent currentUserId={currentUserId} userId={userId} />
      )}
      {tabType === 'reposts' && (
        <RepostsTabContent currentUserId={currentUserId} userId={userId} />
      )}
    </>
  )
}
export default ContainerTabs
