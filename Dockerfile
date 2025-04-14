# Use Node.js LTS (Long Term Support) as base image
FROM node:22-slim

# Copy package files
COPY package.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install


# Copy source code
COPY bot ./bot
COPY classes ./classes
COPY src ./src
COPY types ./types
COPY utils ./utils
COPY tsconfig.json ./tsconfig.json
COPY docker-compose.yml ./docker-compose.yml

# Create logs directory
RUN mkdir -p logs

# Set environment variables
ENV NODE_ENV=dev

# Start the application
CMD ["tsx", "src/index.ts"]
