
FROM node:lts-slim AS builder

RUN apt-get update && apt-get install -y build-essential && \
  apt-get autoclean -y && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

FROM node:lts-alpine AS production

WORKDIR /app

COPY --from=builder /app /app

RUN npm cache clean --force

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD npm run healthcheck-manual

CMD ["node", "./src/server"]
