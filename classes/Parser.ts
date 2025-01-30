import map from './../map.ts';
import InternalServer from "&/InternalServer.ts";
import ServerEntry from "&/ServerEntry.ts";
import ParserEntry from "&/ParserEntry.ts";
import ParserRegex from "&/ParserRegex.ts";

export default class Parser {
  serversMap: any;
  parsersMap: any;
  server: InternalServer;
  parser: ParserRegex|undefined;

  constructor(server: InternalServer) {
    this.server = server;
    this.serversMap = map.servers;
    this.parsersMap = map.parsers;
  }

  new(): ParserRegex | null {
    const server_parser: string = this.get_server_parser();
    const parser: ParserRegex = this.resolve_parser(server_parser);

    this.parser = parser;
    return {
      join_re: new RegExp(parser.join_re),
      part_re: new RegExp(parser.part_re),
      message_re: new RegExp(parser.message_re)
    }
  }

  private parse_message(message: string) {
    if (this.parser?.join_re.test(message)) {

    } else if (this.parser?.part_re.test(message)) {

    } else if (this.parser?.message_re.test(message)) {
      
    }
  }

  private get_server_parser(): string {
    const parser: ParserEntry = this.serversMap.find((se: ServerEntry): boolean => this.server.exid === se.server);
    return parser.parser;
  }

  private resolve_parser(parser: string): ParserRegex {
    return this.parsersMap.find((pe: ParserEntry): boolean => parser === pe.parser).regexes
  }
}
