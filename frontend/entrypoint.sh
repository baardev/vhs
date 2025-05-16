#!/bin/sh
set -e

# Enable Next.js debugging for middleware
export NODE_OPTIONS="--inspect"
export NEXT_TELEMETRY_DEBUG=1
export DEBUG=middleware,next:middleware,next:*

# Force localhost settings
export NEXT_PUBLIC_HOSTNAME=localhost
export HOSTNAME=0.0.0.0
export PORT=3000

echo "Entrypoint: Current NODE_ENV is $NODE_ENV"

if [ "$NODE_ENV" = "development" ]; then
  echo "Entrypoint: Starting development server (npm run dev)..."
  # Run with explicit hostname and port
  npx next dev -H 0.0.0.0 -p 3000
else
  echo "Entrypoint: NODE_ENV is '$NODE_ENV'. Running pre-built application (npm start)..."
  # The application should have been built during the Docker image build process (npm run build)
  npx next start -H 0.0.0.0 -p 3000
fi 