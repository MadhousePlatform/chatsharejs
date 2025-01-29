import { request } from "@/bootstrap.ts";
import { AxiosResponse } from "axios";

export default class Server
{
  async get_all(): Promise<AxiosResponse> {
    return await request.get('application/servers');
  }
}