# Build stage
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# First copy all source files
COPY . .

# Install all dependencies including devDependencies
RUN npm install

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only, skip scripts
RUN npm install --omit=dev --ignore-scripts

# Copy built files from builder stage
COPY --from=builder /app/dist/ ./dist/

# Copy necessary files for database connections
COPY --from=builder /app/Database ./Database

# Set environment variables
ENV PORT=10000
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 10000

# Command to run the application
CMD ["node", "dist/main.js"] 