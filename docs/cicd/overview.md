---
title: Vue d'ensemble CI/CD
sidebar_position: 1
---

# CI/CD & Déploiement

## Pipelines GitHub Actions

Nomu dispose de deux workflows GitHub Actions :

| Workflow | Fichier | Déclencheur |
|----------|---------|-------------|
| Tests | `.github/workflows/test.yml` | Push / PR sur `main` |
| Déploiement | `.github/workflows/deploy.yml` | Push sur `main` ou déclenchement manuel |

## Workflow de développement

```mermaid
flowchart TD
    DEV["Developer\ngit push origin feature/xxx"]
    PR["GitHub Pull Request"]
    CI1["CI — test.yml\nPostgreSQL service · npm ci · npm test (Vitest)"]
    REVIEW["Code Review"]
    MERGE["Merge to main"]
    CI2["CI — test.yml re-run"]

    subgraph CD["CD — deploy.yml"]
        J1["Job 1 : Build Docker image<br/>Push to GHCR"]
        J2["Job 2 : Deploy on VPS (self-hosted runner)<br/>Sync files · Generate .env · docker pull<br/>docker-compose up -d · nginx reload"]
        J1 --> J2
    end

    DEV --> PR
    PR --> CI1
    CI1 --> REVIEW
    REVIEW --> MERGE
    MERGE --> CI2
    MERGE --> CD
```

## Infrastructure VPS

```mermaid
flowchart TB
    subgraph VPS ["Serveur VPS Linux (Production)"]
        direction TB
        Nginx["🛡️ Nginx Gateway\n(SSL Certbot)"]

        subgraph DockerNet ["Réseau Docker Privé (nomu-network)"]
            API_C["⚙️ API Express"]
            PG_C[("🗄️ PostgreSQL")]
            MS_C["🔍 Meilisearch"]
            MIN_C["📦 MinIO"]
        end

        subgraph Supervision ["Admin"]
            Portainer["🐳 Portainer"]
            Adminer["🛠️ Adminer"]
        end

        Runner["🤖 Runner GitHub\n(Self-hosted)"]
    end

    Internet((Internet)) ==> Nginx
    Nginx ==> API_C
    Nginx -.-> Supervision
    API_C <--> PG_C & MS_C & MIN_C
    Runner -.->|CD Trigger| DockerNet
```

## Secrets GitHub requis

| Secret | Description |
|--------|-------------|
| `GHCR_TOKEN` | Personal Access Token pour GHCR |
| `DB_NAME` | Nom de la base PostgreSQL |
| `DB_USER` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | Mot de passe PostgreSQL |
| `MEILI_API_KEY` | Master key Meilisearch |
| `OPENAI_API_KEY` | Clé API OpenAI |
| `SESSION_SECRET` | Secret session Express |
| `JWT_SECRET` | Secret JWT |
| `CLIENT_URL` | URL du frontend (CORS) |
