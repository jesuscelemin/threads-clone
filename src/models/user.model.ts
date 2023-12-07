import { Schema, models, model, Document } from 'mongoose'

export interface IUser extends Document {
  id: string
  email: string
  hashedPassword: string
  name: string
  username: string
  image: string
  bio: string
  threads: Schema.Types.ObjectId[]
  onboarded: boolean
  following: Schema.Types.ObjectId[]
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  id: String,
  email: { type: String, required: true, unique: true },
  hashedPassword: String,
  name: { type: String, required: true },
  username: String,
  image: String,
  bio: String,
  threads: [{ type: Schema.Types.ObjectId, ref: 'Thread' }],
  onboarded: { type: Boolean, default: false },
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const User = models.User || model<IUser>('User', UserSchema)

export default User
