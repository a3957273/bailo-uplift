import _config from 'config'

interface Config {
  api: {
    port: number
  }
  mongo: {
    uri: string
  }
  minio: {
    connection: any

    automaticallyCreateBuckets: boolean

    buckets: {
      uploads: string
      registry: string
    }
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

  minio: {
    connection: _config.get('minio.connection'),

    automaticallyCreateBuckets: _config.get('minio.automaticallyCreateBuckets'),

    buckets: {
      uploads: _config.get('minio.buckets.uploads'),
      registry: _config.get('minio.buckets.registry'),
    },
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
