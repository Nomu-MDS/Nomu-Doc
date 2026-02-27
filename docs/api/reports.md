---
title: Signalements
sidebar_position: 8
---

# Signalements (Reports)

## POST /reports

**Auth requis**

Signale un utilisateur pour comportement inapproprié.

### Validations

- Impossible de se signaler soi-même
- Un seul signalement `pending` par cible autorisé

### Request

```http
POST /reports
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "reported_user_id": 17,
  "reason": "Comportement inapproprié",
  "message": "Cet utilisateur m'a envoyé des messages harcelants."
}
```

### Response

**201 Created**

```json
{
  "id": 12,
  "reporter_id": 42,
  "reported_user_id": 17,
  "reason": "Comportement inapproprié",
  "message": "Cet utilisateur m'a envoyé des messages harcelants.",
  "status": "pending"
}
```

---

## GET /reports/me

**Auth requis**

Retourne les signalements créés par l'utilisateur connecté.

---

## DELETE /reports/:reportId

**Auth requis**

Supprime un signalement en attente (status: `pending` uniquement).

---

## GET /admin/reports

**Admin**

Liste paginée de tous les signalements avec filtres.

### Request

```http
GET /admin/reports?status=pending&limit=20&offset=0
Authorization: Bearer <admin_token>
```

| Paramètre | Description |
|-----------|-------------|
| `status` | Filtrer par statut (`pending`, `reviewed`, `resolved`, `dismissed`) |
| `limit` | Résultats par page (défaut: 20) |
| `offset` | Pagination |

### Response

```json
{
  "reports": [
    {
      "id": 12,
      "reporter_id": 42,
      "reported_user_id": 17,
      "reason": "Comportement inapproprié",
      "status": "pending",
      "createdAt": "2025-03-20T10:00:00.000Z",
      "Reporter": { "id": 42, "name": "Marie Dupont" },
      "ReportedUser": { "id": 17, "name": "Jean Martin" }
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

---

## GET /admin/reports/stats

**Admin**

Statistiques des signalements.

### Response

```json
{
  "total": 45,
  "by_status": {
    "pending": 12,
    "reviewed": 8,
    "resolved": 20,
    "dismissed": 5
  },
  "top_reported": [
    { "user_id": 17, "name": "Jean Martin", "count": 5 }
  ]
}
```

---

## PATCH /admin/reports/:reportId

**Admin**

Met à jour le statut d'un signalement.

### Request

```json
{
  "status": "resolved",
  "admin_notes": "Utilisateur averti par email. Récidive → bannissement."
}
```

### Response

```json
{
  "id": 12,
  "status": "resolved",
  "admin_notes": "Utilisateur averti par email. Récidive → bannissement.",
  "reviewed_by": 1,
  "reviewed_at": "2025-03-21T09:00:00.000Z"
}
```
