'use server'
import Thread from "@/models/thread.model";
import { connectToDB } from "../mongoose";
import { CreateThreadParams } from "./shared.types";
import User from "@/models/user.model";
import { revalidatePath } from "next/cache";

export async function createThread(params: CreateThreadParams) {
  try {
    connectToDB()

    const { text, author, image, communityId, path } = params

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