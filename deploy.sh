#!/usr/bin/env bash
docker pull ghcr.io/madhouseplatform/chatsharejs
docker compose down
docker compose up -d
