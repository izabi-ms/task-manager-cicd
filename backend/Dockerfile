FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && \
    npm cache clean --force

COPY src ./src

EXPOSE 5000

CMD ["node", "src/server.js"]