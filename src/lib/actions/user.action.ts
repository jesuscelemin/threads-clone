'use server'

import User from '@/models/user.model'
import { connectToDB } from '../mongoose'
import bcrypt from 'bcrypt'
import {
  CreateUserParams,
  GetUserByIdParams,
  GetUsersParams,
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

    return await User.findOne({ _id: userId })
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

    console.log(userId, updateData, path)

    await User.findByIdAndUpdate({ _id: userId }, updateData, { new: true })

    if (path === '/profile/edit') {
      revalidatePath(path)
    }
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

    const threads = await User.findOne({ _id: userId }).populate({
      path: 'threads',
      model: Thread,
      populate: {
        path: 'children',
        model: Thread,
        populate: {
          path: 'author',
          model: User,
          select: 'name username image _id'
        }
      }
    })

    return threads
  } catch (error) {
    console.error('Error mientras se buscaban los hilos:', error)
    throw new Error('Imposible encontrar los hilos')
  }
}

export async function getUsers({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc'
}: GetUsersParams) {
  try {
    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, 'i')

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId } // Exclude the current user from the results.
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
