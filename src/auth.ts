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
  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account) {
        token.id = user?._id
        token.img = user.image
      }
      return token
    },
    async session({ session, token }: any) {
      session.user.id = token.id
      session.user.img = token.img

      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    newUser: '/register'
  }
})
