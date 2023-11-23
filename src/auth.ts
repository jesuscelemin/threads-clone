import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import User from './models/user.model'
import bcrypt from 'bcrypt'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials)

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data
            console.log(email, password)

            const user = await User.findOne({ email })

            if (!user) return null
            const passwordsMatch = await bcrypt.compare(
              password,
              user.hashedPassword!
            )

            if (passwordsMatch) return user
          }
          console.log('Credenciales Inválidas')
          return null
        } catch (error) {
          console.log(error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    newUser: '/register'
  }
})
