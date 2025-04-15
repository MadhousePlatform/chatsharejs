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

export let serverCount = 0;
export let my_servers: InternalServer[];

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
      ? ids.push({ exid: s.attributes.external_id, cid: s.attributes.uuid, identifier: s.attributes.identifier, port: 0, })
      : ''
  );

  my_servers = process.env.NODE_ENV === 'production'
    ? ids
    : [{exid: 'vanilla', cid: config.DEV_MC_CONTAINER ?? '', identifier: '', port: 0 }];

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
    serverCount++;
    log.debug(`Iterating servers (Server: ${server.exid})`)

    server.port = (new Server).get_server_port(server.identifier);
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
