import { flog, log } from "./bootstrap.ts";
import config from "@/config.ts";
import Server from "$/Server.ts";
import Parser from "$/Parser.ts";
import Docker from "$/Docker.ts";
import PterodactylServer from "&/PterodactylServer.ts";
import InternalServer from "&/InternalServer.ts";
import { client } from "%/madbot.ts";
import docker from "dockerode";
import { AxiosResponse } from "axios";
import { Channel, TextChannel, Message, Events } from "discord.js";

/**
 * Authenticate the bot to Discord and display connection message.
 */
async function startDiscordBot(): Promise<void> {
  await client.login(config.discord.token)
  const channel: Channel | null = await client.channels.fetch(config.discord.log_channel);
  flog.info('Bot started and connected to Discord.')

  if (!channel) throw new Error('Invalid Discord log channel.')
  if (!(channel instanceof TextChannel)) throw new Error('Invalid type of channel specified. Please use a Text Channel.')

  await channel.send(`Connected and listening for events.`);
}

/**
 * Start the main chatshare instance.
 */
async function startChatShare(): Promise<void> {
  await startDiscordBot();

  const servers: AxiosResponse = await (new Server).get_all();

  const ids = servers.data.data
    .filter((s: PterodactylServer) => !s.attributes.suspended && s.attributes.external_id !== null)
    .map((s: PterodactylServer) => ({
      exid: s.attributes.external_id,
      cid: s.attributes.uuid
    }));

  /* The false side of the ternary is the ID of the container I use in development. */
  const filtered_servers: InternalServer[] =
    config.env === 'production' && ids.length ? ids : [{ exid: 'vanilla', cid: config.dev.container_id }];

  let cntnr = new docker({ socketPath: '/var/run/docker.sock' });

  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;
    if (message.channelId !== config.discord.channel) return;

    const part = {
      prefix: `{ "text": "[discord] ", "color": "blue" }`,
      author: `{ "text": "<${message.author.username}> ", "color": "light_purple" }`,
      message: `{ "text": "${message.content}", "color": "white" }`
    }

    const cmd: string = `tellraw @a [${part.prefix},${part.author},${part.message}]\n`;

    (new Docker).broadcastToAll(cmd, filtered_servers, cntnr, null)
  })

  filtered_servers.forEach((server: InternalServer) => {
    const parser = new Parser(server);
    parser.new();
    (new Docker).handle_server(cntnr, server, parser, filtered_servers);
  });
}

try {
  startChatShare().then((): void => {
    log.debug(`Starting ChatShare v${config.version}`);
  });
} catch (err) {
  if (err instanceof Error) {
    log.error(err.message);
    flog.error(err.message);
  } else {
    log.error(err);
    flog.error(`Unknown exception: ${err}`);
  }
}
