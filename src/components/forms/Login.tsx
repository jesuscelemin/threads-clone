'use client'

import { LoginSchema } from '@/validations/auth'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { loginUser } from '@/lib/actions/user.action'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useToast } from '../ui/use-toast'


const Login = () => {
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleLogin = async (data: z.infer<typeof LoginSchema>) => {
    try {
      const res = await loginUser({
        email: data.email,
        password: data.password
      })

      if (res.user) {
        const user = JSON.parse(res.user)

        if (user) {
          await signIn('credentials', {
            email: user.email,
            password: data.password,
            redirect: false
          })

          if (!user.onboarded) {
            router.push('/onboarding')
          } else {
            router.push('/')
          }
        }
      }
    } catch (error: any) {
      toast({
        title: error.message,
        variant: 'destructive',
        description: 'Inténtalo de nuevo.'
      })
      console.log(error.message)
    }
  }

  return (
    <Form {...form}>
      <form
        className="w-full max-w-[370px] p-6"
        onSubmit={form.handleSubmit(handleLogin)}
      >
        <div className="flex w-full flex-col items-center">
          <span className="base-semibold mb-4 text-light-200">
            Inicia sesión
          </span>
          <div className="mb-2 w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      className="min-h-[55px] w-full rounded-xl border border-transparent bg-dark-200 p-4 text-light-200 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      placeholder="Correo electrónico"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-2 w-full">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      className="min-h-[55px] w-full rounded-xl border border-transparent bg-dark-200 p-4 text-light-200 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      placeholder="Contraseña"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="min-h-[55px] w-full rounded-xl border border-transparent bg-white p-4 text-black"
          >
            Iniciar sesión
          </Button>
        </div>

        <div className="mt-4 flex w-full justify-end text-light-400">
          <p className="small-regular">
            ¿Aún no tienes cuenta?{' '}
            <Link href="/register" className="small-semibold cursor-pointer">
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </Form>
  )
}
export default Login
