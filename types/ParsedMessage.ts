export default interface ParsedMessage
{
  message: string,
  user: string,
  msg: string|null,
  type: 'join'|'part'|'message',
  source: string
}
