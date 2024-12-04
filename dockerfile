# Setting the Base Image
FROM node:20.13.1-alpine

# Creating the Working Directory
WORKDIR /app

# Copy all files in dir
COPY . .

RUN npm install --production

RUN npm build
