import bcrypt from 'bcryptjs'
import { HydratedDocument, model, Schema, Types } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IUser {
  id: string
  email: string

  roles: Types.Array<string>

  token?: string | undefined
  data?: unknown

  createdAt: Date
  updatedAt: Date

  compareToken: (candidateToken: string) => Promise<boolean>
}

export type User = HydratedDocument<IUser>

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, index: true, unique: true },
    email: { type: String },

    roles: { type: [String], default: ['user'] },

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
