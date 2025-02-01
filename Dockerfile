FROM  node:20-alpine3.20 AS builder

# Instalar dependências necessárias (compilação e OpenSSL)
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./

# Instalar dependências do projeto
RUN npm ci --production

COPY . . 

FROM builder AS production

WORKDIR /app

COPY --from=builder /app /app

# Limpar cache do npm
RUN npm cache clean --force

EXPOSE 3333

# Healthcheck para o container
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD npm run healthcheck-manual

# Rodar migração e build
CMD ["sh", "-c", "npm run db:deploy && npm run build && npm start"]
