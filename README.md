ChatShareJS!
===

## Configuring

To configure ChatShareJS, you need a Pterodactyl Panel Application API Key, a Discord
bot token and a channel to dump your messages to.

To configure the ChatShare to pick up specific minecraft servers, use the following conventions.

In the `parsers` section
```typescript
parsers: [
{
  parser: "<parser_name>",
  regexes:
    {
      join_re: <regex>,
      part_re: <regex>,
      message_re: <regex>
    }
}
]
```

For the `servers` section
```typescript
servers: [
    {
      server: "<External_ID_from_pterodactyl>",
      parser: "<parser_name>"
    },
]
```

Then run this command
```shell
$ docker compose down && docker compose up -d 
```

## Todo
[Todo list here](https://github.com/orgs/MadhousePlatform/projects/6/views/1)
