import { SlashCommandBuilder } from "discord.js";
import { serverCount, my_servers } from "./../src/index";

// src/mcStatus.ts
import { status } from 'mc-server-utilities';
import { log } from "./../src/bootstrap.ts";

async function getOnlinePlayerCount(port = 25565) {
  try {
    const response = await status("panel.madhouseminers.com", port, { timeout: 5000 });
    return response.players.online;
  } catch (err) {
    log.error(`Failed to ping Minecraft server: ${err}`);
    return 0;
  }
}

const onlineCommand = {
  data: new SlashCommandBuilder()
    .setName('online')
    .setDescription(`Replies with the total online users across the Minecraft network.`),
  async execute(interaction) {
    let onlinePlayerCount = 0;

    my_servers.forEach((server) => {
      onlinePlayerCount += getOnlinePlayerCount(server.port);
    });

    const text = serverCount === 1 ? 'server' : 'servers';
    await interaction.reply({ content: `%d users online across ${serverCount} ${text}.` });
  }
}

export default onlineCommand;
