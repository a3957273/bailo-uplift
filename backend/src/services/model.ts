import { Types } from 'mongoose'
import { Model, ModelId } from '../types/interfaces.js'
import ModelModel, { ModelDoc } from '../models/Model.js'
import { UserDoc } from '../models/User.js'
import Authorisation from '../external/Authorisation.js'
import { asyncFilter } from '../utils/general.js'
import { SerializerOptions } from '../utils/serializers.js'
import { Forbidden, NotFound } from '../utils/result.js'
import { VersionDoc } from '../models/Version.js'
import { getEntitiesForUser } from '../utils/entity.js'

const auth = new Authorisation()

interface GetModelOptions {
  populate?: boolean
}

export function serializedModelFields(): SerializerOptions {
  return {
    mandatory: ['_id', 'uuid', 'latestVersion.metadata.highLevelDetails.name', 'schemaRef'],
  }
}

export async function filterModelArray(user: UserDoc, unfiltered: Array<ModelDoc>) {
  return asyncFilter(unfiltered, (model: ModelDoc) => auth.canUserSeeModel(user, model))
}

export async function filterModel(user: UserDoc, unfiltered: ModelDoc | null) {
  if (!unfiltered) {
    return null
  }

  if (!(await auth.canUserSeeModel(user, unfiltered))) {
    return null
  }

  return unfiltered
}

export async function findModelByUuid(user: UserDoc, uuid: string, opts?: GetModelOptions) {
  let model = ModelModel.findOne({ uuid })
  if (opts?.populate) model = model.populate('latestVersion', 'metadata')
  return filterModel(user, await model)
}

export async function findModelById(user: UserDoc, id: string | Types.ObjectId | ModelDoc, opts?: GetModelOptions) {
  let model = ModelModel.findById(id)
  if (opts?.populate) model = model.populate('latestVersion', 'metadata')
  return filterModel(user, await model)
}

export interface ModelFilter {
  filter?: string
  type: 'favourites' | 'user' | 'all'
}

export function isValidType(type: unknown): type is 'favourites' | 'user' | 'all' {
  return typeof type === 'string' && ['favourites', 'user', 'all'].includes(type)
}

export function isValidFilter(filter: unknown): filter is string {
  return typeof filter === 'string'
}

export async function findModels(user: UserDoc, { filter, type }: ModelFilter, opts?: GetModelOptions) {
  const query: any = {}

  if (filter) query.$text = { $search: filter as string }

  if (type === 'favourites') {
    query._id = { $in: user.favourites }
  } else if (type === 'user') {
    const userEntities = await getEntitiesForUser(user)

    query.$or = userEntities.map((userEntity) => ({
      'latestVersion.metadata.contacts.uploader': { $elemMatch: { kind: userEntity.kind, id: userEntity.id } },
    }))
  }

  let models = ModelModel.find(query).sort({ updatedAt: -1 })
  if (opts?.populate) models = models.populate('latestVersion', 'metadata')
  return filterModelArray(user, await models)
}

export async function createModel(user: UserDoc, data: Model) {
  const model = new ModelModel(data)

  if (!(await auth.canUserSeeModel(user, model))) {
    throw Forbidden({ data }, 'Unable to create model, failed permissions check.')
  }

  await model.save()

  return model
}

export async function deleteModel(user: UserDoc, modelId: ModelId) {
  const model = await ModelModel.findById(modelId)

  if (!model) {
    throw NotFound({ modelId }, 'Unable to find model to remove.')
  }

  await model.delete(user._id)
}

export async function removeVersionFromModel(user: UserDoc, version: VersionDoc) {
  // Deletes model if no versions left
  const model = await ModelModel.findById(version.model)

  if (!model) {
    throw NotFound({ modelId: version.model }, 'Unable to find model to remove.')
  }

  await model.versions.remove(version._id)
  if (model.versions.length === 0) {
    await model.delete(user._id)
  }
}
