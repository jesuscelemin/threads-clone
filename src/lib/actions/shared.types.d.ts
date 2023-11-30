import { IUser } from '@/models/user.model'

export interface CreateUserParams {
  name: string
  email: string
  password: string
}

export interface GetUserByIdParams {
  userId: string
}

export interface LoginUserParams {
  email: string
  password: string
}

export interface UpdateUserParams {
  userId: string
  updateData: Partial<IUser>
  path: string
}

export interface CreateThreadParams {
  text: string
  image: string
  author: string
  path: string
  communityId: string | null
}

export interface AddCommentToThreadParams {
  threadId: string
  commentText: string
  image: string
  userId: string
  path: string
}
