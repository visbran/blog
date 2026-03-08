# Overrides des composants Astro Pure

Ce dossier contient les composants qui remplacent ceux du thème original pour appliquer la traduction française.

## Principe

1. Copier le composant depuis `packages/pure/components/`
2. Le placer ici dans `src/components/overrides/`
3. Modifier uniquement les textes à traduire
4. Importer depuis `@/components/overrides/` au lieu de `packages/pure/`

## Avantages

- ✅ Ne modifie pas le thème original
- ✅ Survit aux mises à jour du thème
- ✅ Permet de personnaliser au besoin

## Mise à jour du thème

Lors d'une mise à jour du thème Astro Pure :
1. Vérifier si les composants overridés ont changé
2. Fusionner les changements si nécessaire
3. Retester les traductions

## Liste des composants overridés

### TOC.astro ✅
**Fichier** : `src/components/overrides/TOC.astro`
**Original** : `packages/pure/components/pages/TOC.astro`
**Modifications** :
- Ligne 19 : "TABLE OF CONTENTS" → `t('toc.title')` ("TABLE DES MATIÈRES")

**Utilisation** :
```astro
import TOC from '@/components/overrides/TOC.astro'
```

### Hero.astro ✅
**Fichier** : `src/components/overrides/Hero.astro`
**Original** : `packages/pure/components/pages/Hero.astro`
**Modifications** :
- Ligne 44 : "(Draft)" → `t('blog.draft')` ("Brouillon")
- Ligne 57 : "Update" → `t('blog.updatedOn')` ("Mis à jour le")

**Utilisation** :
```astro
import Hero from '@/components/overrides/Hero.astro'
```

### Paginator.astro ❌ (Pas nécessaire)
Le composant Paginator utilise déjà les textes fournis via props, donc les traductions sont gérées directement dans les pages qui l'utilisent.

### PageInfo.astro ✅ (Composant Waline)
**Fichier** : `src/components/waline/PageInfo.astro`
**Modifications** :
- Ligne 18 : "views" → `{t('links.views')}` ("vues")
- Ligne 24 : "comments" → `{t('links.comments')}` ("commentaires")

**Note** : Ce composant affiche les compteurs de vues et commentaires Waline.

### Copyright.astro ✅
**Fichier** : `src/components/overrides/Copyright.astro`
**Original** : `packages/pure/components/pages/Copyright.astro`
**Modifications** :
- Ligne 51 : "Author" → "Auteur"
- Ligne 57 : "Published at" → "Publié le"
- Ligne 121 : "Buy me a cup of coffee ☕." → "Offrez-moi un café ☕."
- Ligne 142 : "Link copied!" → "Lien copié !"

**Utilisation** :
```astro
import Copyright from '@/components/overrides/Copyright.astro'
```

**Note** : Ce composant affiche les informations de copyright en bas des articles de blog.
