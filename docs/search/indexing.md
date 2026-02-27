---
title: Indexation
sidebar_position: 2
---

# Indexation des profils

## Structure d'un document indexé

```typescript
interface MeilisearchProfileDocument {
  id: number          // profile.id (primary key)
  user_id: number     // user.id
  name: string        // user.name
  location: string    // user.location || profile.city
  bio: string         // user.bio
  biography: string   // profile.biography
  country: string     // profile.country
  city: string        // profile.city
  interests: string[] // ["Randonnée", "Cuisine", ...]
}
```

## Conditions d'indexation

Seuls les profils avec **`is_searchable = true`** ET un **utilisateur actif** sont indexés.

```javascript
// app/services/meilisearch/reindexService.js
const profiles = await Profile.findAll({
  where: { is_searchable: true },
  include: [{
    model: User,
    where: { is_active: true },
    attributes: ['id', 'name', 'bio', 'location'],
  }, Interest],
})
```

## Réindexation complète

```javascript
export const reindexAllProfiles = async () => {
  // 1. Vider complètement l'index
  await clearIndex()

  // 2. Récupérer tous les profils searchable + actifs
  const profiles = await Profile.findAll({ ... })

  // 3. Formater les documents
  const documents = profiles.map(profile => ({
    id: profile.id,
    user_id: profile.user_id,
    name: profile.User?.name || '',
    location: profile.User?.location || profile.city || '',
    bio: profile.User?.bio || '',
    biography: profile.biography || '',
    country: profile.country || '',
    city: profile.city || '',
    interests: profile.Interests?.map(i => i.name) || [],
  }))

  // 4. Indexer en lot
  await index.addDocuments(documents, { primaryKey: 'id' })
}
```

## Indexation à la demande

### Toggle searchable

```javascript
// Activation → indexation immédiate
if (is_searchable) {
  await indexProfiles([{
    id: profile.id,
    user_id: profile.user_id,
    name: profile.User?.name || '',
    ...
  }])
} else {
  // Désactivation → suppression de l'index
  await removeProfileFromIndex(profile.id)
}
```

### Mise à jour du profil

```javascript
// Si le profil est searchable, on réindexe après chaque mise à jour
if (profile.is_searchable) {
  const updated = await Profile.findByPk(profile.id, {
    include: [User, Interest],
  })
  await indexProfiles([formatDocument(updated)])
}
```

## API Meilisearch directe

```javascript
// app/services/meilisearch/meiliProfileService.js

// Ajouter / mettre à jour des documents
export const indexProfiles = async (data) => {
  return await index.addDocuments(data, { primaryKey: 'id' })
}

// Supprimer un profil de l'index
export const removeProfileFromIndex = async (profileId) => {
  return await index.deleteDocument(profileId)
}

// Vider l'index
export const clearIndex = async () => {
  return await index.deleteAllDocuments()
}
```
