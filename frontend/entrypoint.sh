#!/bin/sh
set -e

# Enable Next.js debugging for middleware
export NODE_OPTIONS="--inspect"
export NEXT_TELEMETRY_DEBUG=1
export DEBUG=middleware,next:middleware,next:*

# Use the environment variable or default to libronico.com
export NEXT_PUBLIC_HOSTNAME=${NEXT_PUBLIC_HOSTNAME:-libronico.com}
export HOSTNAME=0.0.0.0
export PORT=3000

echo "Entrypoint: Current NODE_ENV is $NODE_ENV"

# Check if .next directory exists and has content
if [ ! -d .next ] || [ -z "$(ls -A .next 2>/dev/null)" ]; then
  echo "Entrypoint: .next directory doesn't exist or is empty. Running build first..."
  npm run build
fi

if [ "$NODE_ENV" = "development" ]; then
  echo "Entrypoint: Starting development server (npm run dev)..."
  # Run with explicit hostname and port
  npx next dev -H 0.0.0.0 -p 3000
else
  echo "Entrypoint: NODE_ENV is '$NODE_ENV'. Running pre-built application (npm start)..."
  # The application should have been built during the Docker image build process (npm run build)
  npx next start -H 0.0.0.0 -p 3000
fi 