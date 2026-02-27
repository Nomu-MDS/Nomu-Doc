---
title: Architecture
sidebar_position: 1
---

# Architecture générale

## Vue d'ensemble

```mermaid
graph TD
    A["CLIENTS — Nomu-Web (Nuxt 4) · Nomu-Mobile (React Native)"]
    B["nginx — reverse proxy"]
    C["Nomu-Back — Express 5 + Socket.IO"]
    D["REST API<br/>Express"]
    E["WebSocket<br/>Socket.IO"]
    F["Scheduler<br/>setInterval"]
    G["PostgreSQL<br/>Sequelize"]
    H["Meilisearch<br/>Vector DB"]
    I["OpenAI API<br/>Embeddings"]

    A -->|"HTTPS / WSS"| B
    B --> C
    C --> D
    C --> E
    C --> F
    D --> G
    E --> H
    F --> I
```

## Stack technique

### Backend (Nomu-Back)

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Runtime | Node.js | ≥ 18 |
| Framework | Express | 5.1.0 |
| ORM | Sequelize | 6.37.1 |
| Base de données | PostgreSQL | 14+ |
| Recherche | Meilisearch | 0.32.2 |
| Auth | Passport.js + JWT | — |
| WebSocket | Socket.IO | 4.8.1 |
| Hash | bcrypt | 6.0.0 |
| Tests | Vitest | 4.x |

### Frontend Web (Nomu-Web)

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Framework | Nuxt | 4.1.3 |
| UI | Vue.js | 3.5.27 |
| State | Pinia | — |
| CSS | Tailwind CSS | 4.1.18 |
| UI Components | @nuxt/ui | 4.4.0 |
| WebSocket | socket.io-client | 4.8.3 |
| Animation | GSAP | 3.14.2 |

## Flux d'authentification

```mermaid
sequenceDiagram
    participant C as Client
    participant N as Nuxt Server
    participant E as Express API

    C->>N: POST /api/auth/login
    N->>E: POST /auth/login
    E->>E: Passport local + bcrypt.compare()
    E-->>N: { token, user }
    N-->>C: Set-Cookie: auth-token

    C->>N: GET /api/users/me
    Note over C,N: Cookie: auth-token
    N->>E: GET /users/me
    Note over N,E: Authorization: Bearer
    E->>E: JWT verify
    E-->>N: { user, profile }
    N-->>C: { user, profile }
```

## Flux de recherche

```mermaid
sequenceDiagram
    participant C as Client
    participant E as Express
    participant M as Meilisearch
    participant O as OpenAI

    C->>E: GET /users/search?q=X
    E->>E: authenticateOptional (enrichit si connecté)
    E->>M: hybrid search (semanticRatio: 0.7)
    M->>O: embed query
    O-->>M: vector
    M->>M: kNN + BM25
    M-->>E: { hits: [...] }
    E-->>C: { hits: [...] }
```
