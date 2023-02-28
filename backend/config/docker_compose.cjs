/** @type {import('../src/utils/config.js').Config} */
module.exports = {
  build: {
    environment: 'img',
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
  },

  registry: {
    connection: {
      host: 'registry:8080',
      port: 8080,
      protocol: 'https',
    },
  },

  smtp: {
    enabled: false,

    connection: {
      host: 'maildev',
      port: 1025,
      secure: false,
      auth: {
        user: 'mailuser',
        pass: 'mailpass',
      },
      tls: {
        rejectUnauthorized: false,
      },
    },

    from: '"Bailo 📝" <bailo@example.org>',
  },
}
