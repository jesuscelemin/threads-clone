import { IUser } from '@/models/user.model'

export interface AvatarProps {
  src: string | null | undefined
  width?: number
  height?: number
  className?: string
  isFill?: boolean
}

export interface DropdownMenuProps {
  userId: string
}

export interface SidebarLeftProps {
  user: Partial<IUser>
}

export interface ProfileProps {
  user: {
    _id: string
    name: string
    username: string
    image: string
    bio: string
  }
  btnTitle: string
}

export interface PostThreadProps {
  user: Partial<IUser>
}

export interface ThreadCardProps {
  id: string
  currentUserId: string
  parentId: string | null
  text: string
  image: string
  createdAt: Date
  author: {
    name: string
    image: string
    _id: string
  }
  community: {
    id: string
    name: string
    image: string
  } | null
  comments: {
    author: {
      image: string
    }
  }[]
  isComment?: boolean
}

export interface CommentProps {
  threadId: string
  userImg: string
  author: string
  userId: string
  username: string
}

export interface ProfileInfoProps {
  currentUserId: string
  userId: string
  name: string
  image: string
  username: string
  bio: string
}

export interface ThreadsTabContentProps {
  currentUserId: string
  userId: string
}

export interface RepliesTabContentProps {
  currentUserId: string
  userId: string
}
