import express from 'express'
import { getEcho } from './routes/v1/echo.js'
import config from './utils/config.js'
import './utils/signals.js'

const server = express()

server.get('/api/v1/echo', ...getEcho)

server.listen(config.server.port, () => {
  console.log('Listening on port', config.server.port)
})
