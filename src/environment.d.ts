declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      SERVER_API: string;
      SERVER_KEY: string;
      DISCORD_TOKEN: string;
      DISCORD_CHANNEL: string;
      DISCORD_LOG_CHANNEL: string;
      VERSION: string;
      DEV_CONTAINER_ID: string,
    }
  }
}

export {}
