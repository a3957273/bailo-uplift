import { QueueMessage } from 'p-mongo-queue'
import { findVersionById, markVersionBuilt } from '../services/version.js'
import logger from '../utils/logger.js'
import { getUserByInternalId } from '../services/user.js'

import { BuildHandler, BuildTasks } from '../utils/build/BuildHandler.js'
import createWorkingDirectory from '../utils/build/CreateWorkingDirectory.js'
import getRawFiles from '../utils/build/GetRawFiles.js'
import extractFiles from '../utils/build/ExtractFiles.js'
import getSeldonDockerfile from '../utils/build/GetSeldonDockerfile.js'
import imgBuildDockerfile from '../utils/build/ImgBuildDockerfile.js'
import openshiftBuildDockerfile from '../utils/build/OpenShiftBuildDockerfile.js'
import pushDockerTar from '../utils/build/PushDockerTar.js'
import { getUploadQueue } from '../utils/queues.js'
import { ModelUploadType } from '../types/interfaces.js'
import config from '../utils/config.js'

export default async function processUploads() {
  ;(await getUploadQueue()).process(async (msg: QueueMessage) => {
    logger.info({ job: msg.payload }, 'Started processing upload')

    const user = await getUserByInternalId(msg.payload.userId)
    if (!user) {
      throw new Error(`Unable to find upload user '${msg.payload.userId}'`)
    }

    const version = await findVersionById(user, msg.payload.versionId, { populate: true })
    if (!version) {
      throw new Error(`Unable to find version '${msg.payload.versionId}'`)
    }

    let tasks: BuildTasks = [{ construct: createWorkingDirectory() }]

    switch (msg.payload.uploadType) {
      case ModelUploadType.Zip:
        tasks = tasks.concat([
          {
            construct: getRawFiles(),
            props: {
              files: [
                { path: 'binary.zip', file: 'binary' },
                { path: 'code.zip', file: 'code' },
              ],
            },
          },
          { construct: extractFiles() },
          {
            construct: getSeldonDockerfile(),
            props: {
              seldonDockerfile: version.metadata?.buildOptions?.seldonVersion,
            },
          },
        ])

        if (config.build.environment === 'openshift') {
          tasks.push({ construct: openshiftBuildDockerfile() })
        } else {
          tasks.push({ construct: imgBuildDockerfile() })
        }
        break
      case ModelUploadType.Docker:
        tasks = tasks.concat([
          { construct: getRawFiles(), props: { files: [{ path: 'docker.tar', file: 'docker' }] } },
          { construct: pushDockerTar() },
        ])
        break
      default:
        throw new Error(`Unexpected build type: ${msg.payload.uploadType}`)
    }

    const buildHandler = new BuildHandler(tasks)
    await buildHandler.process(version, {
      binary: msg.payload.binary,
      code: msg.payload.code,
      docker: msg.payload.docker,
    })

    await markVersionBuilt(version._id)
  })
}
