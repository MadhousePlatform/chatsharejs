export default interface PterodactylServer
{
  object: String,
  attributes: {
    id: number,
    external_id: string|null,
    uuid: string,
    identifier: string,
    name: string,
    description: string,
    suspended: boolean,
    limits: {
      memory: number,
      swap: number,
      disk: number,
      io: number,
      cpu: number,
      threads: number|null,
    },
    feature_limits: {
      databases: number,
      allocations: number,
      backups: number,
    },
    user: number,
    node: number,
    allocation: number,
    nest: number,
    egg: number,
    pack: null,
    container: {
      startup_command: string,
      image: string,
      installed: boolean,
      environment: {
        SERVER_JARFILE: string,
        VANILLA_VERSION: string,
        STARTUP: string,
        P_SERVER_LOCATION: string,
        P_SERVER_UUID: string,
        P_SERVER_ALLOCATION_LIMIT: number,
      }
    },
    updated_at: number,
    created_at: number,
  }
}