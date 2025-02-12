import InternalServer from "&/InternalServer.ts";
import { flog } from "@/bootstrap.ts";
import config from "@/config.ts";
import { client } from "%/madbot.ts";
import Parser from "$/Parser.ts";
import docker, { Container } from 'dockerode';
import { Channel, TextChannel } from "discord.js";

export default class Docker {
  handle_server(container: any, server: InternalServer, parser: Parser, all_servers: InternalServer[]): void {
    let docker: Container = container.getContainer(server.cid);

    docker.attach({
      stream: true,
      stdout: true,
      stderr: true
    }, async (_err: any, stream: NodeJS.ReadWriteStream | undefined): Promise<void> => {
      const channel: Channel | null = await client.channels.fetch(config.discord.channel);

      if (!(channel instanceof TextChannel)) throw new Error('Invalid type of channel specified. Please use a Text Channel.')
      if (!stream) throw new Error("Stream is not defined");

      stream.on('data', async (chunk: any): Promise<void> => {
        const data: string = chunk.toString()
        const { message, user, msg, type, source } = parser.parse_message(data, parser);

        if (message) {
          await channel.send(message).then((): void => {
            const cmd: string = this.getMessage(user, msg, type, source)
            this.broadcastToAll(cmd, all_servers, container, server)
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
    if (type === 'void') {
      flog.warn('Docker.getMessage()->type was not join|part|message');
      return '';
    }

    const baseText = `[mc:${source}] `;
    let messageText = '';

    if (type === 'join') {
      messageText = `${user} has joined the server`;
    } else if (type === 'part') {
      messageText = `${user} has left the server`;
    } else if (type === 'message' && msg) {
      messageText = `<${user}> ${msg}`;
    }

    return `tellraw @a [{"text":"${baseText}","color":"red"},{"text":"${messageText}","color":"white"}]\n`;
  }
}
