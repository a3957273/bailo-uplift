import chalk from 'chalk'
import { sep } from 'path'
import { inspect } from 'util'
import { omit } from 'lodash-es'

export default class DevelopmentWriter {
  basepath: string

  constructor({ basepath }: { basepath: string }) {
    this.basepath = basepath + sep
  }

  static getLevel(level: number) {
    switch (level) {
      case 10:
        return chalk.gray('trace')
      case 20:
        return 'debug'
      case 30:
        return chalk.cyan('info ')
      case 40:
        return chalk.yellow('warn ')
      case 50:
        return chalk.red('error')
      case 60:
        return chalk.redBright('fatal')
      default:
        return String(level)
    }
  }

  getSrc(src: any) {
    const line = src.file.replace(this.basepath, '')
    return `${line}:${src.line}`
  }

  static representValue(value: unknown) {
    return typeof value === 'object' ? inspect(value) : String(value)
  }

  static getAttributes(data: any) {
    let attributes = omit(data, [
      'name',
      'hostname',
      'pid',
      'level',
      'msg',
      'time',
      'src',
      'v',
      'user',
      'timestamp',
      'clientIp',
    ])
    let keys = Object.keys(attributes)

    if (['id', 'url', 'method', 'response-time', 'status'].every((k) => keys.includes(k))) {
      // this is probably a req object.
      attributes = omit(attributes, ['id', 'url', 'method', 'response-time', 'status'])
      keys = Object.keys(attributes)
    }

    if (keys.includes('id')) {
      // don't show id if it's a uuid
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(attributes.id)) {
        attributes = omit(attributes, ['id'])
        keys = Object.keys(attributes)
      }
    }

    if (!keys.length) {
      return ''
    }

    return keys.map((key) => `${key}=${DevelopmentWriter.representValue(attributes[key])}`).join(' ')
  }

  write(data: any) {
    const level = DevelopmentWriter.getLevel(data.level)
    const src = this.getSrc(data.src)
    const attributes = DevelopmentWriter.getAttributes(data)
    const formattedAttributes = attributes.length ? ` (${attributes})` : ''

    const message = `${level} - (${src}): ${data.msg}${formattedAttributes}`

    const pipe = data.level >= 40 ? 'stderr' : 'stdout'
    process[pipe].write(`${message}\n`)
  }
}
