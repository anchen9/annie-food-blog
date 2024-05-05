#!/bin/sh

node /app/backend/dist/server.js &

nginx -g "daemon off;"
