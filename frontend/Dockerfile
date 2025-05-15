FROM node:lts AS linter
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run lint && npx tsc --noEmit

FROM node:lts AS builder
WORKDIR /app

# Declare NODE_ENV as a build argument.
# It will pick up the value from --build-arg passed by your REBUILD script
# or default to 'development' if not provided directly to 'docker build'.
ARG NODE_ENV=development
# Set the ENV variable from the ARG so shell commands in this stage can use it.
ENV NODE_ENV=${NODE_ENV}

# Update npm as part of the build process
RUN npm install -g npm@latest

COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Ensure proper permissions for the .next directory
# RUN mkdir -p .next && chmod -R 777 .next # This might not be needed if build handles it

# Always run npm run build. The build process itself can be NODE_ENV aware.
RUN set -e; \
    echo "Ensuring .next directory is clean..." && \
    npm run clean && \
    echo "Builder stage: Building with NODE_ENV=${NODE_ENV}" && \
    npm run build

FROM node:lts AS runner
WORKDIR /app

# Ensure NODE_ENV is set for the runtime environment of the final image.
# This will be overridden by docker-compose environment settings if provided.
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js

# Copy the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# --- Debugging Start --- #
RUN echo "DEBUG: Listing /app contents in runner stage:" && ls -la /app
RUN echo "DEBUG: Listing /app/.next contents in runner stage:" && ls -la /app/.next || echo "DEBUG: /app/.next not found or empty"
# --- Debugging End --- #

# Ensure the .next directory has proper permissions if needed, though build/start should manage this.
# RUN chmod -R 777 .next

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
# CMD is removed as entrypoint handles the command
