FROM node:18 AS builder
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (including dev dependencies)
# RUN npm install -g npm@latest
RUN npm install

# Copy the application code
COPY . .

# Modify package.json to remove type: module if it exists
RUN grep -v '"type"' package.json > package.json.tmp && mv package.json.tmp package.json

# Create proper config files
RUN rm -f postcss.config.* tailwind.config.*
RUN echo 'module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };' > postcss.config.js
RUN echo '/** @type {import("tailwindcss").Config} */ module.exports = { content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { primary: { DEFAULT: "#2d6a4f", dark: "#4fd1c5" } }, fontFamily: { sans: ["Geist", "sans-serif"], mono: ["Geist Mono", "monospace"] } } }, plugins: [] };' > tailwind.config.js

# Build the application
ENV NODE_ENV=production
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy everything needed to run the app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/middleware.js ./middleware.js
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js
COPY --from=builder /app/postcss.config.js ./postcss.config.js
COPY --from=builder /app/tailwind.config.js ./tailwind.config.js

# Copy the entrypoint script
COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
