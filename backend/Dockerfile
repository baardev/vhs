FROM node:lts AS linter

WORKDIR /app

# Update npm as part of the build process
RUN npm install -g npm@latest

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

RUN npm update

# Copy the source files
COPY . .

# Compile TypeScript
RUN npm run build

# Create startup script
RUN echo '#!/bin/bash\nset -e\necho "Starting backend service..."\nnode dist/index.js || { echo "Backend service crashed. Check logs for details."; exit 1; }' > start.sh && \
    chmod +x start.sh

# Expose the application port
EXPOSE 4000

# Start the compiled backend with the startup script
CMD ["./start.sh"]
