FROM node:18 AS builder
WORKDIR /app

# Copy package files
COPY package.json ./
COPY package-lock.json ./

# Install dependencies (including dev dependencies)
RUN npm install

# Copy only necessary files, excluding pages directory (handled by .dockerignore)
COPY app ./app
COPY components ./components
COPY public ./public
COPY styles ./styles
COPY src ./src
COPY next-i18next.config.js ./
COPY next.config.js ./
COPY tsconfig.json ./
COPY middleware.ts ./

# Modify package.json to remove type: module if it exists
RUN grep -v '"type"' package.json > package.json.tmp && mv package.json.tmp package.json


# Create proper config files
RUN rm -f postcss.config.* tailwind.config.*
RUN echo 'module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };' > postcss.config.js
RUN echo '/** @type {import("tailwindcss").Config} */ module.exports = { content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { primary: { DEFAULT: "#2d6a4f", dark: "#4fd1c5" } }, fontFamily: { sans: ["Geist", "sans-serif"], mono: ["Geist Mono", "monospace"] } } }, plugins: [] };' > tailwind.config.js

# Set environment for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Clean and build fresh
RUN rm -rf .next
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

# Set production environment with no hardcoded domains
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Copy only what's needed to run the built app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js

# Create a simple entrypoint script
RUN echo '#!/bin/sh' > entrypoint.sh && \
    echo 'set -e' >> entrypoint.sh && \
    echo 'echo "Starting Next.js in production mode"' >> entrypoint.sh && \
    echo 'exec npx next start -H 0.0.0.0 -p 3000' >> entrypoint.sh && \
    chmod +x entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
