FROM node:lts AS builder
WORKDIR /app

# Update npm as part of the build process
RUN npm install -g npm@latest

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js
COPY --from=builder /app/public/locales ./public/locales
EXPOSE 3000
CMD ["npm", "start"]
