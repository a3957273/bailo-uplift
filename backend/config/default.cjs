module.exports = {
  api: {
    // Port to listen on
    port: 3001,
  },

  mongo: {
    uri: 'mongodb://127.0.0.1:27017/bailo',
  },

  ui: {
    banner: {
      enabled: false,
      text: 'Welcome to Bailo (env: Default)',
      colour: 'orange',
    },
  },
}
