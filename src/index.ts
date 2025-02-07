import { config, log } from "./bootstrap.ts";
import Server from "$/Server.ts";
import { AxiosResponse } from "axios";
import Parser from "$/Parser.ts";
import PterodactylServer from "&/PterodactylServer.ts";
import InternalServer from "&/InternalServer.ts";
import Docker from "$/Docker.ts";
import { client } from "../bot/madbot.ts";
import { TextChannel, Message } from "discord.js";

async function startDiscordBot(): Promise<void> {
  await client.login(config.DISCORD_TOKEN)
  // @ts-ignore
  const channel: TextChannel = await client.channels.fetch(config.DISCORD_CHANNEL);
  channel.send(`I'm online!`).then((message: Message) => {
    setTimeout(() => {
      message.delete();
    }, 5000);
  });
}

async function startChatShare(): Promise<void> {
  await startDiscordBot();

  const servers: AxiosResponse = await (new Server).get_all();
  const ids: Array<InternalServer> = [];
  servers.data.data.filter(
    (s: PterodactylServer) => !s.attributes.suspended && s.attributes.external_id !== null
      ? ids.push({ exid: s.attributes.external_id, cid: s.attributes.uuid })
      : ''
  );

  ids.forEach((server: InternalServer) => {
    log.debug(`Iterating servers (Server: ${server.exid})`)
    const parser = new Parser(server);
    if (parser !== undefined) {
      parser.new();
      (new Docker).handle_server(server, parser, servers.data);
    }
  });
}

startChatShare().then((): void => {
  log.debug('Starting ChatShare');
});
