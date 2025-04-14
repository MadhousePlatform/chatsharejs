export default interface ParsedMessage
{
  message: string,
  operator: string|null,
  user: string,
  msg: string|null,
  type: 'join'|'part'|'message'|'ban'|'unban'|'void',
  source: string
}
