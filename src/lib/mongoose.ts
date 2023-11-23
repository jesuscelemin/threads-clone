import mongoose from 'mongoose'

let isConnected: boolean = false // Variable to track the connection status

export const connectToDB= async () => {
  // Set strict query mode for Mongoose to prevent unknown field queries.
  mongoose.set('strictQuery', true)

  if (!process.env.MONGODB_URL) return console.log('MISSING MONGODB_URL')

  // If the connection is already established, return without creating a new connection.
  if (isConnected) return console.log('MongoDB is already connected')

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'threads'
    })

    isConnected = true // Set the connection status to true

    console.log('MongoDB is connected')
  } catch (error) {
    console.log('MongoDB connection failed', error)
  }
}
