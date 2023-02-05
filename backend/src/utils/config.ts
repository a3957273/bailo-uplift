import _config from 'config'

interface API {
  port: number
}

interface Mongo {
  uri: string
}

interface Config {
  api: API
  mongo: Mongo
}

const config: Config = {
  api: {
    port: _config.get('server.port'),
  },

  mongo: {
    uri: _config.get('mongo.uri'),
  },
}

export default config
