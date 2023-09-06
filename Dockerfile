# Use an appropriate base image with Node.js and npm preinstalled
FROM node:18-slim

# Create and set the working directory in the container
WORKDIR /app

# Copy your application files, including package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the build files from your local 'dist' directory to the container
COPY ./dist ./dist

# Expose the port your application will run on (adjust this to match your application)
EXPOSE 3000

# Command to run the application using npx (adjust as needed)
CMD ["npx", "serve", "dist"]