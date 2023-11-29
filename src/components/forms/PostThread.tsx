'use client'

import { PostThreadProps } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { ThreadValidation } from '@/validations/thread'
import { Textarea } from '../ui/textarea'
import Avatar from '../shared/Avatar'
import { Label } from '@radix-ui/react-label'
import { Button } from '../ui/button'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import { Input } from '../ui/input'
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadthing'
import { createThread } from '@/lib/actions/thread.action'

const PostThread = ({ user }: PostThreadProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [files, setFiles] = useState<File[]>([])
  const [imgUrl, setImgUrl] = useState('')
  const { startUpload } = useUploadThing('media')

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: '',
      image: '',
      accountId: user._id
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
        setImgUrl(imageUrl)

        fieldChange(imageUrl)
      }

      fileReader.readAsDataURL(file)
    }
  }

  const handleImageRemove = () => {
    setImgUrl('')
    setFiles([])
  }

  const handleCreateThread = async (
    values: z.infer<typeof ThreadValidation>
  ) => {
    try {
      const blob = values.image

      const hasImageChanged = isBase64Image(blob)
      if (hasImageChanged) {
        const imgRes = await startUpload(files)

        if (imgRes && imgRes[0].url) {
          values.image = imgRes[0].url
        }
      }

      await createThread({
        text: values.thread,
        image: values.image,
        author: user._id,
        communityId: null,
        path: pathname
      })

      handleImageRemove()
      form.reset()

      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateThread)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem>
              <FormControl className="flex w-full">
                <div className="flex w-10 items-start py-1">
                  <div className="relative h-10 w-10">
                    <Avatar
                      src={user.image}
                      isFill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex w-full flex-col items-start">
                    <Label
                      htmlFor="thread"
                      className="base-semibold pl-4 text-light-100"
                    >
                      @{user.username}
                    </Label>
                    <Textarea
                      id="thread"
                      rows={1}
                      placeholder="Inicia un hilo..."
                      className="w-full resize-none rounded-xl border border-transparent bg-transparent px-4 pb-0 pt-1 text-light-200 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      {...field}
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="mt-2 flex w-full items-center justify-between">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-dark-100">
                  <Image
                    src="/assets/clip.svg"
                    alt="clip"
                    width={22}
                    height={22}
                    className="object-contain"
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
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="px-5 text-light-200"
            variant="outline"
          >
            Publicar
          </Button>
        </div>
        <div className="flex w-full items-center justify-center">
          {imgUrl && files.length > 0 && (
            <div className="relative h-[20rem] w-full rounded-lg">
              <Button
                className="absolute right-1 top-1 z-10 cursor-pointer rounded-lg bg-dark-100/90 hover:bg-dark-100/80"
                onClick={handleImageRemove}
              >
                <Image
                  src="/assets/trash.svg"
                  alt="close"
                  width={20}
                  height={20}
                />
              </Button>
              <Image
                src={imgUrl}
                fill
                alt="img"
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </form>
    </Form>
  )
}
export default PostThread
