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

Afterwards, simply rebuild the docker image
```shell
$ docker build .
```

and run it with
```shell
$ docker run --network infrastructure_default --rm --env-file=.env -v /var/run/docker.sock:/var/run/docker.sock -it <sha256_hash> 
```

## Todo
- [ ] Auto-detect the regex?
- [ ] Read messages from Discord into the servers.
- [ ] Do the adult readme
- [ ] Automate deployment
- [ ] Mount `map.ts` so we don't have to rebuild every time?????
- [ ] Use a `docker-compose.yml` for manager??
