export default interface IConfig {
  server: {
    api: string,
    key: string,
  }
  discord: {
    token: string,
    channel: string,
    log_channel: string,
  }
  dev: {
    container_id: string,
  }
  version: string,
  env: string
}
