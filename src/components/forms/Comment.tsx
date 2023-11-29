'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Textarea } from '../ui/textarea'
import Avatar from '../shared/Avatar'
import { Button } from '../ui/button'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import { Input } from '../ui/input'
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadthing'
import { CommentProps } from '@/types'
import Link from 'next/link'
import { Label } from '@radix-ui/react-label'
import { CommentValidation } from '@/validations/comment'
import { addCommentToThread } from '@/lib/actions/thread.action'

const Comment = ({
  threadId,
  userImg,
  author,
  userId,
  username
}: CommentProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [files, setFiles] = useState<File[]>([])
  const [imgUrl, setImgUrl] = useState('')
  const { startUpload } = useUploadThing('media')

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: '',
      image: ''
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

  const handleCreateComment = async (
    values: z.infer<typeof CommentValidation>
  ) => {
    try {
      const blob = values.image || ''

      const hasImageChanged = isBase64Image(blob)
      if (hasImageChanged) {
        const imgRes = await startUpload(files)

        if (imgRes && imgRes[0].url) {
          values.image = imgRes[0].url
        }
      }

      await addCommentToThread({
        threadId,
        image: values.image || '',
        commentText: values.comment || '',
        userId,
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
      <form
        onSubmit={form.handleSubmit(handleCreateComment)}
        className="flex w-full pb-3"
      >
        <Link
          href={`/profile/${userId}`}
          className="relative mr-4 h-[36px] w-[36px]"
        >
          <Avatar
            src={userImg}
            isFill
            className="cursor-pointer rounded-full object-cover"
          />
        </Link>

        <div className="flex h-full w-full flex-col items-start gap-5">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <Label className="base-semibold text-light-100">
                  @{username}
                </Label>
                <FormControl>
                  <Textarea
                    rows={1}
                    placeholder={`Responder a ${author}`}
                    className="w-full resize-none rounded-xl border border-transparent bg-transparent p-0 text-light-200 focus-visible:ring-transparent focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex w-full items-center justify-between">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="relative flex w-fit cursor-pointer items-center justify-center rounded-full bg-dark-100">
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
              className="border-light-400 px-5 text-light-400 hover:border-light-100 hover:text-light-100"
              variant="outline"
            >
              Publicar
            </Button>
          </div>

          {/* Image Preview */}
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
        </div>
      </form>
    </Form>
  )
}
export default Comment
