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
RUN mkdir -p .next && chmod -R 777 .next

# This conditional build command will now use the NODE_ENV set via build-arg
RUN echo "Builder stage: Building with NODE_ENV=${NODE_ENV}" && \
    if [ "${NODE_ENV}" = "production" ]; then \
      echo "Builder stage: Running npm run build (Production Mode)" && \
      npm run build; \
    else \
      echo "Builder stage: Running npm run dev (Development Mode) - This will hang if not interactive!" && \
      npm run dev; \
    fi

FROM node:lts AS runner
WORKDIR /app

# Ensure NODE_ENV is set for the runtime environment of the final image.
# Default to 'production' for the runner stage, as it should run a production build.
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js
COPY --from=builder /app/public/locales ./public/locales

# Ensure the .next directory has proper permissions
RUN chmod -R 777 .next

EXPOSE 3000
# CMD should start the Next.js production server.
# Ensure your package.json "start" script is typically "next start".
CMD ["npm", "start"]
