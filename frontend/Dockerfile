# Use official Node.js image as base
FROM node:16-alpine

# Set work directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy project
COPY . .

# Build the app
RUN npm run build

# Install serve to serve the build
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Command to run the frontend
CMD ["serve", "-s", "build", "-l", "3000"]
