---
title: Vue d'ensemble
sidebar_position: 1
---

# WebSocket — Messagerie temps réel

## Architecture

Nomu utilise **Socket.IO 4.x** pour la messagerie instantanée entre membres.

```mermaid
sequenceDiagram
    autonumber
    actor V as Voyageur (Expéditeur)
    participant WSS as Serveur WebSocket (Socket.io)
    participant DB as PostgreSQL
    participant FCM as Firebase (FCM)
    actor L as Local (Destinataire)

    V->>WSS: connect (auth token)
    WSS->>WSS: socketAuthMiddleware — vérif JWT / session
    WSS-->>V: connected

    V->>WSS: join_conversation(5)
    WSS->>WSS: socket.join('conversation:5')

    V->>WSS: send_message({ convId, content })
    WSS->>DB: INSERT INTO messages
    DB-->>WSS: Confirmation & ID du message
    WSS-->>V: new_message(message)

    alt Destinataire en ligne
        WSS->>L: new_message(message)
    else Destinataire hors-ligne
        WSS->>FCM: Envoi d'un payload Push
        FCM-->>L: Notification mobile reçue
    end

    V->>WSS: typing({ isTyping: true })
    WSS-->>L: user_typing({...})
```

## Connexion et authentification

```typescript
// app/services/websocket/socketAuth.js
export const socketAuthMiddleware = async (socket, next) => {
  // 1. Session Passport
  const passportUser = socket.request.session?.passport?.user
  if (passportUser) {
    const user = await User.findByPk(passportUser)
    socket.dbUser = user
    socket.userId = user.id
    socket.userEmail = user.email
    return next()
  }

  // 2. JWT dans handshake.auth.token
  const token = socket.handshake.auth?.token
  if (token) {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findByPk(payload.id || payload.userId)
    socket.dbUser = user
    socket.userId = user.id
    return next()
  }

  return next(new Error('Non authentifié'))
}
```

### Connexion côté client (Nuxt)

```typescript
// app/composables/useSocket.ts
function connect(): Socket {
  const token = getToken()
  socket = io(socketUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  })
  return socket
}
```

## Rooms

Chaque conversation a sa propre room Socket.IO :

Room ID : `conversation:{conversation_id}` — exemple : `conversation:5`

Les messages sont broadcast à tous les membres de la room, session incluse pour la lecture cross-device.
