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
   * total hours wasted here = 8
   */
  parse_message(message: string, parser: Parser): ParsedMessage {
    const prsr: ParserRegex = this.resolve_parser(this.get_server_parser());

    const patterns: { re: RegExp, type: 'join'|'part'|'message'|'void', msg: string }[] = [
      { re: prsr.join_re, type: 'join', msg: '**${props.user}** has joined the game.' },
      { re: prsr.part_re, type: 'part', msg: '**${props.user}** has left the game.' },
      { re: prsr.message_re, type: 'message', msg: '<**${props.user}**> ${props.msg}' }
    ];

    for (const {re, type, msg} of patterns) {
      const match: RegExpMatchArray|null = re.exec(message);
      if (match?.groups) {
        const props: { [key: string]: string } = match.groups;

        return {
          message: `[mc:${parser.server.exid}] ${msg.replace('${props.user}', props.user).replace('${props.msg}', props.msg)}`,
          user: props.user,
          msg: props.msg || null,
          type,
          source: parser.server.exid,
        }
      }
    }

    return {
      message: '',
      user: '',
      msg: null,
      type: 'void',
      source: '',
    }
  }

  private get_server_parser(): string {
    const parser: ParserEntry = this.serversMap.find((se: ServerEntry): boolean => this.server.exid === se.server);
    return parser?.parser || 'vanilla';
  }

  private resolve_parser(parser: string): ParserRegex {
    return this.parsersMap.find((pe: ParserEntry): boolean => parser === pe.parser).regexes
  }
}
