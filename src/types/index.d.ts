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
