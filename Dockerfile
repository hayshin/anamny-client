# Use Node.js as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies using bun
RUN npm install

# Copy source code
COPY . .

# Expose port for Expo dev server
EXPOSE 8081

# Start Expo development server
CMD ["npm", "start"]
