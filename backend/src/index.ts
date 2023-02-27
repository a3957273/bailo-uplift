import express from 'express'
import config from './utils/config.js'
import './utils/signals.js'
import { registerSigTerminate } from './utils/signals.js'
import { connectToMongo, createIndexes } from './services/mongo.js'
import { expressErrorHandler, expressLogger } from './utils/logging/express.js'
import Minio from './modules/minio.js'

const server = express()
server.use(expressLogger)

server.post('/api/v1/model', ...postUpload)

// server.get('/api/v1/models', ...getModels)
// server.get('/api/v1/model/uuid/:uuid', ...getModelByUuid)
// server.get('/api/v1/model/id/:id', ...getModelById)
// server.get('/api/v1/model/:uuid/schema', ...getModelSchema)
// server.get('/api/v1/model/:uuid/versions', ...getModelVersions)
// server.get('/api/v1/model/:uuid/version/:version', ...getModelVersion)
// server.get('/api/v1/model/:uuid/deployments', ...getModelDeployments)
// server.get('/api/v1/model/:uuid/access', ...getModelAccess)

// server.post('/api/v1/deployment', ...postDeployment)
// server.post('/api/v1/deployment/ungoverned', ...postUngovernedDeployment)
// server.get('/api/v1/deployment/:uuid', ...getDeployment)
// server.get('/api/v1/deployment/user/:id', ...getUserDeployments)
// server.post('/api/v1/deployment/:uuid/reset-approvals', ...resetDeploymentApprovals)
// server.get('/api/v1/deployment/:uuid/version/:version/raw/:fileType', ...fetchRawModelFiles)
// server.get('/api/v1/deployment/:uuid/access', ...getDeploymentAccess)

// server.get('/api/v1/version/:id', ...getVersion)
// server.get('/api/v1/version/:id/contents/:file/list', ...getVersionFileList)
// server.get('/api/v1/version/:id/contents/:file', ...getVersionFile)
// server.put('/api/v1/version/:id', ...putVersion)
// server.get('/api/v1/version/:id/access', ...getVersionAccess)
// server.delete('/api/v1/version/:id', ...deleteVersion)
// server.post('/api/v1/version/:id/reset-approvals', ...postResetVersionApprovals)
// server.post('/api/v1/version/:id/rebuild', ...postRebuildModel)
// server.put('/api/v1/version/:id/lastViewed/:role', ...putUpdateLastViewed)

// server.get('/api/v1/schemas', ...getSchemas)
// server.get('/api/v1/schema/default', ...getDefaultSchema)
// server.get('/api/v1/schema/:ref', ...getSchema)
// server.post('/api/v1/schema', ...postSchema)

// server.get('/api/v1/config', ...getUiConfig)

// server.get('/api/v1/users', ...getUsers)
// server.get('/api/v1/user', ...getLoggedInUser)
// server.post('/api/v1/user/token', ...postRegenerateToken)
// server.post('/api/v1/user/favourite/:id', ...favouriteModel)
// server.post('/api/v1/user/unfavourite/:id', ...unfavouriteModel)

// server.get('/api/v1/approvals', ...getApprovals)
// server.get('/api/v1/approvals/count', ...getNumApprovals)
// server.post('/api/v1/approval/:id/respond', ...postApprovalResponse)

// server.get('/api/v1/registry_auth', ...getDockerRegistryAuth)

// server.get('/api/v1/specification', ...getSpecification)

// server.get('/api/v1/docs/menu-content', ...getDocsMenuContent)

// server.get('/api/v1/admin/logs', ...getApplicationLogs)
// server.get('/api/v1/admin/logs/build/:buildId', ...getItemLogs)
// server.get('/api/v1/admin/logs/approval/:approvalId', ...getItemLogs)

server.use('/api', expressErrorHandler)

async function main() {
  const minio = new Minio()

  // technically, we do need to wait for this, but it's so quick
  // that nobody should notice unless they want to upload an image
  // within the first few milliseconds of the _first_ time it's run
  if (config.minio.automaticallyCreateBuckets) {
    minio.ensureBucketExists(config.minio.buckets.uploads)
    minio.ensureBucketExists(config.minio.buckets.registry)
  }

  // connect to Mongo
  await connectToMongo()

  // lazily create indexes for full text search
  createIndexes()

  // await Promise.all([processUploads(), processDeployments()])

  const httpServer = server.listen(config.api.port, () => {
    console.log('Listening on port', config.api.port)
  })

  registerSigTerminate(httpServer)
}

main()
