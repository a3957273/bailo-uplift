import https from 'https'
import { deleteImageTag } from '../utils/registry.js'
import { ModelId, ApprovalStates } from '../types/interfaces.js'
import DeploymentModel, { DeploymentDoc } from '../models/Deployment.js'
import { ModelDoc } from '../models/Model.js'
import { UserDoc } from '../models/User.js'
import VersionModel, { VersionDoc } from '../models/Version.js'
import Authorisation from '../external/Authorisation.js'
import { asyncFilter } from '../utils/general.js'
import { SerializerOptions } from '../utils/serializers.js'
import { Forbidden } from '../utils/result.js'
import { getUserByInternalId } from './user.js'
import { getEntitiesForUser } from '../utils/entity.js'
import config from '../utils/config.js'

const auth = new Authorisation()

interface GetDeploymentOptions {
  populate?: boolean
  showLogs?: boolean
  overrideFilter?: boolean
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: !config.registry.insecure,
})

export function serializedDeploymentFields(): SerializerOptions {
  return {
    mandatory: ['_id', 'uuid', 'name'],
    optional: [],
    serializable: [],
  }
}

export async function filterDeploymentArray(user: UserDoc, unfiltered: Array<DeploymentDoc>) {
  return asyncFilter(unfiltered, (deployment: DeploymentDoc) => auth.canUserSeeDeployment(user, deployment))
}

export async function filterDeployment(user: UserDoc, unfiltered: DeploymentDoc | null) {
  if (!unfiltered) {
    return null
  }

  if (!(await auth.canUserSeeDeployment(user, unfiltered))) {
    return null
  }

  return unfiltered
}

export async function findDeploymentByUuid(user: UserDoc, uuid: string, opts?: GetDeploymentOptions) {
  let deployment = DeploymentModel.findOne({ uuid })
  if (!opts?.showLogs) deployment = deployment.select({ logs: 0 })
  deployment = deployment
    .populate('model', ['_id', 'uuid', 'latestVersion'])
    .populate('versions', ['version', 'metadata'])

  if (opts?.overrideFilter) return deployment
  return filterDeployment(user, await deployment)
}

export async function findDeploymentById(user: UserDoc, id: ModelId | DeploymentDoc, opts?: GetDeploymentOptions) {
  let deployment = DeploymentModel.findById(id)
  if (opts?.populate) deployment = deployment.populate('model')
  if (!opts?.showLogs) deployment = deployment.select({ logs: 0 })

  if (opts?.overrideFilter) return deployment
  return filterDeployment(user, await deployment)
}
export async function findDeploymentsByModel(user: UserDoc, model: ModelDoc, opts?: GetDeploymentOptions) {
  let deployments = DeploymentModel.find({ model })
  if (opts?.populate) deployments = deployments.populate('model')
  if (!opts?.showLogs) deployments = deployments.select({ logs: 0 })

  if (opts?.overrideFilter) return deployments
  return filterDeploymentArray(user, await deployments)
}

export async function findDeploymentsByVersion(user: UserDoc, version: VersionDoc, opts?: GetDeploymentOptions) {
  let deployments = DeploymentModel.find({ versions: { $in: [version._id] } })
  if (opts?.populate) deployments = deployments.populate('model')
  if (!opts?.showLogs) deployments = deployments.select({ logs: 0 })

  if (opts?.overrideFilter) return deployments
  return filterDeploymentArray(user, await deployments)
}

export interface DeploymentFilter {
  owner?: ModelId
  model?: ModelId
}

export async function findDeployments(user: UserDoc, { owner, model }: DeploymentFilter, opts?: GetDeploymentOptions) {
  const query: any = {}

  if (owner) {
    const ownerUser = await getUserByInternalId(owner)

    if (!ownerUser) {
      throw new Error(`Finding deployments for user that does not exist: ${owner}`)
    }

    const userEntities = await getEntitiesForUser(user)

    query.$or = userEntities.map((userEntity) => ({
      'metadata.contacts.owner': { $elemMatch: { kind: userEntity.kind, id: userEntity.id } },
    }))
  }
  if (model) query.model = model

  let deployments = DeploymentModel.find(query).sort({ updatedAt: -1 })

  if (!opts?.showLogs) deployments = deployments.select({ logs: 0 })

  return filterDeploymentArray(user, await deployments)
}

export async function markDeploymentBuilt(_id: ModelId) {
  return DeploymentModel.findByIdAndUpdate(_id, { built: true })
}

interface CreateDeployment {
  schemaRef: string | null
  uuid: string

  model: ModelId
  metadata: any

  managerApproved?: ApprovalStates
  ungoverned?: boolean
}

export async function createDeployment(user: UserDoc, data: CreateDeployment) {
  const deployment = new DeploymentModel(data)

  if (!(await auth.canUserSeeDeployment(user, deployment))) {
    throw Forbidden({ data }, 'Unable to create deployment, failed permissions check.')
  }

  await deployment.save()

  return deployment
}

export async function removeModelDeploymentsFromRegistry(model: ModelDoc, deployment: DeploymentDoc) {
  const registry = `${config.registry.connection.protocol}://${config.registry.connection.host}/v2`

  const { versions } = model

  versions.forEach(async (version) => {
    const versionDoc = await VersionModel.findById(version)
    if (!versionDoc) {
      return
    }
    deleteImageTag(
      { address: registry, agent: httpsAgent },
      { namespace: deployment.uuid, model: model.uuid, version: versionDoc.version }
    )
  })
}
