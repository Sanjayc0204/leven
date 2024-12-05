# Use a Node.js base image
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the Next.js app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
ENV GOOGLE_CLIENT_ID=539750439687-fqbcl1n2tho5s362loafhqas2bkkknrk.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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
ENV MONGODB_URI=mongodb+srv://Condyte:CondyteMongo123!@clustercondyte.fsqdl.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCondyte
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXTAUTH_URL_INTERNAL=http://localhost:3000
ENV NEXTAUTH_SECRET=7r4+1+ofOit9HuSTHVps2TerJEiAHZJr925rqqDJ0hg=
RUN npm run build

# Run the app
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built artifacts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Expose the port
EXPOSE 8080

# Start the app
USER nextjs
CMD ["npm", "run", "start"]