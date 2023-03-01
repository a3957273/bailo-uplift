import getAppRoot from 'app-root-path'
import { join } from 'path'
import { readdir } from 'fs/promises'
import mongoose, { Types } from 'mongoose'
import logger from './logger.js'
import { doesMigrationExist, markMigrationComplete } from '../services/migration.js'
import config from './config.js'

export async function connectToMongoose() {
  // is it already connected
  if (Number(mongoose.connection.readyState) === 1) {
    return
  }

  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(config.mongo.uri)
    logger.info('Connected to Mongoose')
  } catch (error) {
    logger.error({ error }, 'Error')
    throw error
  }
}

export async function disconnectFromMongoose() {
  await mongoose.disconnect()
  logger.info({ log: false }, 'Disconnected from Mongoose')
}

export async function runMigrations() {
  const path = process.env.NODE_ENV === 'production' ? './dist/backend/src/migrations/' : './backend/src/migrations/'
  const base = join(getAppRoot.toString(), path)
  const files = await readdir(base)
  files.sort()

  for (const file of files) {
    if (!file.endsWith('.js') && !file.endsWith('.ts')) {
      continue
    }

    if (!(await doesMigrationExist(file))) {
      logger.info({ file }, `Running migration ${file}`)

      // run migration
      const migration = await import(join(base, file))
      await migration.up()

      await markMigrationComplete(file)

      logger.info({ file }, `Finished migration ${file}`)
    }
  }

  logger.info('Finished running all migrations')
}

export function isObjectId(value: unknown): value is Types.ObjectId {
  return value instanceof Types.ObjectId
}
