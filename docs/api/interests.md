---
title: Centres d'intérêt
sidebar_position: 4
---

# Centres d'intérêt

## GET /interests

**Public**

Retourne tous les centres d'intérêt actifs. Utilisé pour alimenter les filtres de l'explorateur et les formulaires de profil.

### Request

```http
GET /interests
```

### Response

**200 OK**

```json
[
  { "id": 1, "name": "Yoga", "icon": "🧘", "is_active": true },
  { "id": 2, "name": "Randonnée", "icon": "🥾", "is_active": true },
  { "id": 3, "name": "Cuisine", "icon": "🍳", "is_active": true }
]
```

---

## GET /interests/admin

**Admin**

Retourne tous les intérêts, y compris les inactifs.

---

## POST /interests/admin

**Admin**

Crée un nouveau centre d'intérêt.

### Request

```http
POST /interests/admin
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "name": "Surf",
  "icon": "🏄",
  "is_active": true
}
```

### Response

**201 Created**

```json
{
  "id": 25,
  "name": "Surf",
  "icon": "🏄",
  "is_active": true
}
```

**409 Conflict** — Nom déjà existant

---

## PUT /interests/admin/:id

**Admin**

Met à jour un intérêt existant.

---

## DELETE /interests/admin/:id

**Admin**

Supprime un intérêt. Les associations `profile_interests` sont supprimées en cascade.
