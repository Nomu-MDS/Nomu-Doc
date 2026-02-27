---
title: Variables d'environnement
sidebar_position: 4
---

# Variables d'environnement

## Backend (Nomu-Back)

| Variable | Requis | Défaut | Description |
|----------|--------|--------|-------------|
| `PORT` | Non | `3001` | Port de l'API Express |
| `NODE_ENV` | Non | `development` | `development` ou `production` |
| `DB_NAME` | Oui | — | Nom de la base PostgreSQL |
| `DB_USER` | Oui | — | Utilisateur PostgreSQL |
| `DB_PASSWORD` | Oui | — | Mot de passe PostgreSQL |
| `DB_HOST` | Oui | — | Host PostgreSQL (`postgres` en Docker) |
| `DB_PORT` | Non | `5432` | Port PostgreSQL |
| `MEILI_HOST` | Oui | — | URL Meilisearch (`http://meilisearch:7700`) |
| `MEILI_API_KEY` | Oui | — | Master key Meilisearch |
| `MEILI_INDEX_PROFILES` | Oui | — | Nom de l'index (`profiles_dev` / `profiles_prod`) |
| `OPENAI_API_KEY` | Recommandé | — | Clé OpenAI pour les embeddings sémantiques |
| `SESSION_SECRET` | Oui | auto-généré | Secret pour les sessions Express/Passport |
| `JWT_SECRET` | Oui | auto-généré | Secret pour les tokens JWT |
| `CLIENT_URL` | Oui (prod) | — | URL du frontend (CORS) ex: `https://app.nomu.fr` |
| `MOBILE_APP_URL` | Non | — | URL optionnelle app mobile (CORS) |

:::warning
Sans `OPENAI_API_KEY`, la recherche sémantique est désactivée. La recherche fonctionne toujours en mode keyword uniquement.
:::

## Frontend (Nomu-Web)

| Variable | Fichier | Description |
|----------|---------|-------------|
| `NUXT_API_BASE_URL` | `.env` | URL interne de l'API (`http://localhost:3001`) |
| `NUXT_PUBLIC_SOCKET_URL` | `.env` | URL WebSocket accessible au client |

```env
# Nomu-Web/.env
NUXT_API_BASE_URL=http://localhost:3001
NUXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Proxy Nuxt

Le frontend proxifie toutes les requêtes `/api/*` vers le backend :

```typescript
// nuxt.config.ts
runtimeConfig: {
  apiBaseUrl: 'http://localhost:3001',    // server-side
  public: {
    socketUrl: 'http://localhost:3001'    // client-side
  }
}
```

Les appels `$fetch('/api/users/me')` sont automatiquement redirigés vers `http://localhost:3001/users/me`.
