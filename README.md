ChatShareJS!
===

# What is Chatshare?
Chatshare is an application developed at Madhouse Miners to allow users
on different minecraft servers on our network to communicate with each
other and via Discord.

## Configuring

To configure ChatShareJS, you need the following:
1. Pterodactyl Panel Application API Key, 
2. Discord Bot Token 
3. Discord channel for messages to be sent and read from.

To configure the ChatShare to pick up specific minecraft servers, 
use the following conventions.

In the `parsers` section
```typescript
parsers: [
{
  parser: "<parser_name>",
  regexes:
    {
      join_re: regex,
      part_re: regex,
      message_re: regex
    }
}
]
```

For the `servers` section
```typescript
servers: [
    {
      server: "External_ID_from_pterodactyl",
      parser: "parser_name"
    },
]
```

Then run this command
```shell
$ docker pull ghcr.io/madhouseplatform/chatsharejs && \ 
  docker compose down && \ 
  docker compose up -d 
```

## Contributing

We welcome contributions to our software. Please see [all open tickets][1]
before choosing to contribute.

## Security Vulnerabilities

For any security vulnerabilities, please email [Sketch][2]

[1]:https://github.com/orgs/MadhousePlatform/projects/6/views/1 "Link to GitHub Projects page"
[2]:mailto:sketch@sketchni.uk?subject=Security%20bug%20in%20chatsharejs "Contact Sketch"
