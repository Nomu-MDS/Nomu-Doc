---
slug: /
title: Introduction
sidebar_position: 1
---

# Documentation Nomu

Bienvenue dans la documentation technique de la plateforme **Nomu** — une application qui connecte voyageurs et locaux passionnés autour d'expériences et d'activités authentiques.

## Architecture globale

Nomu est composé de trois projets distincts :

| Projet | Stack | Description |
|--------|-------|-------------|
| **Nomu-Back** | Node.js / Express 5 / Sequelize / PostgreSQL | API REST + WebSocket |
| **Nomu-Web** | Nuxt 4 / Vue 3 / Pinia / Tailwind | Application web |
| **Nomu-Mobile** | React Native / Expo | Application mobile |

## Sections de la documentation

- **[Architecture générale](/general/architecture)** — Vue d'ensemble du système, base de données, modèles
- **[API Reference](/api/overview)** — Tous les endpoints REST avec headers, body et réponses
- **[Recherche Sémantique](/search/overview)** — Meilisearch + OpenAI embeddings
- **[WebSocket](/websocket/overview)** — Messagerie temps réel avec Socket.IO
- **[CI/CD & Déploiement](/cicd/overview)** — GitHub Actions, Docker, VPS
