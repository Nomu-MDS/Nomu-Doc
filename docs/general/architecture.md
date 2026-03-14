---
title: Architecture
sidebar_position: 1
---

# Architecture générale

## Cas d'utilisation

```mermaid
flowchart LR
    subgraph Acteurs
        V["🧍 Voyageur"]
        L["🏠 Local / Hôte"]
        A["🛡️ Administrateur"]
    end

    subgraph Systeme ["Plateforme Nomu"]
        direction TB
        UC1(["Gérer son compte & profil"])
        UC2(["Recherche sémantique (IA)"])
        UC3(["Réserver une expérience"])
        UC4(["Chat temps réel (WSS)"])
        UC5(["Gérer ses disponibilités"])
        UC6(["Modérer les signalements"])
        UC7(["Gestion des intérêts"])
    end

    V --- UC1 & UC2 & UC3 & UC4
    L --- UC1 & UC5 & UC3 & UC4
    A --- UC6 & UC7
```

## Vue d'ensemble

```mermaid
flowchart LR
    subgraph Clients ["Couche Présentation"]
        direction TB
        Mobile["📱 Nomu-Front\n(React Native)"]
        Web["🌐 Nomu-Web\n(Nuxt.js)"]
        Admin["🛠️ Nomu-Admin\n(Nuxt.js)"]
        Doc["📚 Nomu-Doc\n(Docusaurus)"]
    end

    Gateway["🛡️ Nginx Gateway"]

    subgraph Backend ["Cœur Applicatif"]
        API["⚙️ Nomu-Back\n(Express + Socket.io)"]
    end

    subgraph Data ["Stockage & Recherche"]
        direction TB
        PG[("🗄️ PostgreSQL\n(Sequelize)")]
        MinIO[("📦 MinIO\n(S3 Media Storage)")]
        Meili[("🔍 Meilisearch\n(Vecteurs & Index)")]
    end

    subgraph External ["Cloud Tiers"]
        direction TB
        OpenAI["🧠 OpenAI API\n(Embeddings)"]
    end

    Clients ==> Gateway ==> API
    API <==> PG & MinIO & Meili
    Meili -.-> OpenAI
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
