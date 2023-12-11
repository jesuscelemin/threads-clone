'use server'

import User from '@/models/user.model'
import { connectToDB } from '../mongoose'
import bcrypt from 'bcrypt'
import {
  CreateUserParams,
  GetSearchUsersParams,
  GetUserByIdParams,
  LoginUserParams,
  UpdateUserParams
} from './shared.types'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import Thread from '@/models/thread.model'
import { FilterQuery } from 'mongoose'

export async function getCurrentUser() {
  try {
    connectToDB()

    const session = await auth()
    if (!session?.user) return null

    const currentUser = await User.findOne({
      _id: session.user.id
    }).lean()

    if (!currentUser) return null

    return JSON.parse(JSON.stringify(currentUser))
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserById(params: GetUserByIdParams) {
  try {
    await connectToDB()

    const { userId } = params

    const currentUser = await User.findOne({ _id: userId }).lean()

    return JSON.parse(JSON.stringify(currentUser))
  } catch (error: any) {
    throw new Error(`Error al buscar el usuario: ${error.message}`)
  }
}

export async function createUser(params: CreateUserParams) {
  try {
    connectToDB()

    const { name, email, password } = params

    const user = await User.findOne({ email })

    if (user) return { message: 'El email ya existe' }

    const newUser = new User({
      email: email.toLocaleLowerCase(),
      hashedPassword: bcrypt.hashSync(password, 10),
      name
    })

    await newUser.save()
    revalidatePath('/register')
    return JSON.stringify(user)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDB()

    const { userId, updateData, path } = params

    await User.findByIdAndUpdate({ _id: userId }, updateData, { new: true })

    revalidatePath(path)
  } catch (error) {
    console.log('Error actualizando al usuario: ', error)
    throw error
  }
}

export async function loginUser(params: LoginUserParams) {
  try {
    connectToDB()

    const { email, password } = params

    const user = await User.findOne({ email })

    if (!user) return { message: 'El email no existe' }

    const isPasswordValid = bcrypt.compareSync(password, user.hashedPassword)

    if (!isPasswordValid) return { message: 'Contraseña incorrecta' }

    return { user: JSON.stringify(user) }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserThreads(userId: string) {
  try {
    await connectToDB()

    const threads = await User.findOne({ _id: userId })
      .populate({
        path: 'threads',
        model: Thread,
        populate: [
          {
            path: 'author', // Populate the author field within children
            model: User,
            select: '_id name username parentId image' // Select only _id and username fields of the author
          },
          {
            path: 'children', // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: 'author', // Populate the author field within nested children
              model: User,
              select: '_id name username parentId image' // Select only _id and username fields of the author
            }
          }
        ]
      })
      .exec()

    return threads
  } catch (error) {
    console.error('Error mientras se buscaban los hilos:', error)
    throw new Error('Imposible encontrar los hilos')
  }
}

export async function getSearchUsers({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc'
}: GetSearchUsersParams) {
  try {
    if (searchString.trim() === '') {
      return { users: [], isNext: false }
    }
    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, 'i')

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      _id: { $ne: userId } // Exclude the current user from the results.
    }

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== '') {
      query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }]
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy }

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query)

    const users = await usersQuery.exec()

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length

    return { users, isNext }
  } catch (error) {
    console.error('Error mientras se buscaban los usuarios:', error)
    throw new Error('Imposible encontrar los usuarios')
  }
}

export async function getActivity(userId: string) {
  try {
    await connectToDB()

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId })

    // Collect all the child thread ids from the children field
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children)
    }, [])

    const replies = await Thread.find({
      _id: { $in: childThreadIds }, // Find all replies to the child threads
      author: { $ne: userId } // Exclude the user from the results
    }).populate({
      path: 'author',
      model: User,
      select: 'username name image _id'
    })

    return replies
  } catch (error: any) {
    throw new Error(`Error al obtener la actividad: ${error.message}`)
  }
}

export async function followUser(
  currentUserId: string,
  userIdToFollow: string,
  path: string
): Promise<void | null> {
  try {
    await connectToDB()

    const currentUser = await User.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { following: userIdToFollow } },
      { new: true }
    )

    const userToFollow = await User.findByIdAndUpdate(
      userIdToFollow,
      { $addToSet: { followers: currentUserId } },
      { new: true }
    )

    if (!currentUser || !userToFollow) {
      throw new Error('Usuario no encontrado')
    }

    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Error al seguir al usuario: ${error.message}`)
  }
}

export async function unfollowUser(
  currentUserId: string,
  userIdToUnfollow: string,
  path: string
): Promise<void | null> {
  try {
    await connectToDB()

    const currentUser = await User.findByIdAndUpdate(
      currentUserId,
      { $pull: { following: userIdToUnfollow } },
      { new: true }
    )

    const userToUnfollow = await User.findByIdAndUpdate(
      userIdToUnfollow,
      { $pull: { followers: currentUserId } },
      { new: true }
    )

    if (!currentUser || !userToUnfollow) {
      throw new Error('Usuario no encontrado')
    }

    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Error al dejar de seguir al usuario: ${error.message}`)
  }
}

export async function isUserFollowing(
  currentUserId: string,
  targetUserId: string
): Promise<boolean> {
  try {
    await connectToDB()

    const currentUser = await User.findById(currentUserId)

    if (!currentUser) {
      throw new Error('Usuario no encontrado')
    }

    return currentUser.following.includes(targetUserId)
  } catch (error: any) {
    throw new Error(
      `Error al verificar si el usuario sigue a otro usuario: ${error.message}`
    )
  }
}

export async function getUsers(userId: string) {
  try {
    await connectToDB()

    const users = await User.find({ _id: { $ne: userId } })

    return users
  } catch (error: any) {
    throw new Error(`Error al encontrar los usuarios: ${error.message}`)
  }
}

export async function getUsersNotFollowing(userIdToExclude: string) {
  try {
    await connectToDB()

    const usersNotFollowing = await User.find({
      _id: { $ne: userIdToExclude },
      followers: { $ne: userIdToExclude }
    })

    return usersNotFollowing
  } catch (error: any) {
    throw new Error(`Error al obtener usuarios: ${error.message}`)
  }
}
