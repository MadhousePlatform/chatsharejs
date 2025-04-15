import {
  Client,
  Collection,
  Events,
  GatewayIntentBits, Routes,
  MessageFlagsBitField, Interaction, CacheType, REST
} from 'discord.js';
import { config, log } from '@/bootstrap.ts';
import path from "node:path";
import fs from "fs";
import Command from "&/Command.ts";

interface DiscordClient extends Client {
  commands: Collection<string, Command>;

}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
}) as DiscordClient;

client.commands = new Collection();

client.once(Events.ClientReady, (readyClient: Client<true>) => {
  log.info(`Logged in as ${readyClient.user.tag}`)
});

client.on(Events.InteractionCreate, async (interaction: Interaction<CacheType>): Promise<void> => {
  if (!interaction.isChatInputCommand()) return;

  const discord_client = interaction.client as DiscordClient;

  const command = discord_client.commands.get(interaction.commandName);

  if (!command) {
    log.error(`No command matching ${interaction.commandName} was found.`)
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlagsBitField.Flags.Ephemeral });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlagsBitField.Flags.Ephemeral });
    }
  }
});

const commandsPath = path.join(__dirname, './../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file)).default as Command;
  if (command?.data) {
    client.commands.set(command.data.name, command);
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(config.DISCORD_TOKEN ?? '');

// and deploy your commands!
(async () => {
  try {
    log.debug(`Started refreshing ${client.commands.size} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data: any = await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID ?? '', config.DISCORD_GUILD_ID ?? ''),
      { body: client.commands.map(cmd => cmd.data.toJSON()) },
    );

    log.debug(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    log.error(error);
  }
})();

// @ts-ignore
export {
  client,
}
