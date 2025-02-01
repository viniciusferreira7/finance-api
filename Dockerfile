FROM node:20-alpine AS builder

# Install dependencies using apk (Alpine's package manager)
RUN apk update && apk add --no-cache build-base

WORKDIR /app

COPY package*.json ./

# Install project dependencies
RUN npm ci --production

COPY . .

FROM builder AS production

WORKDIR /app

COPY --from=builder /app /app

# Clean npm cache
RUN npm cache clean --force

EXPOSE 3333

# Healthcheck for the container
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD npm run healthcheck-manual

CMD ["sh", "-c", "npm run db:deploy && npm run build"]
