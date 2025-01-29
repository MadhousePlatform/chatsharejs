import { log } from "./bootstrap.ts";
import Server from "$/Server.ts";

async function startChatShare(): Promise<void> {
  const servers = await (new Server).get_all();
  console.log(servers.data);
}

startChatShare().then(() => {
  log.debug('Starting ChatShare');
})
