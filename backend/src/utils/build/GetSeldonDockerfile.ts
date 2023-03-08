/* eslint-disable no-param-reassign */
import shelljs from 'shelljs'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { tmpdir } from 'os'
import { writeFile } from 'fs/promises'
import dedent from 'dedent-js'

import { VersionDoc } from '../../models/Version.js'
import { BuildOpts, BuildStep, Files } from './BuildStep.js'
import { BuildLogger } from './BuildLogger.js'
import { logCommand } from './build.js'
import config from '../config.js'

const { rm, mkdir } = shelljs

interface GetSeldonDockerfileProps {
  seldonDockerfile: string
}

class GetSeldonDockerfile extends BuildStep {
  constructor(logger: BuildLogger, opts: Partial<BuildOpts>, props: GetSeldonDockerfileProps) {
    super(logger, opts, props)

    this.opts.retryable = true
  }

  async name() {
    return 'Get Seldon Dockerfile'
  }

  async build(_version: VersionDoc, _files: Files, state: any): Promise<void> {
    if (!state.workingDirectory) {
      throw new Error('Get dockerfile requires a working directory')
    }

    // extract bundles
    this.logger.info({}, 'Adding in model environment data')
    const modelEnvs = dedent(`
      MODEL_NAME=Model
      API_TYPE=REST
      SERVICE_TYPE=MODEL
      PERSISTENCE=0
      PIP_NO_CACHE_DIR=off
      INCLUDE_METRICS_IN_CLIENT_RESPONSE=false
    `)

    const s2iDir = join(state.workingDirectory, '.s2i')

    this.logger.info({}, 'Creating .s2i folder')
    mkdir('-p', s2iDir)

    this.logger.info({}, 'Writing model environment file')
    await writeFile(join(s2iDir, 'environment'), modelEnvs)

    this.logger.info({}, 'Generate build folder')
    const buildDir = join(tmpdir(), uuidv4())
    await mkdir(buildDir)
    state.buildDir = buildDir

    const builder = this.props.seldonDockerfile
    const builderScriptsUrl = '/s2i/bin'

    const dockerfilePath = join(buildDir, 'Dockerfile')
    const toDockerfileTags = `--copy --as-dockerfile ${dockerfilePath} --scripts-url image://${builderScriptsUrl} --assemble-user root`
    const command = `${config.s2i.path} build ${state.workingDirectory} ${builder} ${toDockerfileTags}`

    this.logger.info({ builder, command }, 'Creating Dockerfile')
    await logCommand(command, this.logger)

    state.dockerfilePath = dockerfilePath
  }

  async rollback(_version: VersionDoc, _files: Files, state: any): Promise<void> {
    if (state.workingDirectory) {
      rm('-rf', join(state.workingDirectory, '.s2i'))
    }

    if (state.buildDir) {
      rm('-rf', state.buildDir)
    }
  }

  async tidyUp(version: VersionDoc, files: Files, state: any): Promise<void> {
    return this.rollback(version, files, state)
  }
}

export default function getSeldonDockerfile(opts: Partial<BuildOpts> = {}) {
  return (logger: BuildLogger, props: GetSeldonDockerfileProps) => new GetSeldonDockerfile(logger, opts, props)
}
