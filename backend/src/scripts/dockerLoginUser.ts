/* eslint-disable import/newline-after-import */
import { connectToMongoose, disconnectFromMongoose } from '../utils/database.js'
;(async () => {
  await connectToMongoose()

  // login as user

  setTimeout(disconnectFromMongoose, 50)
})()
