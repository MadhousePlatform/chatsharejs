import map from './../map.ts';
import InternalServer from "&/InternalServer.ts";
import ServerEntry from "&/ServerEntry.ts";
import ParserEntry from "&/ParserEntry.ts";
import ParserRegex from "&/ParserRegex.ts";
import ParsedMessage from "&/ParsedMessage.ts";

export default class Parser {
  serversMap: any;
  parsersMap: any;
  server: InternalServer;
  parser: ParserRegex | undefined;

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
      join_re: parser.join_re,
      part_re: parser.part_re,
      message_re: parser.message_re
    }
  }

  /**
   * Dear programmer:
   * When I wrote this code, only god and
   * I knew how it worked.
   * Now, only god knows it!
   *
   * Therefore, if you are trying to optimize
   * this routine, and it fails (most surely),
   * please increase this counter as a
   * warning for the next person:
   *
   * total hours wasted here = 6
   */
  parse_message(message: string, parser: Parser): ParsedMessage {
    const prsr: ParserRegex = this.resolve_parser(this.get_server_parser());

    if (prsr.join_re.test(message)) {
      prsr.join_re.exec(message)
      const props: { [key: string]: string } | undefined = prsr.join_re.exec(message)?.groups

      return {
        // @ts-ignore
        message: `[mc:${parser.server.exid}] **${props.user}** has joined the game.`,
        // @ts-ignore
        user: props.user,
        msg: null,
        type: 'join',
        source: parser.server.exid,
      }
    } else if (prsr.part_re.test(message)) {
      prsr.part_re.exec(message)
      const props: { [key: string]: string } | undefined = prsr.part_re.exec(message)?.groups

      return {
        // @ts-ignore
        message: `[mc:${parser.server.exid}] **${props.user}** has left the game.`,
        // @ts-ignore
        user: props.user,
        msg: null,
        type: 'part',
        source: parser.server.exid,
      }
    } else if (prsr.message_re.test(message)) {
      prsr.message_re.exec(message)
      const props: { [key: string]: string } | undefined = prsr.message_re.exec(message)?.groups

      return {
        // @ts-ignore
        message: `[mc:${parser.server.exid}] <**${props.user}**> ${props.msg}`,
        // @ts-ignore
        user: props.user,
        // @ts-ignore
        msg: props.msg,
        type: 'message',
        source: parser.server.exid,
      }
    }

    return {
      message: '',
      user: '',
      msg: '',
      type: 'void',
      source: '',
    }
  }

  private get_server_parser(): string {
    const parser: ParserEntry = this.serversMap.find((se: ServerEntry): boolean => this.server.exid === se.server);
    return parser.parser;
  }

  private resolve_parser(parser: string): ParserRegex {
    const regexes = this.parsersMap.find((pe: ParserEntry): boolean => parser === pe.parser).regexes

    if(!regexes) return this.parsersMap.find((): boolean => parser === 'vanilla').regexes;

    return regexes;
  }
}
