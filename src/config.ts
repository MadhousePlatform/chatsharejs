import "dotenv/config";
import IConfig from "&/IConfig.ts";

const cfg = process.env;

const config: IConfig = {
  server: {
    api: cfg.SERVER_API,
    key: cfg.SERVER_KEY,
  },
  discord: {
    token: cfg.DISCORD_TOKEN,
    channel: cfg.DISCORD_CHANNEL,
    log_channel: cfg.DISCORD_LOG_CHANNEL
  },
  dev: {
    container_id: cfg.DEV_CONTAINER_ID,
  },
  version: cfg.VERSION,
  env: cfg.NODE_ENV
};

export default config;
