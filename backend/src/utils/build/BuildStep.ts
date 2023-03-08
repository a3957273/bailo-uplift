import { VersionDoc } from '../../models/Version.js'
import { FileRef } from './build.js'
import { BuildLogger } from './BuildLogger.js'

export type Files = {
  [name: string]: FileRef
}

export interface BuildOpts {
  retryable: boolean
}

export abstract class BuildStep {
  logger: BuildLogger

  opts: BuildOpts = {
    retryable: false,
  }

  props: any

  constructor(logger: BuildLogger, opts: Partial<BuildOpts>, props?: any) {
    this.opts = { ...this.opts, ...opts }
    this.logger = logger
    this.props = props
  }

  abstract name(version: VersionDoc, files: Files, state: any): Promise<string>

  abstract build(version: VersionDoc, files: Files, state: any): Promise<any>

  abstract rollback(version: VersionDoc, files: Files, state: any): Promise<any>

  async tidyUp(_version: VersionDoc, _files: Files, _state: any): Promise<any> {
    // tidying up is optional
  }
}
