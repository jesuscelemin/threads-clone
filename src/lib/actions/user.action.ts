'use server'

import User from '@/models/user.model'
import { connectToDB } from '../mongoose'
import bcrypt from 'bcrypt'
import { CreateUserParams, LoginUserParams } from './shared.types'
import { revalidatePath } from 'next/cache'

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
