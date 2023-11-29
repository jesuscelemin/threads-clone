'use server'

import { connectToDB } from '../mongoose'
import { AddCommentToThreadParams, CreateThreadParams } from './shared.types'
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
    throw new Error(`Error creatndo el hilo: ${error.message}`)
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
      .populate({ path: 'author', model: User })
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
