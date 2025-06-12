# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install dependencies (use --omit=dev for production)
RUN npm install

# Copy the rest of the application files
COPY . .

# Create the .expo directory with correct permissions
RUN mkdir -p .expo && chown -R node:node /app

# Run as a non-root user for security
USER node

# Expose the port your app runs on (adjust if needed)
EXPOSE 8081

# Start the app (replace with your actual start command if different)
CMD ["npm", "start"]
