---
title: Réservations
sidebar_position: 6
---

# Réservations

Les réservations sont liées à une conversation et permettent de formaliser une activité entre deux membres.

## POST /reservations

**Auth requis**

Crée une réservation dans une conversation.

### Validations

- `date` et `end_date` doivent être dans le futur
- `end_date` doit être postérieure à `date`
- `price` doit être > 0
- L'utilisateur doit être participant de la conversation

### Request

```http
POST /reservations
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "title": "Randonnée Fontainebleau",
  "conversation_id": 5,
  "price": 45.00,
  "date": "2025-04-10T09:00:00.000Z",
  "end_date": "2025-04-10T17:00:00.000Z"
}
```

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `title` | string | Oui | Titre de l'activité |
| `conversation_id` | number | Oui | ID de la conversation |
| `price` | number | Oui | Tarif (décimal, ex: 45.00) |
| `date` | ISO 8601 | Oui | Date de début |
| `end_date` | ISO 8601 | Oui | Date de fin |

### Response

**201 Created**

```json
{
  "id": 3,
  "title": "Randonnée Fontainebleau",
  "conversation_id": 5,
  "creator_id": 42,
  "price": "45.00",
  "date": "2025-04-10T09:00:00.000Z",
  "end_date": "2025-04-10T17:00:00.000Z",
  "status": "pending"
}
```

---

## GET /reservations/me

**Auth requis**

Retourne toutes les réservations dans les conversations de l'utilisateur.

### Request

```http
GET /reservations/me
Authorization: Bearer <token>
```

### Response

**200 OK**

```json
[
  {
    "id": 3,
    "title": "Randonnée Fontainebleau",
    "price": "45.00",
    "date": "2025-04-10T09:00:00.000Z",
    "end_date": "2025-04-10T17:00:00.000Z",
    "status": "accepted",
    "creator_id": 42,
    "conversation_id": 5
  }
]
```

---

## PATCH /reservations/:id/accept

**Auth requis**

Accepte une réservation. Seul le destinataire (non-créateur) de la conversation peut accepter.

### Request

```http
PATCH /reservations/3/accept
Authorization: Bearer <token>
```

### Response

**200 OK**

```json
{
  "id": 3,
  "status": "accepted"
}
```

**403 Forbidden** — Tentative d'accepter sa propre réservation

---

## PATCH /reservations/:id/decline

**Auth requis**

Refuse une réservation.

### Request

```http
PATCH /reservations/3/decline
Authorization: Bearer <token>
```

### Response

**200 OK**

```json
{
  "id": 3,
  "status": "declined"
}
```
