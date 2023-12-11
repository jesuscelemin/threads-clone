'use client'

import { ProfileProps } from '@/types'
import { ProfileSchema } from '@/validations/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadthing'
import { updateUser } from '@/lib/actions/user.action'
import Avatar from '../shared/Avatar'
import { toast } from '../ui/use-toast'

const Profile = ({ user, btnTitle }: ProfileProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [files, setFiles] = useState<File[]>([])
  const { startUpload } = useUploadThing('media')

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name || '',
      username: user.username || '',
      bio: user.bio || '',
      image: user.image || ''
    }
  })

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault()

    const fileReader = new FileReader()

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      setFiles(Array.from(e.target.files))

      if (!file.type.includes('image')) return

      fileReader.onload = async e => {
        const imageUrl = e.target?.result?.toString() || ''

        fieldChange(imageUrl)
      }

      fileReader.readAsDataURL(file)
    }
  }

  const handleUpdateProfile = async (values: z.infer<typeof ProfileSchema>) => {
    try {
      const blob = values.image

      const hasImageChanged = isBase64Image(blob)
      if (hasImageChanged) {
        const imgRes = await startUpload(files)

        if (imgRes && imgRes[0].url) {
          values.image = imgRes[0].url
        }
      }

      await updateUser({
        userId: user._id,
        updateData: {
          name: values.name,
          username: values.username.toLowerCase(),
          bio: values.bio,
          image: values.image,
          onboarded: true
        },
        path: pathname
      })

      toast({
        title: 'Usuario actualizado con éxito'
      })
      router.push('/')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar el usuario'
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateProfile)}
        className="flex flex-col justify-start gap-5"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-dark-100">
                <Avatar
                  src={field.value}
                  isFill
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-light-100">Nombre</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="min-h-[55px] w-full rounded-xl border border-transparent bg-dark-200 p-4 text-light-200 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-light-100">Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="min-h-[55px] w-full rounded-xl border border-transparent bg-dark-200 p-4 text-light-200 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-light-100">Bio</FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="min-h-[55px] w-full rounded-xl border border-transparent bg-dark-200 p-4 text-light-200 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="rounded-lg bg-light-100 font-semibold text-dark-100"
        >
          {btnTitle}
        </Button>
      </form>
    </Form>
  )
}
export default Profile
