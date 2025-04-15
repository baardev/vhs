#!/bin/sh

# Simple script to restart the Node.js process if it crashes

echo "Starting VHS Backend with auto-restart..."

# Keep trying to start the server
while true; do
  node dist/index.js
  echo "Backend process exited with code $?. Restarting in 5 seconds..."
  sleep 5
done