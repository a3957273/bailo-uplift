import { Document, IndexOptions, model, Schema, Types } from 'mongoose'
import MongooseDelete from 'mongoose-delete'
import { LogStatement } from './Deployment.js'
import { approvalStateOptions, ApprovalStates, DateString, MinimalEntry, ModelMetadata } from '../types/interfaces.js'
import { ModelDoc } from './Model.js'
import logger from '../utils/logger.js'

export interface Version {
  model: ModelDoc | Types.ObjectId
  version: string

  metadata: ModelMetadata

  built: boolean
  managerApproved: ApprovalStates
  reviewerApproved: ApprovalStates

  managerLastViewed: DateString
  reviewerLastViewed: DateString

  files: {
    rawBinaryPath?: string
    binary?: {
      fileList?: Array<MinimalEntry>
    }

    rawCodePath?: string
    code?: {
      fileList?: Array<MinimalEntry>
    }

    rawDockerPath?: string
  }

  state: any
  logs: Types.Array<LogStatement>

  createdAt: Date
  updatedAt: Date

  log: (level: string, msg: string) => Promise<void>
}

export type VersionDoc = Version & Document<any, any, Version>

const VersionSchema = new Schema<Version>(
  {
    model: { type: Schema.Types.ObjectId, ref: 'Model' },
    version: { type: String, required: true },

    metadata: { type: Schema.Types.Mixed },

    files: { type: Schema.Types.Mixed, required: true, default: {} },

    built: { type: Boolean, default: false },
    managerApproved: { type: String, required: true, enum: approvalStateOptions, default: ApprovalStates.NoResponse },
    reviewerApproved: { type: String, required: true, enum: approvalStateOptions, default: ApprovalStates.NoResponse },
    managerLastViewed: { type: Schema.Types.Mixed },
    reviewerLastViewed: { type: Schema.Types.Mixed },

    state: { type: Schema.Types.Mixed, default: {} },
    logs: [{ timestamp: Date, level: String, msg: String }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

VersionSchema.plugin(MongooseDelete, { overrideMethods: 'all', deletedBy: true, deletedByType: Schema.Types.ObjectId })

VersionSchema.index({ model: 1, version: 1 }, { unique: true } as unknown as IndexOptions)

type Level = 'info' | 'error'
VersionSchema.methods.log = async function log(level: Level, msg: string) {
  logger[level]({ versionId: this._id }, msg)
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await VersionModel.findOneAndUpdate({ _id: this._id }, { $push: { logs: { timestamp: new Date(), level, msg } } })
}

const VersionModel = model<Version>('Version', VersionSchema)

export default VersionModel
