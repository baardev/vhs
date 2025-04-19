FROM node:lts AS linter
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run lint && npx tsc --noEmit

FROM node:lts AS builder
WORKDIR /app

# Set build arg for environment (defaulting to development for build time)
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Update npm as part of the build process
RUN npm install -g npm@latest

COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Ensure proper permissions for the .next directory
RUN mkdir -p .next && chmod -R 777 .next
RUN npm run build

FROM node:lts AS runner
WORKDIR /app

# Pass the NODE_ENV through all stages
# ARG NODE_ENV=production
# ENV NODE_ENV=$NODE_ENV

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
CMD ["npm", "start"]
