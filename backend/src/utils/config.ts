import _config from "config";

interface Server {
  port: number;
}

interface Config {
  server: Server;
}

const config: Config = {
  server: {
    port: _config.get("server.port"),
  },
};

export default config;
