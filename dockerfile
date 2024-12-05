# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

ENV GOOGLE_CLIENT_ID=539750439687-fqbcl1n2tho5s362loafhqas2bkkknrk.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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
ENV MONGODB_URI=mongodb+srv://Condyte:CondyteMongo123!@clustercondyte.fsqdl.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCondyte
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXTAUTH_URL_INTERNAL=http://localhost:3000
ENV NEXTAUTH_SECRET=7r4+1+ofOit9HuSTHVps2TerJEiAHZJr925rqqDJ0hg=

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE $PORT
CMD npm run dev