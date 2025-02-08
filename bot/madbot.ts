import { Client, Events, GatewayIntentBits, Message } from 'discord.js';
import { log } from '@/bootstrap.ts';
import docker from "dockerode";
import Docker from "$/Docker.ts";
import { gather_servers } from "@/index.ts";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
client.once(Events.ClientReady, (readyClient: Client<true>) => {
  log.info(`Logged in as ${readyClient.user.tag}`)
});

client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return;

  const cmd = `tellraw @a [{"text":"[discord] ","color":"blue"},{"text":"<${message.author.username}> ","color":"light_purple"},{"text":"${message.content}","color":"white"}]\n`;

  const servers = await gather_servers();

  const dkr = new docker({
    socketPath: '/var/run/docker.sock'
  });
  (new Docker()).broadcastToAll(cmd, servers.my_servers, dkr, null)
})

// @ts-ignore
export {
  client,
}
