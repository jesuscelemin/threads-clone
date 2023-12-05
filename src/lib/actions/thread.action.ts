'use server'

import { connectToDB } from '../mongoose'
import {
  AddCommentToThreadParams,
  CreateThreadParams,
  RepostThreadParams
} from './shared.types'
import { revalidatePath } from 'next/cache'
import Thread from '@/models/thread.model'
import User from '@/models/user.model'

export async function createThread(params: CreateThreadParams) {
  try {
    await connectToDB()

    const { text, author, image, path } = params

    const createThread = await Thread.create({
      text,
      author,
      image,
      community: null
    })

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id }
    })

    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Error creando el hilo: ${error.message}`)
  }
}

export async function getThreads(pageNumber = 1, pageSize = 20) {
  try {
    await connectToDB()

    // Calculate de number of threads to skip
    const skipAmount = (pageNumber - 1) * pageSize

    // Get the threads that have no parents (top-level threads...) threads that are not comments.
    const threads = await Thread.find({
      parentId: { $in: [null, undefined] }
    })
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: 'author',
        model: User,
        select: '_id name username image'
      }) // Populate the author field with _id and username
      .populate({
        path: 'children',
        populate: {
          path: 'author', // Populate the author field within children
          model: User,
          select: '_id name username parentId image' // Select only _id and username fields of the author
        }
      })
      .exec()

    const totalThreadsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] }
    }) // Get the total count of threads

    const isNext = totalThreadsCount > skipAmount + threads.length

    return { threads, isNext }
  } catch (error: any) {
    console.log(`Error al obtener los hilos: ${error.message}`)
    throw new Error('Imposible obtener los hilos')
  }
}

export async function getThreadById(threadId: string) {
  try {
    await connectToDB()

    const thread = await Thread.findById(threadId)
      .populate({
        path: 'author',
        model: User,
        select: '_id name username image'
      }) // Populate the author field with _id and username
      .populate({
        path: 'children', // Populate the children field
        populate: [
          {
            path: 'author', // Populate the author field within children
            model: User,
            select: '_id name username parentId image' // Select only _id and username fields of the author
          },
          {
            path: 'children', // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: 'author', // Populate the author field within nested children
              model: User,
              select: '_id name username parentId image' // Select only _id and username fields of the author
            }
          }
        ]
      })
      .exec()

    return thread
  } catch (error) {
    console.error('Error mientras se buscaba el hilo:', error)
    throw new Error('Imposible encontrar el hilo')
  }
}

export async function addCommentToThread(params: AddCommentToThreadParams) {
  try {
    await connectToDB()

    const { commentText, userId, image, threadId, path } = params

    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadId)

    if (!originalThread) {
      throw new Error('Thread not found')
    }

    // Create the new comment thread
    const commentThread = new Thread({
      text: commentText,
      image,
      author: userId,
      parentId: threadId // Set the parentId to the original thread's ID
    })

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save()

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id)

    // Save the updated original thread to the database
    await originalThread.save()

    revalidatePath(path)
  } catch (error: any) {
    console.log(`Error mientras se agregaba el comentario: ${error.message}`)
    throw new Error('Imposible agregar el comentario')
  }
}

export async function getAllChildThreads(threadId: string): Promise<any[]> {
  try {
    await connectToDB()

    const childThreads = await Thread.find({
      parentId: threadId,
      repostedFrom: null
    })

    const descendantThreads = []

    for (const childThread of childThreads) {
      const descendants = await getAllChildThreads(childThread._id)
      descendantThreads.push(childThread, ...descendants)
    }

    return descendantThreads
  } catch (error) {
    console.error('Error mientras se buscaba el hilo:', error)
    throw new Error('Imposible encontrar el hilo')
  }
}

export async function likeThread(
  threadId: string,
  userId: string,
  path: string
) {
  try {
    await connectToDB()

    const thread = await Thread.findById(threadId)

    if (!thread) {
      throw new Error('Hilo no encontrado')
    }

    // Check if the user has already liked the thread
    const isLiked = thread.likes.includes(userId)

    let updateQuery = {}

    if (isLiked) {
      // If we already liked it, the like will be removed
      updateQuery = { $pull: { likes: userId } }
    } else {
      // If we didn't like it, the like will be added
      updateQuery = { $addToSet: { likes: userId } }
    }

    // Save the updated thread
    await Thread.findByIdAndUpdate(threadId, updateQuery, { new: true })

    revalidatePath(path)
  } catch (error) {
    console.error('Error mientras se buscaba el hilo:', error)
    throw new Error('Imposible encontrar el hilo')
  }
}

export async function getThreadLikes(threadId: string) {
  try {
    await connectToDB()

    const thread = await Thread.findById(threadId)

    if (!thread) {
      throw new Error('Hilo no encontrado')
    }

    const initialLikes = thread ? thread.likes.length : 0

    return initialLikes
  } catch (error) {
    console.error('Error mientras se buscaba el hilo:', error)
    throw new Error('Imposible encontrar el hilo')
  }
}

export async function repostThread(params: RepostThreadParams) {
  try {
    await connectToDB()

    const { originalThreadId, userId, path } = params

    const originalThread = await Thread.findById(originalThreadId)

    if (!originalThread) {
      throw new Error('Hilo original no encontrado')
    }

    const repostedThread = await Thread.create({
      text: originalThread.text,
      author: userId,
      image: originalThread.image,
      repostedFrom: userId,
      parentId: originalThread.parentId || originalThread._id
    })

    // Save the reposted thread to the database
    await repostedThread.save()

    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Error realizando el repost del hilo: ${error.message}`)
  }
}

export async function getRepostsByUser(userId: string) {
  try {
    await connectToDB()

    const reposts = await Thread.find({ repostedFrom: userId }).populate({
      path: 'author',
      model: User,
      select: 'name username image _id'
    })

    return reposts
  } catch (error) {
    console.error('Error mientras se buscaba el hilo:', error)
    throw new Error('Imposible encontrar el hilo')
  }
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB()

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate('author')

    if (!mainThread) {
      throw new Error('Thread not found')
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await getAllChildThreads(id)

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map(thread => thread._id)
    ]

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map(thread => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString()
      ].filter(id => id !== undefined)
    )

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } })

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    )

    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Error al borrar el hilo: ${error.message}`)
  }
}
