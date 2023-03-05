/** @type {import('../src/utils/config.js').Config} */
module.exports = {
  api: {
    // Port to listen on
    port: 3001,

    // Publicly accessible host
    host: '',
  },

  app: {
    protocol: '',
    host: '',
    port: 3000,
  },

  s2i: {
    path: '/s2i/s2i',
  },

  build: {
    environment: 'img',

    openshift: {
      namespace: '',
      dockerPushSecret: '',
    },
  },

  mongo: {
    uri: 'mongodb://localhost:27017/bailo',
  },

  minio: {
    connection: {
      endPoint: 'minio',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
      region: 'minio',
    },

    automaticallyCreateBuckets: true,

    buckets: {
      uploads: 'uploads',
      registry: 'registry',
    },
  },

  registry: {
    connection: {
      host: 'localhost:5000',
      port: 5000,
      protocol: 'https',
    },

    service: 'RegistryAuth',
    issuer: 'RegistryIssuer',

    insecure: true,
  },

  smtp: {
    enabled: true,

    connection: {
      host: 'localhost',
      port: 1025,
      secure: false,
      auth: {
        user: '',
        pass: '',
      },
      tls: {
        rejectUnauthorized: false,
      },
    },

    from: '"Bailo 📝" <bailo@example.org>',
  },

  logging: {
    file: {
      enabled: false,
      level: 'info',
      path: './logs/out.log',
    },

    stroom: {
      enabled: false,
      folder: './logs/stroom',
      url: 'http://localhost:8090/stroom/datafeed',
      environment: 'insecure',
      feed: 'bailo',
      system: 'bailo',
      interval: 1000 * 60 * 5,
    },
  },

  ui: {
    banner: {
      enabled: true,
      text: 'DEPLOYMENT: INSECURE',
      colour: 'orange',
    },
    issues: {
      label: 'Bailo Support Team',
      supportHref: 'mailto:hello@example.com?subject=Bailo%20Support',
      contactHref: 'mailto:hello@example.com?subject=Bailo%20Contact',
    },
    registry: {
      host: 'localhost:8080',
    },
    uploadWarning: {
      showWarning: true,
      checkboxText: 'By checking here you confirm that the information is correct',
    },
    deploymentWarning: {
      showWarning: true,
      checkboxText: 'By checking here you confirm that the information is correct',
    },
    development: {
      logUrl: 'vscode://file/home/ec2-user/git/Bailo/',
    },
    seldonVersions: [
      {
        name: 'seldonio - 1.10.0',
        image: 'seldonio/seldon-core-s2i-python37:1.10.0',
      },
    ],
  },
}
