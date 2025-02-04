import InternalServer from "&/InternalServer.ts";
import docker from 'dockerode';
import { client } from "../bot/madbot.ts";
import { config } from "@/bootstrap.ts";
import { TextChannel } from "discord.js";
import Parser from "$/Parser.ts";

export default class Docker {
  handle_server(server: InternalServer, parser: Parser, all_servers: InternalServer[]): void {
    let cntnr = new docker();
    let dckr = cntnr.getContainer(server.cid);
    dckr.attach({ stream: true, stdout: true, stderr: true }, async (_err: any, stream) => {
      // @ts-ignore
      const chan: TextChannel = await client.channels.fetch(config.DISCORD_CHANNEL);
      // @ts-ignore
      stream.on('data', (chunk) => {
        const data: string = Buffer.from(chunk).toString()
        const { message, user, msg, type, source } = parser.parse_message(data, parser);
        if (message !== null && type !== "void") {
          chan.send(message);
          /*
           * @todo: get this to attach to container and write to minecraft then detach container.
           */
          all_servers.forEach((s: InternalServer) => {
            cntnr.getContainer(s.cid)
              .attach(
                { stream: true, stdout: true, stderr: true },
                async (_err: any, stream) => {
                  let msgText: string = '';

                  switch (type) {
                    case 'join':
                      msgText = `tellraw @a [{{"text":"[${source}] ","color":"red"}},{{"text":"${user} has joined the server","color":"white"}}]\n`;
                      break;
                    case 'part':
                      msgText = `tellraw @a [{{"text":"[${source}] ","color":"red"}},{{"text":"${user} has left the server","color":"white"}}]\n`;
                      break;
                    case 'message':
                      msgText = `tellraw @a [{{"text":"[${source}] ","color":"red"}},{{"text":"<${user}> ","color":"blue"}},{{"text":"${msg}","color":"white"}}]\n`;
                      break;
                  }

                  stream?.write(msgText);
                })
          })
        }
      });
    })
  }
}
