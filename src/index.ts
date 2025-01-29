import { log } from "./bootstrap.ts";
import Server from "$/Server.ts";
import { AxiosResponse } from "axios";

async function startChatShare(): Promise<void> {
  const servers: AxiosResponse = await (new Server).get_all();
  console.log(servers.data);
}

startChatShare().then((): void => {
  log.debug('Starting ChatShare');
})
