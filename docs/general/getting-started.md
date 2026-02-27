---
title: Démarrage rapide
sidebar_position: 2
---

# Démarrage rapide

## Prérequis

- Node.js ≥ 18
- Docker & Docker Compose
- npm ≥ 9

## Installation locale (développement)

### 1. Cloner et configurer le backend

```bash
git clone https://github.com/Crmy7/Nomu-Back.git
cd Nomu-Back
cp .env.example .env
# Éditer .env avec vos valeurs
npm install
```

### 2. Démarrer les services (Docker)

```bash
# Lance PostgreSQL + Meilisearch + Adminer
docker-compose up -d postgres meilisearch adminer

# Démarrer l'API en mode dev
npm run dev
```

### 3. Initialiser les données

```bash
# Seed les centres d'intérêt
npm run seed:interests

# Seed des utilisateurs de test
npm run seed

# Indexer tous les profils searchable dans Meilisearch
npm run reindex
```

### 4. Configurer Meilisearch AI

```bash
# Configure le vector store + l'embedder OpenAI
npm run setup-ai

# Active le vector store (si non fait via setup-ai)
npm run enable-vector
```

### 5. Démarrer le frontend web

```bash
cd ../Nomu-Web
npm install
npm run dev
# Disponible sur http://localhost:3000
```

## Variables d'environnement minimales

```env
PORT=3001
DB_NAME=nomu_db
DB_USER=nomu_user
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
MEILI_HOST=http://localhost:7700
MEILI_API_KEY=masterKey
MEILI_INDEX_PROFILES=profiles_dev
OPENAI_API_KEY=sk-...
SESSION_SECRET=random_secret
JWT_SECRET=random_jwt_secret
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre l'API avec nodemon (hot reload) |
| `npm start` | Démarre l'API en production |
| `npm test` | Lance les tests Vitest |
| `npm run seed` | Crée des utilisateurs de test |
| `npm run seed:interests` | Insère les centres d'intérêt |
| `npm run reindex` | Réindexe tous les profils dans Meilisearch |
| `npm run setup-ai` | Configure l'embedder OpenAI dans Meilisearch |
| `npm run clean-index` | Supprime les profils d'utilisateurs supprimés |

## Services Docker (développement)

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:14
    ports: ["5432:5432"]

  meilisearch:
    image: getmeili/meilisearch:latest
    ports: ["7700:7700"]

  adminer:
    image: adminer
    ports: ["8080:8080"]   # Interface DB admin

  api:
    build: .
    ports: ["3001:3001"]
    depends_on: [postgres, meilisearch]
```
