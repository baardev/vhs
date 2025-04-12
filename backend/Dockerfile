FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source files
COPY . .

# Compile TypeScript
RUN npm run build

# Expose the application port
EXPOSE 4000

# Start the compiled backend
CMD ["node", "dist/index.js"]
