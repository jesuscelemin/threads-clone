'use client'

import { RegisterSchema } from '@/validations/user'
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
import { createUser } from '@/lib/actions/user.action'
import { useRouter } from 'next/navigation'

const Register = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const handleRegister = async (data: z.infer<typeof RegisterSchema>) => {
    try {
      const user = await createUser({
        name: data.name,
        email: data.email,
        password: data.password
      })

      if (user) {
        form.reset()
        router.push('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form
        className="w-full max-w-[370px] p-6"
        onSubmit={form.handleSubmit(handleRegister)}
      >
        <div className="flex w-full flex-col items-center">
          <span className="base-semibold mb-4 text-light-200">
            Registro nuevo usuario
          </span>
          <div className="mb-2 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="min-h-[55px] w-full rounded-xl border border-transparent bg-dark-200 p-4 text-light-200 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      placeholder="Nombre"
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
            Registrarse
          </Button>
        </div>

        <div className="mt-4 flex w-full justify-end text-light-400">
          <p className="small-regular">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="small-semibold cursor-pointer">
              Logueate
            </Link>
          </p>
        </div>
      </form>
    </Form>
  )
}
export default Register
