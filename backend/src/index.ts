import express from 'express'
import { getUIConfig } from './routes/v1/config.js'
import { getEcho } from './routes/v1/echo.js'
import config from './utils/config.js'
import './utils/signals.js'
import { registerSigTerminate } from './utils/signals.js'

const server = express()

server.get('/api/v1/echo', ...getEcho)
server.get('/api/v1/config/ui', ...getUIConfig)

async function main() {
  const httpServer = server.listen(config.api.port, () => {
    console.log('Listening on port', config.api.port)
  })

  registerSigTerminate(httpServer)
}

main()
