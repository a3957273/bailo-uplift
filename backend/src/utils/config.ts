import _config from 'config'

interface Config {
  api: {
    port: number
  }
  mongo: {
    uri: string
  }
  ui: {
    banner: {
      enabled: boolean
      text: string
      colour: string
    }
  }
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
