---
title: Événements
sidebar_position: 2
---

# Événements WebSocket

:::info Format des rooms
Les rooms de conversation utilisent le format `conversation_{id}` (underscore, pas deux-points).
Exemple : `conversation_5`
:::

## Événements émis par le client

### `join_conversation`

Rejoindre une room de conversation pour recevoir les messages en temps réel.

```typescript
socket.emit('join_conversation', { conversation_id: number })
```

```javascript
// Côté serveur
socket.on('join_conversation', ({ conversation_id }) => {
  socket.join(`conversation_${conversation_id}`)
  socket.emit('joined_conversation', { conversation_id })
})
```

---

### `leave_conversation`

Quitter une room.

```typescript
socket.emit('leave_conversation', { conversation_id: number })
```

---

### `send_message`

Envoyer un message dans une conversation.

```typescript
socket.emit('send_message', {
  conversation_id: number,
  content: string,            // max 2000 caractères
  attachment?: string,        // base64 data URL (image uniquement, max 10 Mo)
})
```

**Validations côté serveur :**
- `content` : 1 à 2000 caractères (obligatoire)
- `attachment` : doit commencer par `data:image/` (PNG, JPG, GIF, WebP)
- Taille attachment : max 10 Mo
- L'expéditeur doit être participant de la conversation

```javascript
// Côté serveur (résumé)
socket.on('send_message', async ({ conversation_id, content, attachment }) => {
  // Vérification de la participation
  const conversation = await Conversation.findByPk(conversation_id)
  const isParticipant =
    conversation.voyager_id === socket.userId ||
    conversation.local_id === socket.userId

  if (!isParticipant) return socket.emit('error', 'Non autorisé')

  // Validation du contenu
  if (!content || content.length > 2000) return socket.emit('error', 'Message invalide')

  // Sauvegarde en DB
  const message = await Message.create({
    user_id: socket.userId,
    conversation_id,
    content,
    attachment: attachment || null,
  })

  // Broadcast à la room
  io.to(`conversation_${conversation_id}`).emit('new_message', {
    ...message.toJSON(),
    Sender: { id: socket.userId, name: socket.dbUser.name },
  })
})
```

---

### `typing`

Indicateur de saisie en cours.

```typescript
socket.emit('typing', {
  conversation_id: number,
  isTyping: boolean,
})
```

---

### `message_read`

Marquer un message comme lu. Seul `message_id` est requis — le serveur retrouve la conversation via le message.

```typescript
socket.emit('message_read', {
  message_id: number,
})
```

---

## Événements émis par le serveur

### `joined_conversation`

Confirmation que le client a bien rejoint la room.

```typescript
// Payload
{
  conversation_id: number
}
```

Émis uniquement à l'émetteur (`socket.emit()`).

---

### `new_message`

Nouveau message reçu dans une conversation.

```typescript
// Payload
{
  id: number,
  user_id: number,
  conversation_id: number,
  content: string,
  attachment: string | null,
  read: false,
  createdAt: string,
  Sender: { id: number, name: string }
}
```

Émis à tous les membres de la room (`io.to(room).emit()`).

---

### `user_typing`

Un utilisateur est en train d'écrire.

```typescript
// Payload
{
  userId: number,
  userName: string,
  conversation_id: number,
  isTyping: boolean,
}
```

Émis à tous les membres de la room **sauf l'expéditeur** (`socket.to(room).emit()`).

---

### `message_read_update`

Confirmation de lecture d'un message.

```typescript
// Payload
{
  message_id: number,
  conversation_id: number,
  read: boolean,   // toujours true
}
```

Émis à tous les membres de la room (`io.to(room).emit()`).

---

### `reservation_created`

Une nouvelle réservation a été créée dans la conversation.

```typescript
// Payload
{
  reservation: {
    id: number,
    title: string,
    price: string,         // DECIMAL retourné en string par Sequelize → parseFloat()
    date: string,
    end_date: string,
    status: 'pending',
    creator_id: number,
    conversation_id: number,
    createdAt: string,
  }
}
```

Émis à tous les membres de la room.

---

### `reservation_updated`

Le statut d'une réservation a changé (acceptée ou refusée).

```typescript
// Payload
{
  reservation: {
    id: number,
    status: 'accepted' | 'declined',
    // ... autres champs de la réservation
  }
}
```

Émis à tous les membres de la room.

---

### `error`

Erreur lors du traitement d'un événement.

```typescript
// Payload
{
  message: string
}
```

## Exemple complet (client)

```typescript
// app/composables/useSocket.ts
const socket = connect()

// Rejoindre une conversation
socket.emit('join_conversation', { conversation_id: 5 })

// Écouter la confirmation
socket.on('joined_conversation', ({ conversation_id }) => {
  console.log(`Rejoint la room conversation_${conversation_id}`)
})

// Envoyer un message
socket.emit('send_message', {
  conversation_id: 5,
  content: 'Salut ! Disponible samedi ?',
})

// Écouter les nouveaux messages
socket.on('new_message', (message) => {
  messages.value.push(message)
})

// Écouter les indicateurs de frappe
socket.on('user_typing', ({ userId, userName, isTyping }) => {
  if (isTyping) typingUserName.value = userName
  isOtherTyping.value = isTyping
})

// Écouter les mises à jour de lecture
socket.on('message_read_update', ({ message_id, read }) => {
  const msg = messages.value.find(m => m.id === message_id)
  if (msg) msg.read = read
})

// Écouter les réservations en temps réel
socket.on('reservation_created', ({ reservation }) => {
  reservations.value.push(reservation)
})

socket.on('reservation_updated', ({ reservation }) => {
  const idx = reservations.value.findIndex(r => r.id === reservation.id)
  if (idx !== -1) Object.assign(reservations.value[idx], reservation)
})
```
