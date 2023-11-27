'use server'

import User from '@/models/user.model'
import { connectToDB } from '../mongoose'
import bcrypt from 'bcrypt'
import { CreateUserParams, LoginUserParams } from './shared.types'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { UpdateUserParams } from '@/types'

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
