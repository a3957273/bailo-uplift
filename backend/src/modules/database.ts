import mongoose from 'mongoose'
import config from '../utils/config.js'

export async function connectToMongo() {
  await mongoose.connect(config.mongo.uri)
}

export async function disconnectFromMongo() {
  await mongoose.disconnect()
}
