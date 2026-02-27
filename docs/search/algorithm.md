---
title: Algorithme de recherche
sidebar_position: 3
---

# Algorithme de recherche

## Recherche hybride

Meilisearch combine deux modes de recherche :

| Mode | Description | Poids |
|------|-------------|-------|
| **Sémantique** | Similarité vectorielle (OpenAI embeddings) | `semanticRatio` |
| **Keyword** | BM25 sur les champs texte | `1 - semanticRatio` |

## Deux stratégies selon l'authentification

### Utilisateur connecté — Recherche enrichie (semanticRatio: 0.7)

```javascript
export const searchProfilesEnriched = async (searcherProfile, query, options = {}) => {
  // Construire une requête enrichie avec le contexte du chercheur
  const enrichedQuery = buildEnrichedQuery(searcherProfile, query)

  return await index.search(enrichedQuery, {
    hybrid: {
      embedder: 'profiles-openai',
      semanticRatio: 0.7,   // 70% sémantique, 30% keyword
    },
    limit: options.limit || 20,
    filter: buildFilter(options),
  })
}
```

### Utilisateur anonyme — Recherche simple (semanticRatio: 0.5)

```javascript
export const searchProfiles = async (query, options = {}) => {
  return await index.search(query, {
    hybrid: {
      embedder: 'profiles-openai',
      semanticRatio: 0.5,   // 50/50 sémantique / keyword
    },
    limit: options.limit || 20,
    filter: buildFilter(options),
  })
}
```

## Construction de la requête enrichie

```javascript
const buildEnrichedQuery = (searcherProfile, userQuery) => {
  const parts = []

  // 1. La requête de l'utilisateur en priorité
  if (userQuery) parts.push(userQuery)

  // 2. Les intérêts du chercheur
  if (searcherProfile?.interests?.length) {
    parts.push(`intérêts: ${searcherProfile.interests.join(', ')}`)
  }

  // 3. La bio du chercheur (100 premiers caractères)
  if (searcherProfile?.bio) {
    parts.push(`compatible avec: ${searcherProfile.bio.slice(0, 100)}`)
  }

  // 4. La localisation
  if (searcherProfile?.location) {
    parts.push(`proche de ${searcherProfile.location}`)
  }

  return parts.join(' | ')
}
```

**Exemple de requête enrichie :**
```
yoga | intérêts: Randonnée, Cuisine | compatible avec: Guide de randonnée | proche de Paris
```

## Filtres

```javascript
function buildFilter(options) {
  const parts = []

  // Filtre intérêts (OR entre les valeurs)
  if (options.filterInterests?.length) {
    const f = options.filterInterests.map(i => `interests = "${i}"`).join(' OR ')
    parts.push(`(${f})`)
  }

  // Filtre ville (OR)
  if (options.filterCity?.length) {
    const f = options.filterCity.map(c => `city = "${c}"`).join(' OR ')
    parts.push(`(${f})`)
  }

  // Filtre pays (OR)
  if (options.filterCountry?.length) {
    const f = options.filterCountry.map(c => `country = "${c}"`).join(' OR ')
    parts.push(`(${f})`)
  }

  // Combinés en AND entre les catégories
  return parts.length ? parts.join(' AND ') : undefined
}
```

**Exemple de filtre :**
```
(interests = "Yoga" OR interests = "Méditation") AND (city = "Paris") AND (country = "France")
```

## Exclusion du chercheur

Le profil du chercheur est systématiquement exclu des résultats côté serveur :

```javascript
result.hits = result.hits.filter(hit => hit.id !== searcherProfileId)
```
