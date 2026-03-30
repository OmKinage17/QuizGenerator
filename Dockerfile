# Use official Node.js LTS Alpine image (lightweight)
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (layer caching optimization)
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy rest of the project
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
