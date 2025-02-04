import { flog, log } from "./bootstrap.ts";
import Server from "$/Server.ts";
import { AxiosResponse } from "axios";
import Parser from "$/Parser.ts";
import PterodactylServer from "&/PterodactylServer.ts";
import InternalServer from "&/InternalServer.ts";

async function startChatShare(): Promise<void> {
  const servers: AxiosResponse = await (new Server).get_all();
  const ids: Array<InternalServer> = [];
  servers.data.data.filter(
    (s: PterodactylServer) => !s.attributes.suspended && s.attributes.external_id !== null
      ? ids.push({ exid: s.attributes.external_id, cid: s.attributes.identifier })
      : ''
  );

  ids.forEach((server: InternalServer) => {
    log.debug(`Iterating servers (Server: ${server.exid})`)
    const parser = new Parser(server);
    if (parser !== undefined) {
      parser.new();
    }
  });
}

startChatShare().then((): void => {
  log.debug('Starting ChatShare');
});

process.on('exit', (code: number) => {
  doExit(code);
});

process.on('SIGHUP', (code: number) => {
  doExit(code);
});

process.on('SIGTERM', (code: number) => {
  doExit(code);
});

process.on('SIGINT', (code: number) => {
  doExit(code);
});

function doExit(code: number) {
    flog.error(`Unexpected exit. Error code: ${code}`);
}