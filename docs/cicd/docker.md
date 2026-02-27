---
title: Docker
sidebar_position: 2
---

# Docker

## Images

| Image | Utilisation | Base |
|-------|-------------|------|
| `Dockerfile` | Développement local | node:20, nodemon |
| `Dockerfile.prod` | Production | node:20-alpine (multi-stage) |

## Dockerfile de production (multi-stage)

```dockerfile
# Dockerfile.prod

# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runner
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3001
CMD ["node", "app/server.js"]
```

## docker-compose.yml (développement)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: nomu_db
      POSTGRES_USER: nomu_user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  meilisearch:
    image: getmeili/meilisearch:latest
    environment:
      MEILI_MASTER_KEY: masterKey
      MEILI_ENV: development
    ports:
      - "7700:7700"
    volumes:
      - meili_data:/meili_data

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - postgres

  api:
    build: .
    ports:
      - "3001:3001"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      NODE_ENV: development
      DB_HOST: postgres
      MEILI_HOST: http://meilisearch:7700
    depends_on:
      - postgres
      - meilisearch

volumes:
  postgres_data:
  meili_data:
```

## docker-compose.prod.yml (production)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    env_file: .env
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data

  meilisearch:
    image: getmeili/meilisearch:latest
    env_file: .env
    restart: unless-stopped
    volumes:
      - meili_data:/meili_data

  api:
    image: ghcr.io/crmy7/nomu-back:latest
    env_file: .env
    restart: unless-stopped
    depends_on:
      - postgres
      - meilisearch
    expose:
      - "3001"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - api
    restart: unless-stopped

volumes:
  postgres_data:
  meili_data:
```
