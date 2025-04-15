import { config, request } from "@/bootstrap.ts";
import { AxiosResponse } from "axios";

export default class Server
{
  async get_all(): Promise<AxiosResponse> {
    return await request.get('api/application/servers');
  }

  get_server_port(identifier: string): number {
    let port: number = 0;
    request.get(`api/client/servers/${identifier}/network/allocations`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'chatshare/0.1.0',
        'Authorization': `Bearer ${config.CLIENT_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.pterodactyl.v1+json',
      },
    })
      .then(response => port = response.data.attributes.port);
    return port;
  }
}
