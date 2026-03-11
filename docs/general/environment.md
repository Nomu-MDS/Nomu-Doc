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
| `JWT_SECRET` | Oui | — | Secret pour les tokens JWT |
| `SESSION_SECRET` | Oui | — | Secret pour les sessions Express/Passport |
| `DB_NAME` | Oui | — | Nom de la base PostgreSQL |
| `DB_USER` | Oui | — | Utilisateur PostgreSQL |
| `DB_PASSWORD` | Oui | — | Mot de passe PostgreSQL |
| `DB_HOST` | Oui | — | Host PostgreSQL (`postgres` en Docker) |
| `DB_PORT` | Non | `5432` | Port PostgreSQL |
| `MEILI_HOST` | Oui | — | URL Meilisearch (`http://meilisearch:7700`) |
| `MEILI_MASTER_KEY` | Oui | — | Master key Meilisearch |
| `MEILI_API_KEY` | Oui | — | Clé API Meilisearch |
| `MEILI_INDEX_PROFILES` | Oui | — | Nom de l'index (`profiles_dev` / `profiles_prod`) |
| `OPENAI_API_KEY` | Recommandé | — | Clé OpenAI pour les embeddings sémantiques |
| `GOOGLE_CLIENT_ID` | Oui (OAuth) | — | Google OAuth client ID (web) |
| `GOOGLE_CLIENT_SECRET` | Oui (OAuth) | — | Google OAuth client secret |
| `GOOGLE_MOBILE_CLIENT_ID` | Oui (OAuth) | — | Google OAuth client ID (Android) |
| `GOOGLE_IOS_CLIENT_ID` | Oui (OAuth) | — | Google OAuth client ID (iOS) |
| `GOOGLE_CALLBACK_URL` | Oui (OAuth) | — | URL de callback OAuth (ex: `https://api.nomu.fr/auth/google/callback`) |
| `CLIENT_URL` | Oui (prod) | — | URL du frontend (CORS, ex: `https://app.nomu.fr`) |
| `MINIO_ROOT_USER` | Oui | — | Identifiant root MinIO |
| `MINIO_ROOT_PASSWORD` | Oui | — | Mot de passe root MinIO |
| `MINIO_PUBLIC_URL` | Oui | — | URL publique MinIO pour les uploads |

:::warning
Sans `OPENAI_API_KEY`, la recherche sémantique est désactivée. La recherche fonctionne toujours en mode keyword uniquement.
:::

```env
# Nomu-Back/.env
PORT=3001
JWT_SECRET=
SESSION_SECRET=
MEILI_HOST=
MEILI_MASTER_KEY=
MEILI_API_KEY=
MEILI_INDEX_PROFILES=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
OPENAI_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_MOBILE_CLIENT_ID=
GOOGLE_IOS_CLIENT_ID=
GOOGLE_CALLBACK_URL=
CLIENT_URL=
MINIO_ROOT_USER=
MINIO_ROOT_PASSWORD=
MINIO_PUBLIC_URL=
```

---

## Frontend Web (Nomu-Web)

| Variable | Description |
|----------|-------------|
| `NUXT_API_BASE_URL` | URL interne de l'API (server-side, ex: `http://localhost:3001`) |
| `NUXT_PUBLIC_SOCKET_URL` | URL WebSocket accessible au client |
| `NUXT_PUBLIC_API_BASE` | URL publique de l'API (client-side) |

```env
# Nomu-Web/.env
NUXT_API_BASE_URL=http://localhost:3001
NUXT_PUBLIC_SOCKET_URL=http://localhost:3001
NUXT_PUBLIC_API_BASE=http://localhost:3001
```

## Proxy Nuxt

Le frontend proxifie toutes les requêtes `/api/*` vers le backend :

```typescript
// nuxt.config.ts
runtimeConfig: {
  apiBaseUrl: 'http://localhost:3001',    // server-side
  public: {
    socketUrl: 'http://localhost:3001',   // client-side
    apiBase: 'http://localhost:3001',     // client-side
  }
}
```

Les appels `$fetch('/api/users/me')` sont automatiquement redirigés vers `http://localhost:3001/users/me`.

---

## Mobile (Nomu-Front)

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_BASE_URL` | URL de l'API backend |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID (Android/web) |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | Google OAuth client ID (iOS) |

```env
# Nomu-Front/.env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
```

---

## Admin (Nomu-Admin)

| Variable | Description |
|----------|-------------|
| `NUXT_SESSION_PASSWORD` | Secret pour les sessions admin (min. 32 caractères) |
| `NUXT_OAUTH_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `NUXT_OAUTH_GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NUXT_API_BASE` | URL de l'API backend |

```env
# Nomu-Admin/.env
NUXT_SESSION_PASSWORD=
NUXT_OAUTH_GOOGLE_CLIENT_ID=
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=
NUXT_API_BASE=http://localhost:3001
```
