module.exports = {
  api: {
    // Port to listen on
    port: 3001,
  },

  mongo: {
    uri: 'mongodb://mongo:27017/bailo',
  },

  minio: {
    connection: {
      endPoint: 'minio',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
      region: '',
    },

    automaticallyCreateBuckets: true,

    buckets: {
      uploads: 'uploads',
      registry: 'registry',
    },
  },

  ui: {
    banner: {
      enabled: false,
      text: 'Welcome to Bailo (env: Default)',
      colour: 'orange',
    },
  },
}
