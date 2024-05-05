#!/bin/sh

pm2 start ./backend/dist/server.js

nginx -g "daemon off;"

chmod +x start.sh