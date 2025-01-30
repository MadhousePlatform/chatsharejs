import ParserRegex from "./ParserRegex.ts";

export default interface ParserEntry
{
  parser: string,
  regexes: ParserRegex
}