import { config, log } from "./bootstrap.ts";
import Server from "$/Server.ts";
import { AxiosResponse } from "axios";
import Parser from "$/Parser.ts";
import PterodactylServer from "&/PterodactylServer.ts";
import InternalServer from "&/InternalServer.ts";
import Docker from "$/Docker.ts";
import { client } from "../bot/madbot.ts";
import { TextChannel, Message, Events } from "discord.js";
import docker from "dockerode";

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

  const my_servers: InternalServer[] = process.env.NODE_ENV === 'production'
    ? ids
    : [{exid: 'vanilla', cid: 'cb818b6c10b620a81ed7ede855136cfde6aab352be74436ab0d0395488008bb3'}];

  let cntnr = new docker({
    socketPath: '/var/run/docker.sock'
  });

  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;
    if (message.channelId !== config.DISCORD_CHANNEL) return;

    const cmd: string = `tellraw @a [{"text":"[discord] ","color":"blue"},{"text":"<${message.author.username}> ","color":"light_purple"},{"text":"${message.content}","color":"white"}]\n`;

    (new Docker).broadcastToAll(cmd, my_servers, cntnr, null)
  })

  my_servers.forEach((server: InternalServer) => {
    log.debug(`Iterating servers (Server: ${server.exid})`)
    const parser = new Parser(server);
    if (parser !== undefined) {
      parser.new();
      (new Docker).handle_server(server, parser, my_servers);
    }
  });
}

startChatShare().then((): void => {
  log.debug('Starting ChatShare');
});
