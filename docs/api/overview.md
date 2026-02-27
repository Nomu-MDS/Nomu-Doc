---
title: Vue d'ensemble
sidebar_position: 1
---

# API Reference

## URL de base

| Environnement | URL |
|---------------|-----|
| Développement | `http://localhost:3001` |
| Production | `https://api.nomu.charlesremy.dev` |
| Via Nuxt proxy | `/api` (redirige automatiquement) |

## Authentification

L'API supporte deux méthodes d'authentification :

### 1. JWT Bearer Token (recommandé pour mobile et SPA)

```http
Authorization: Bearer <token>
```

Le token est retourné lors du login ou du signup. Il doit être inclus dans le header `Authorization` de chaque requête protégée.

### 2. Session Passport (web)

Cookie de session géré automatiquement par le navigateur après login.

### Niveaux d'accès

| Niveau | Description |
|--------|-------------|
| Public | Aucune authentification requise |
| Optionnel | Fonctionne sans auth, enrichi si connecté |
| Auth requis | Token ou session obligatoire (401 sinon) |
| Admin | Rôle `admin` requis (403 sinon) |

## Format des réponses

Toutes les réponses sont en JSON.

### Succès

```json
// 200 OK ou 201 Created
{
  "id": 1,
  "name": "Jean Dupont",
  ...
}
```

### Erreurs

```json
// 4xx / 5xx
{
  "error": "Description de l'erreur",
  "field": "email"  // optionnel, pour les erreurs de validation
}
```

## Codes d'erreur standard

| Code | Signification |
|------|---------------|
| `400` | Requête invalide (champs manquants ou malformés) |
| `401` | Non authentifié |
| `403` | Accès refusé (mauvais rôle ou ressource d'autrui) |
| `404` | Ressource introuvable |
| `409` | Conflit (email déjà utilisé, conversation déjà existante…) |
| `500` | Erreur serveur interne |

## En-têtes communs

```http
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

## Health check

```http
GET /health
```

```json
// 200 OK — pas d'auth, répond le plus tôt possible
200
```

Utilisé par Docker pour vérifier que le conteneur est prêt.
