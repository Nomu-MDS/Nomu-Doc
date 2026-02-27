---
title: Tokens & Wallet
sidebar_position: 7
---

# Tokens & Wallet

Nomu dispose d'une économie de tokens. Chaque utilisateur possède un wallet dont chaque mouvement est tracé dans `token_transactions`.

## Types de transactions

| Type | Description |
|------|-------------|
| `SIGNUP_BONUS` | Bonus d'inscription |
| `MESSAGE_SENT` | Envoi de message |
| `ADMIN_ADJUSTMENT` | Ajustement manuel admin |
| `PURCHASE` | Achat |
| `REFUND` | Remboursement |
| `ACTIVITY_PAYMENT` | Paiement d'une activité |
| `ACTIVITY_RECEIPT` | Réception du paiement d'une activité |
| `PENALTY` | Pénalité |
| `BONUS` | Bonus |
| `WITHDRAWAL` | Retrait |
| `DEPOSIT` | Dépôt |

---

## GET /tokens/balance

**Auth requis**

Retourne le solde de tokens de l'utilisateur.

### Response

```json
{
  "balance": 150
}
```

---

## GET /tokens/wallet

**Auth requis**

Retourne les détails complets du wallet.

### Response

```json
{
  "id": 8,
  "user_id": 42,
  "balance": 150,
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-03-20T14:00:00.000Z"
}
```

---

## GET /tokens/history

**Auth requis**

Retourne l'historique paginé des transactions.

### Request

```http
GET /tokens/history?limit=20&offset=0&type=ACTIVITY_PAYMENT
Authorization: Bearer <token>
```

| Paramètre | Défaut | Description |
|-----------|--------|-------------|
| `limit` | 20 | Nombre de transactions |
| `offset` | 0 | Décalage |
| `type` | — | Filtrer par type |

### Response

```json
[
  {
    "id": 55,
    "user_id": 42,
    "amount": -45,
    "type": "ACTIVITY_PAYMENT",
    "reason": "Randonnée Fontainebleau",
    "balance_before": 195,
    "balance_after": 150,
    "createdAt": "2025-03-20T14:00:00.000Z"
  }
]
```

---

## POST /tokens/credit

**Auth requis** (Admin/System)

Crédite des tokens sur le wallet d'un utilisateur.

### Request

```json
{
  "user_id": 42,
  "amount": 50,
  "type": "BONUS",
  "reason": "Bonus parrainage"
}
```

---

## POST /tokens/admin/adjustment

**Admin**

Ajustement manuel de tokens avec raison obligatoire.

```json
{
  "user_id": 42,
  "amount": -10,
  "reason": "Remboursement partiel activité annulée"
}
```
