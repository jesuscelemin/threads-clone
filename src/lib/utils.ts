import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/
  return base64Regex.test(imageData)
}

export const getTimeStamp = (createdAt: Date): string => {
  const date = new Date(createdAt)
  const now = new Date()

  const diffMilliseconds = now.getTime() - date.getTime()
  const diffSeconds = Math.round(diffMilliseconds / 1000)
  if (diffSeconds < 60) {
    return `${diffSeconds} segundo${diffSeconds !== 1 ? 's' : ''}`
  }

  const diffMinutes = Math.round(diffSeconds / 60)
  if (diffMinutes < 60) {
    return `${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} hora${diffHours !== 1 ? 's' : ''}`
  }

  const diffDays = Math.round(diffHours / 24)

  return `${diffDays} día${diffDays !== 1 ? 's' : ''}`
}
