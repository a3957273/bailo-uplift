import bunyan from 'bunyan'
import { join } from 'path'
import { fileURLToPath } from 'url'
import DevelopmentWriter from './DevelopmentWriter.js'

const streams: Array<bunyan.Stream> = []

if (process.env.NODE_ENV !== 'production') {
  const currentDirectory = fileURLToPath(new URL('.', import.meta.url))

  streams.push({
    level: 'trace',
    type: 'raw',
    stream: new DevelopmentWriter({
      basepath: join(currentDirectory, '..'),
    }),
  })
} else {
  streams.push({
    level: 'trace',
    stream: process.stdout,
  })
}

const logger = bunyan.createLogger({
  name: 'bailo',
  level: 'trace',
  src: process.env.NODE_ENV !== 'production',
  streams: streams.length ? streams : undefined,
})

export default logger
