import _config from 'config'

interface API {
  port: number
}

interface Mongo {
  uri: string
}

interface Banner {
  enabled: boolean
  text: string
  colour: string
}

interface UI {
  banner: Banner
}

interface Config {
  api: API
  mongo: Mongo
  ui: UI
}

const config: Config = {
  api: {
    port: _config.get('api.port'),
  },

  mongo: {
    uri: _config.get('mongo.uri'),
  },

  ui: {
    banner: {
      enabled: _config.get('ui.banner.enabled'),
      text: _config.get('ui.banner.text'),
      colour: _config.get('ui.banner.colour'),
    },
  },
}

export default config
