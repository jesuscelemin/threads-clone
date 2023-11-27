import { AvatarProps } from '@/types'
import clsx from 'clsx'
import Image from 'next/image'

const Avatar = ({ src, width, height, className }: AvatarProps) => {
  return (
    <Image
      src={src ?? '/assets/placeholder.svg'}
      alt="Avatar"
      height={height}
      width={width}
      priority
      className={clsx(className)}
    />
  )
}
export default Avatar
