# Frontend Dockerfile for SlotSwapper
# Based on Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better Docker layer caching
# This allows Docker to cache the dependency installation step
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy the rest of the frontend files
# This includes src/, public/, index.html, vite.config.ts, etc.
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY jsconfig.json ./
COPY components.json ./

# Expose the port that Vite dev server runs on
EXPOSE 5173

# Set environment variable for API base URL
# This will be overridden by docker-compose.yml if needed
ENV VITE_API_BASE_URL=http://localhost:4000

# Default command to run the Vite development server
# Vite will serve the app with hot module replacement
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

