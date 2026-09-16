FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*


COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/package*.json ./

COPY src ./src


EXPOSE 5000

CMD ["node","src/server.js"]