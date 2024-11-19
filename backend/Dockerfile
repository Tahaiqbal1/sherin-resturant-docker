# Example Dockerfile for the backend service
FROM node:18.20.4

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --build-from-source bcrypt

# Copy the rest of the application
COPY . .

# Expose the app port (change if necessary)
EXPOSE 5000

# Run the app
CMD ["npm", "start"]
