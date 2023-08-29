# Use Node.js 14 as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your Nest.js application will listen on
EXPOSE 3000

# Start the Nest.js application
CMD ["npm", "run", "start:prod"]