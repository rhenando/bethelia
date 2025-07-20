# 1. Use an official Node.js runtime as a parent image
# Using 'alpine' makes the image smaller and more secure
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json
# This is an optimization: Docker will only re-run 'npm install' if these files change
COPY package*.json ./

# 4. Install project dependencies
RUN npm install

# 5. Copy the rest of your application's code into the container
COPY . .

# 6. Build your Next.js application for production
RUN npm run build

# 7. Expose port 3000 so we can access the app from outside the container
EXPOSE 3000

# 8. Define the command to run your app
CMD ["npm", "start"]