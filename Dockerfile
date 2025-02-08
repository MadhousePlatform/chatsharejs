# Use Node.js LTS (Long Term Support) as base image
FROM node:22-slim

# Copy package files
COPY package.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Install dependencies
RUN npm install


# Copy source code
COPY bot ./bot
COPY classes ./classes
COPY src ./src
COPY types ./types
COPY utils ./utils
COPY tsconfig.json ./tsconfig.json
COPY vite.config.ts ./vite.config.ts
COPY docker-compose.yml ./docker-compose.yml

# Create logs directory
RUN mkdir -p logs

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["npx", "vite-node", "-m", "dev", "src/index.ts"]
