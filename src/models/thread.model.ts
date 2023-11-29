import mongoose, { Schema, models, model, Document } from 'mongoose'

export interface IThread extends Document {
  text: string
  author: Schema.Types.ObjectId
  image: string
  community: Schema.Types.ObjectId
  parentId: string
  children: Schema.Types.ObjectId[]
  createdAt: Date
}

const ThreadSchema = new Schema<IThread>({
  text: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String
  },
  community: { type: Schema.Types.ObjectId, ref: 'Community' },
  parentId: {
    type: String
  },
  children: [{ type: Schema.Types.ObjectId, ref: 'Thread'}],
  createdAt: {
    type: Date,
    default: Date.now
  },
})

const Thread = models.Thread || model('Thread', ThreadSchema)

export default Thread