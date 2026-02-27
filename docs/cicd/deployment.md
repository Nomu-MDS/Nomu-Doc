---
title: Déploiement
sidebar_position: 3
---

# Déploiement en production

## Workflow de déploiement

```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GHCR_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile.prod
          push: true
          tags: |
            ghcr.io/crmy7/nomu-back:latest
            ghcr.io/crmy7/nomu-back:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Clean up old images (keep 5 latest)
        run: |
          # Supprime les versions anciennes du GHCR

  deploy:
    needs: build
    runs-on: self-hosted   # Runner sur le VPS
    steps:
      - name: Sync files to VPS
        run: rsync -av --exclude='node_modules' . /home/ci/apps/api/

      - name: Generate .env from secrets
        run: |
          cat > /home/ci/apps/api/.env << ENV
          NODE_ENV=production
          PORT=3001
          DB_NAME=${{ secrets.DB_NAME }}
          DB_USER=${{ secrets.DB_USER }}
          DB_PASSWORD=${{ secrets.DB_PASSWORD }}
          DB_HOST=postgres
          MEILI_HOST=http://meilisearch:7700
          MEILI_API_KEY=${{ secrets.MEILI_API_KEY }}
          OPENAI_API_KEY=${{ secrets.OPENAI_API_KEY }}
          SESSION_SECRET=${{ secrets.SESSION_SECRET }}
          JWT_SECRET=${{ secrets.JWT_SECRET }}
          CLIENT_URL=${{ secrets.CLIENT_URL }}
          ENV

      - name: Pull latest image and restart
        run: |
          cd /home/ci/apps/api
          docker pull ghcr.io/crmy7/nomu-back:latest
          docker-compose -f docker-compose.prod.yml up -d --no-deps api

      - name: Reload nginx (zero-downtime)
        run: docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

## Workflow de tests

```yaml
# .github/workflows/test.yml

name: Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_DB: nomu_test
          POSTGRES_USER: nomu_user
          POSTGRES_PASSWORD: password
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Run tests
        run: npm test
        env:
          NODE_ENV: test
          DB_NAME: nomu_test
          DB_USER: nomu_user
          DB_PASSWORD: password
          DB_HOST: localhost
```

## Infrastructure production

```
Internet
    │
    ▼
VPS (Self-hosted)
    │
    ├── nginx (port 80/443)
    │   ├── SSL via Let's Encrypt
    │   └── Reverse proxy → api:3001
    │
    ├── api (Docker, port 3001 interne)
    │   └── ghcr.io/crmy7/nomu-back:latest
    │
    ├── postgres (Docker, port 5432 interne)
    │
    └── meilisearch (Docker, port 7700 interne)

Volumes persistants:
    ├── postgres_data → /var/lib/postgresql/data
    └── meili_data → /meili_data
```

## URL de production

| Service | URL |
|---------|-----|
| API | `https://api.nomu.charlesremy.dev` |
| Web | `https://app.nomu.charlesremy.dev` |
| Meilisearch | Interne uniquement |
| PostgreSQL | Interne uniquement |
