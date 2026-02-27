---
title: Conversations
sidebar_position: 5
---

# Conversations & Messages

## GET /conversations

**Auth requis**

Retourne toutes les conversations de l'utilisateur connecté avec le dernier message de chacune.

### Request

```http
GET /conversations
Authorization: Bearer <token>
```

### Response

**200 OK**

```json
[
  {
    "id": 5,
    "voyager_id": 42,
    "local_id": 17,
    "Voyager": { "id": 42, "name": "Marie Dupont", "email": "marie@..." },
    "Local": { "id": 17, "name": "Jean Martin", "email": "jean@..." },
    "Messages": [
      {
        "id": 88,
        "content": "Salut ! Je suis intéressé par ta rando.",
        "user_id": 42,
        "read": false,
        "createdAt": "2025-03-15T14:32:00.000Z"
      }
    ],
    "createdAt": "2025-03-15T14:30:00.000Z"
  }
]
```

---

## POST /conversations

**Auth requis**

Crée une nouvelle conversation entre deux utilisateurs. Une seule conversation par paire est autorisée.

### Request

```http
POST /conversations
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "other_user_id": 17
}
```

### Response

**201 Created**

```json
{
  "id": 5,
  "voyager_id": 42,
  "local_id": 17
}
```

**409 Conflict** — Conversation déjà existante

```json
{
  "error": "Une conversation existe déjà entre ces deux utilisateurs",
  "conversation_id": 5
}
```

**400 Bad Request** — Tentative de self-conversation

---

## GET /conversations/:id

**Auth requis**

Retourne les détails d'une conversation (participants + réservations).

### Request

```http
GET /conversations/5
Authorization: Bearer <token>
```

### Response

**200 OK**

```json
{
  "id": 5,
  "Voyager": { "id": 42, "name": "Marie Dupont" },
  "Local": { "id": 17, "name": "Jean Martin" },
  "Reservations": [
    {
      "id": 3,
      "title": "Randonnée Fontainebleau",
      "price": 45.00,
      "date": "2025-04-10T09:00:00.000Z",
      "status": "accepted"
    }
  ]
}
```

---

## GET /conversations/:id/messages

**Auth requis**

Retourne les messages d'une conversation avec pagination.

### Request

```http
GET /conversations/5/messages?limit=50&offset=0
Authorization: Bearer <token>
```

| Paramètre | Défaut | Description |
|-----------|--------|-------------|
| `limit` | 50 | Nombre de messages |
| `offset` | 0 | Décalage pour la pagination |

### Response

**200 OK**

```json
[
  {
    "id": 88,
    "user_id": 42,
    "conversation_id": 5,
    "content": "Salut ! Je suis intéressé par ta rando.",
    "attachment": null,
    "read": true,
    "createdAt": "2025-03-15T14:32:00.000Z",
    "Sender": { "id": 42, "name": "Marie Dupont" }
  }
]
```

---

## PATCH /conversations/:id/messages/:messageId/read

**Auth requis**

Marque un message comme lu.

### Request

```http
PATCH /conversations/5/messages/88/read
Authorization: Bearer <token>
```

### Response

**200 OK**

```json
{
  "success": true
}
```
