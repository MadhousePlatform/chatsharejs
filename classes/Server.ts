import { request } from "@/bootstrap.ts";

export default class Server
{
  async get_all() {
    return await request.get('application/servers');
  }
}