---
title: Utilisateurs & Profils
sidebar_position: 3
---

# Utilisateurs & Profils

## GET /users/me

**Auth requis**

Retourne le profil complet de l'utilisateur connecté avec ses intérêts.

### Request

```http
GET /users/me
Authorization: Bearer <token>
```

### Response

**200 OK**

```json
{
  "id": 42,
  "name": "Marie Dupont",
  "email": "marie@exemple.com",
  "bio": "Passionnée de randonnée",
  "location": "Paris, France",
  "role": "user",
  "is_active": true,
  "Profile": {
    "id": 18,
    "user_id": 42,
    "first_name": "Marie",
    "last_name": "Dupont",
    "age": 28,
    "biography": "Je propose des randonnées guidées autour de Paris.",
    "country": "France",
    "city": "Paris",
    "image_url": "https://...",
    "is_searchable": true,
    "Interests": [
      { "id": 3, "name": "Randonnée" },
      { "id": 7, "name": "Cuisine" }
    ]
  }
}
```

---

## PATCH /users/profile

**Auth requis**

Met à jour le profil de l'utilisateur connecté (champs User + Profile + Intérêts).

### Request

```http
PATCH /users/profile
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "name": "Marie D.",
  "bio": "Guide de randonnée à Paris",
  "location": "Île-de-France",
  "first_name": "Marie",
  "last_name": "Dupont",
  "age": 28,
  "biography": "Je propose des randonnées autour de Paris.",
  "country": "France",
  "city": "Paris",
  "image_url": "https://cdn.example.com/photo.jpg",
  "is_searchable": true,
  "interest_ids": [3, 7, 12]
}
```

| Champ | Modèle | Description |
|-------|--------|-------------|
| `name` | User | Nom affiché |
| `bio` | User | Bio courte |
| `location` | User | Localisation générale |
| `first_name` | Profile | Prénom |
| `last_name` | Profile | Nom |
| `age` | Profile | Âge |
| `biography` | Profile | Bio longue |
| `country` | Profile | Pays |
| `city` | Profile | Ville |
| `image_url` | Profile | URL photo de profil |
| `is_searchable` | Profile | Visibilité dans la recherche |
| `interest_ids` | Profile | Tableau d'IDs d'intérêts |

:::info Indexation automatique
Si `is_searchable` passe à `true`, le profil est automatiquement indexé dans Meilisearch.
Si `is_searchable` passe à `false`, le profil est retiré de l'index.
:::

### Response

**200 OK** — Retourne le User complet avec Profile et Interests mis à jour.

---

## PUT /users/profile/interests

**Auth requis**

Met à jour uniquement les intérêts du profil.

### Request

```http
PUT /users/profile/interests
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "interest_ids": [3, 7, 12, 15]
}
```

### Response

**200 OK**

```json
{
  "id": 18,
  "user_id": 42,
  "Interests": [
    { "id": 3, "name": "Randonnée" },
    { "id": 7, "name": "Cuisine" },
    { "id": 12, "name": "Photographie" },
    { "id": 15, "name": "Escalade" }
  ]
}
```

---

## PATCH /users/searchable

**Auth requis**

Active ou désactive la visibilité du profil dans les recherches.

### Request

```http
PATCH /users/searchable
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "is_searchable": true
}
```

### Response

**200 OK**

```json
{
  "is_searchable": true
}
```

---

## GET /users/search

**Auth optionnel** — enrichi si connecté

Recherche des profils publics. Si l'utilisateur est connecté, la recherche est enrichie sémantiquement avec son propre profil (intérêts, bio, localisation).

### Request

```http
GET /users/search?q=yoga&filterInterests=Yoga,Méditation&filterCity=Paris&filterCountry=France&limit=20
Authorization: Bearer <token>  (optionnel)
```

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `q` | string | Non | Requête textuelle |
| `filterInterests` | string | Non | Intérêts séparés par virgule |
| `filterCity` | string | Non | Villes séparées par virgule |
| `filterCountry` | string | Non | Pays séparés par virgule |
| `limit` | number | Non | Nombre de résultats (défaut: 20) |

### Response

**200 OK**

```json
{
  "hits": [
    {
      "id": 18,
      "user_id": 42,
      "name": "Marie Dupont",
      "biography": "Guide de randonnée à Paris.",
      "city": "Paris",
      "country": "France",
      "interests": ["Randonnée", "Cuisine"],
      "image_url": "https://...",
      "_rankingScore": 0.923
    }
  ],
  "query": "yoga",
  "estimatedTotalHits": 1,
  "limit": 20,
  "offset": 0
}
```

:::note Enrichissement sémantique
Connecté (semanticRatio: 0.7) : la requête est enrichie avec les intérêts, la bio et la localisation du chercheur.

Non connecté (semanticRatio: 0.5) : recherche hybride standard sans contexte personnel.

Le profil du chercheur est toujours exclu des résultats.
:::

---

## GET /users/:id

**Public**

Retourne le profil public d'un utilisateur par son ID de profil.

### Request

```http
GET /users/18
```

### Response

**200 OK** — Cache-Control: public, max-age=3600

```json
{
  "id": 42,
  "name": "Marie Dupont",
  "profile": {
    "id": 18,
    "first_name": "Marie",
    "last_name": "Dupont",
    "age": 28,
    "biography": "Je propose des randonnées guidées autour de Paris.",
    "country": "France",
    "city": "Paris",
    "image_url": "https://...",
    "interests": [
      { "id": 3, "name": "Randonnée" },
      { "id": 7, "name": "Cuisine" }
    ]
  }
}
```

**403 Forbidden** — Profil non searchable ou utilisateur inactif

```json
{
  "error": "Ce profil n'est pas accessible"
}
```

---

## POST /users

**Public**

Crée un utilisateur directement (admin / seeding). Voir [`POST /auth/signup`](/api/authentication) pour la voie normale.
