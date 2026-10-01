# syntax=docker/dockerfile:1

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Runtime stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

ENV NODE_ENV=production
EXPOSE 5001

CMD ["node", "src/server.js"]
