#!/bin/sh
set -e

echo "Entrypoint: Current NODE_ENV is $NODE_ENV"

if [ "$NODE_ENV" = "development" ]; then
  echo "Entrypoint: Starting development server (npm run dev)..."
  npm run dev
else
  echo "Entrypoint: NODE_ENV is '$NODE_ENV'. Running pre-built application (npm start)..."
  # The application should have been built during the Docker image build process (npm run build)
  npm start
fi 