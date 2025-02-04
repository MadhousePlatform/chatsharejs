import { Client, Events, GatewayIntentBits } from 'discord.js';
import { log } from '@/bootstrap.ts';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, (readyClient: Client<true>) => {
  log.info(`Logged in as ${readyClient.user.tag}`)
});

// @ts-ignore
export {
  client,
}
