import bcrypt from 'bcryptjs'
import { Document, model, Schema, Types } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { ModelDoc } from './Model.js'

export interface User {
  id: string
  email: string

  roles: Types.Array<string>
  favourites: Types.Array<ModelDoc | Types.ObjectId>

  token?: string | undefined
  data?: any

  createdAt: Date
  updatedAt: Date

  compareToken: (candidateToken: string) => Promise<boolean>
}

export type UserDoc = User & Document<any, any, User>

const UserSchema = new Schema<User>(
  {
    id: { type: String, required: true, index: true, unique: true },
    email: { type: String },

    roles: { type: [String], default: ['user'] },
    favourites: [{ type: Schema.Types.ObjectId, ref: 'Model' }],

    // uuidv4() is cryptographically safe
    token: { type: String, required: true, default: uuidv4(), select: false },

    // mixed user information provided by authorisation
    data: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', function userPreSave(next) {
  if (!this.isModified('token') || !this.token) {
    next()
    return
  }

  bcrypt.hash(this.token, 10, (err, hash) => {
    if (err) {
      next(err)
      return
    }

    this.token = hash
    next()
  })
})

UserSchema.methods.compareToken = function compareToken(candidateToken: string) {
  return new Promise((resolve, reject) => {
    if (!this.token) {
      resolve(false)
      return
    }

    bcrypt.compare(candidateToken, this.token, (err, isMatch) => {
      if (err) {
        reject(err)
        return
      }
      resolve(isMatch)
    })
  })
}

const UserModel = model<User>('User', UserSchema)
export default UserModel
