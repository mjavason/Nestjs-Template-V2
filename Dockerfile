# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies required for native builds
RUN apk add --no-cache libc6-compat python3 make g++

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy application code
COPY . .

# Build the NestJS application
RUN yarn build

# Run tests
RUN yarn test --ci

# Expose application port
EXPOSE 3000

# Start the application
CMD ["yarn", "start:prod"]