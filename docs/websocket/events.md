---
title: Événements
sidebar_position: 2
---

# Événements WebSocket

## Événements émis par le client

### `join_conversation`

Rejoindre une room de conversation pour recevoir les messages en temps réel.

```typescript
socket.emit('join_conversation', conversationId: number)
```

```javascript
// Côté serveur
socket.on('join_conversation', (conversationId) => {
  socket.join(`conversation:${conversationId}`)
})
```

---

### `leave_conversation`

Quitter une room.

```typescript
socket.emit('leave_conversation', conversationId: number)
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
  io.to(`conversation:${conversation_id}`).emit('new_message', {
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

Marquer un message comme lu.

```typescript
socket.emit('message_read', {
  message_id: number,
  conversation_id: number,
})
```

---

## Événements émis par le serveur

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
  user_id: number,
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
  read_by: number,  // user_id du lecteur
}
```

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
socket.emit('join_conversation', 5)

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
socket.on('user_typing', ({ user_id, isTyping }) => {
  typingUsers.value = isTyping
    ? [...typingUsers.value, user_id]
    : typingUsers.value.filter(id => id !== user_id)
})
```
