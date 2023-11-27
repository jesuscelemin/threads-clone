import { AvatarProps } from '@/types'
import clsx from 'clsx'
import Image from 'next/image'

const Avatar = ({ src, width, height, isFill, className }: AvatarProps) => {
  return (
    <Image
      src={src ?? '/assets/placeholder.svg'}
      alt="Avatar"
      width={width}
      height={height}
      fill={isFill}
      className={clsx(className)}
    />
  )
}
export default Avatar
