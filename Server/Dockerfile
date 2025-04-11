# Build stage
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install all dependencies (including dev dependencies)
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN yarn build
RUN ls -la dist/

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install only production dependencies
RUN yarn install --production

# Copy the entire dist directory structure
COPY --from=builder /app/dist/ ./dist/

# Copy necessary files for database connections
COPY --from=builder /app/Database ./Database

# Set environment variables
ENV PORT=10000

# Expose the port the app runs on
EXPOSE 10000

# Command to run the application with debug logging
CMD ["node", "--trace-warnings", "dist/main.js"] 