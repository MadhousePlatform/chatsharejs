#!/usr/bin/env bash
cd ~/chatsharejs
docker pull ghcr.io/madhouseplatform/chatsharejs
docker compose down
docker compose up -d
