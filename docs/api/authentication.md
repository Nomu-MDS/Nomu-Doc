---
title: Authentification
sidebar_position: 2
---

# Authentification

## POST /auth/signup

**Public**

Crée un nouveau compte utilisateur, un profil associé et un wallet. Retourne un token JWT et connecte automatiquement l'utilisateur via session.

### Request

```http
POST /auth/signup
Content-Type: application/json
```

```json
{
  "first_name": "Marie",
  "last_name": "Dupont",
  "email": "marie@exemple.com",
  "password": "motdepasse123",
  "is_searchable": true,
  "bio": "Passionnée de randonnée et de cuisine locale",
  "location": "Paris, France"
}
```

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `first_name` | string | Oui | Prénom |
| `last_name` | string | Oui | Nom |
| `email` | string | Oui | Email unique |
| `password` | string | Oui | Mot de passe (haché avec bcrypt) |
| `is_searchable` | boolean | Non | Visible dans la recherche (défaut: `false`) |
| `bio` | string | Non | Biographie courte |
| `location` | string | Non | Localisation (ex: "Paris, France") |

### Response

**201 Created**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 42,
    "name": "Marie Dupont",
    "email": "marie@exemple.com",
    "bio": "Passionnée de randonnée et de cuisine locale",
    "location": "Paris, France",
    "role": "user",
    "is_active": true
  }
}
```

**409 Conflict** — Email déjà utilisé

```json
{
  "error": "Email déjà utilisé",
  "field": "email"
}
```

:::info
Le rôle est forcé à `"user"` à la création — il ne peut pas être défini via l'API publique.
:::

---

## POST /auth/login

**Public**

Authentifie un utilisateur existant via Passport local strategy. Retourne un token JWT.

### Request

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "marie@exemple.com",
  "password": "motdepasse123"
}
```

| Champ | Type | Requis |
|-------|------|--------|
| `email` | string | Oui |
| `password` | string | Oui |

### Response

**200 OK**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 42,
    "name": "Marie Dupont",
    "email": "marie@exemple.com",
    "role": "user",
    "is_active": true
  }
}
```

**401 Unauthorized** — Identifiants incorrects

```json
{
  "error": "Email ou mot de passe incorrect"
}
```

## Utilisation du token

Le token JWT doit être stocké côté client (cookie httpOnly ou localStorage) et inclus dans chaque requête protégée :

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Côté Nuxt-Web (Pinia store)

```typescript
// stores/auth.ts
const tokenCookie = useCookie<string | null>('auth-token', {
  maxAge: 60 * 60 * 24 * 30,   // 30 jours
  sameSite: 'lax',
  path: '/',
})

async function login(credentials: LoginCredentials): Promise<AuthResult> {
  const data = await $fetch('/api/auth/login', {
    method: 'POST',
    body: credentials,
  })
  const token = data?.token || data?.access_token || data?.accessToken
  if (token) {
    tokenCookie.value = token
    return { success: true, token }
  }
  return { success: false, error: 'Token non reçu' }
}
```
