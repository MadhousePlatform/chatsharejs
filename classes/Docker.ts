import InternalServer from "&/InternalServer.ts";
import docker, { Container } from 'dockerode';
import { client } from "../bot/madbot.ts";
import { config, flog } from "@/bootstrap.ts";
import { Events, Message, TextChannel } from "discord.js";
import Parser from "$/Parser.ts";

export default class Docker {
  handle_server(server: InternalServer, parser: Parser, all_servers: InternalServer[]): void {
    let cntnr = new docker({
      socketPath: '/var/run/docker.sock'
    });
    let dckr: Container = cntnr.getContainer(server.cid);

    client.on(Events.MessageCreate, async (message: Message) => {
      if (message.author.bot) return;
      if (message.channelId !== config.DISCORD_CHANNEL) return;

      const cmd: string = `tellraw @a [{"text":"[discord] ","color":"blue"},{"text":"<${message.author.username}> ","color":"light_purple"},{"text":"${message.content}","color":"white"}]\n`;

      this.broadcastToAll(cmd, all_servers, cntnr, null)
    })

    dckr.attach({
      stream: true,
      stdout: true,
      stderr: true
    }, async (_err: any, stream: NodeJS.ReadWriteStream | undefined) => {
      // @ts-ignore
      const chan: TextChannel = await client.channels.fetch(config.DISCORD_CHANNEL);
      if (!stream) throw Error("Stream is not defined??????");

      stream.on('data', async (chunk) => {
        // get data from chunk and convert to string
        const data: string = Buffer.from(chunk).toString()
        // figure out the command we want to send.
        const { message, user, msg, type, source } = parser.parse_message(data, parser);

        if (message !== null && type !== "void") {
          /* send to discord */
          await chan.send(message).then(() => {
            /* get command for minecraft */
            const cmd: string = this.getMessage(user, msg, type, source)

            this.broadcastToAll(cmd, all_servers, cntnr, server)
          });
        }
      });
    })
  }

  broadcastToAll(cmd: string, all_servers: InternalServer[], docker: docker, server: InternalServer | null): void {
    all_servers.forEach((s: InternalServer): void => {
      if (server !== null && server.exid === s.exid) return;

      const opts: object = { stream: true, stdout: true, stderr: true, stdin: true, hijack: true, tty: true };
      docker.getContainer(s.cid)
        // @ts-ignore
        .attach(opts, (_err: any, stream: NodeJS.ReadWriteStream): void => {
          stream?.pipe(process.stdout);
          stream?.pipe(process.stderr);

          process.stdin.resume();
          process.stdin.setRawMode(true);
          stream.write(cmd);

          process.stdin.removeAllListeners();
          process.stdin.setRawMode(false);
          stream.end();
        });
    })
  }

  private getMessage(user: string, msg: string | null, type: 'join' | 'part' | 'message' | 'void', source: string): string {
    let msgText: string = '';

    switch (type) {
      case 'join':
        msgText = `tellraw @a [{"text":"[mc:${source}] ","color":"red"},{"text":"${user} has joined the server","color":"white"}]\n`;
        break;
      case 'part':
        msgText = `tellraw @a [{"text":"[mc:${source}] ","color":"red"},{"text":"${user} has left the server","color":"white"}]\n`;
        break;
      case 'message':
        msgText = `tellraw @a [{"text":"[mc:${source}] ","color":"red"},{"text":"<${user}> ","color":"blue"},{"text":"${msg}","color":"white"}]\n`;
        break;
      case 'void':
      default:
        flog.warn(`Docker.getMessage()->type was not join|part|message`)
        break;
    }

    return msgText;
  }
}
