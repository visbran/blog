## 📋 Contexte
Je viens de cloner le thème Astro Pure et je veux le traduire entièrement en français. Le site doit rester en français uniquement (pas de système multilingue). La traduction doit être faite de manière à ne pas être impactée par les futures mises à jour du thème.
Voici la doc du theme principal utilisé : https://astro-pure.js.org/docs
Tu peux utiliser context7 si besoin afin d'avoir une documentation à jour.
Tu as un serveur mcp pour la documentation d'astro

# 🎯 Objectifs
1. Traduire toute l'interface en français (navigation, boutons, labels, messages)
2. Ne PAS toucher aux fichiers dans `packages/pure/` (pour garder la compatibilité)
3. Utiliser uniquement les fichiers dans `src/` pour les traductions
4. Conserver toutes les fonctionnalités SEO
5. Bien documenter pour la maintenance future

## 🚫 Contraintes importantes
- **NE JAMAIS modifier de fichiers dans `packages/pure/`** (sera écrasé lors des mises à jour)
- Tout doit être fait via `src/site.config.ts` et les fichiers dans `src/`
- Le contenu des articles reste en français (pas de traduction nécessaire)
- Garder la structure du projet intacte

## 📁 Architecture à mettre en place

```
src/
├── i18n/
│   ├── fr.ts              [CRÉER] Toutes les traductions françaises
│   ├── utils.ts           [CRÉER] Fonctions helpers
│   └── index.ts           [CRÉER] Point d'entrée
├── site.config.ts         [MODIFIER] Config principale en français
└── [autres fichiers existants non modifiés]
```

## 🔧 Tâches à effectuer

### ÉTAPE 1 : Créer le système de traduction

#### Fichier : `src/i18n/fr.ts`

Crée un fichier avec TOUTES les traductions françaises regroupées par section.

```typescript
/**
 * Traductions françaises pour Astro Pure
 * Ce fichier centralise toutes les chaînes de caractères en français
 * 
 * @note Ce fichier ne sera jamais impacté par les mises à jour du thème
 */

export const fr = {
  // Navigation
  nav: {
    back: \"Retour\",
    home: \"Accueil\",
    blog: \"Blog\",
    projects: \"Projets\",
    links: \"Liens\",
    about: \"À Propos\",
    search: \"Recherche\",
    archives: \"Archives\",
    tags: \"Tags\"
  },

  // Blog
  blog: {
    title: \"Blog\",
    description: \"Articles et archives de mon blog\",
    noPosts: \"Aucun article pour le moment.\",
    page: \"Page\",
    showing: \"Affichage de\",
    of: \"sur\",
    posts: \"articles\",
    viewAllByYears: \"Voir tous les articles par année\",
    viewAll: \"Voir tout\",
    previousPosts: \"Articles précédents\",
    nextPosts: \"Articles suivants\",
    readMore: \"Lire la suite\",
    readingTime: \"min de lecture\",
    publishedOn: \"Publié le\",
    updatedOn: \"Mis à jour le\",
    draft: \"Brouillon\",
    featured: \"À la une\"
  },

  // Tags
  tags: {
    title: \"Tags\",
    description: \"Tous les tags utilisés dans les articles\",
    allTags: \"Tous les tags\",
    postsTagged: \"Articles avec le tag\"
  },

  // Archives
  archives: {
    title: \"Archives\",
    description: \"Tous les articles par année\",
    year: \"Année\",
    allYears: \"Toutes les années\"
  },

  // Projects
  projects: {
    title: \"Projets\",
    description: \"Mes projets et réalisations\",
    viewProject: \"Voir le projet\",
    sourceCode: \"Code source\",
    liveDemo: \"Démo en ligne\"
  },

  // Links
  links: {
    title: \"Liens\",
    description: \"Liens utiles et amis\",
    views: \"vues\",
    comments: \"commentaires\",
    commonLinks: \"Liens communs\",
    specialLinks: \"Liens spéciaux\",
    badStatus: \"Liens avec mauvais statut\",
    history: \"Historique des liens\"
  },

  // About
  about: {
    title: \"À Propos\",
    description: \"En savoir plus sur moi\"
  },

  // Search
  search: {
    title: \"Recherche\",
    placeholder: \"Rechercher des articles...\",
    noResults: \"Aucun résultat trouvé\",
    searching: \"Recherche en cours...\",
    results: \"résultats\"
  },

  // Table of Contents
  toc: {
    title: \"TABLE DES MATIÈRES\",
    onThisPage: \"Sur cette page\"
  },

  // Common
  common: {
    loading: \"Chargement...\",
    error: \"Erreur\",
    \"404\": \"Page non trouvée\",
    \"404Description\": \"Désolé, la page que vous recherchez n'existe pas.\",
    goHome: \"Retour à l'accueil\",
    share: \"Partager\",
    copy: \"Copier\",
    copied: \"Copié !\",
    darkMode: \"Mode sombre\",
    lightMode: \"Mode clair\",
    toggleTheme: \"Changer de thème\"
  },

  // Footer
  footer: {
    allRightsReserved: \"Tous droits réservés\",
    poweredBy: \"Propulsé par\",
    theme: \"Thème\"
  },

  // Comments (Waline)
  comments: {
    title: \"Commentaires\",
    login: \"Se connecter pour commenter\",
    placeholder: \"Bienvenue ! Laissez un commentaire. (L'email permet de recevoir les réponses, connexion non obligatoire)\",
    submit: \"Envoyer\",
    reply: \"Répondre\",
    like: \"J'aime\"
  },

  // Pagination
  pagination: {
    previous: \"Précédent\",
    next: \"Suivant\",
    page: \"Page\",
    of: \"sur\"
  },

  // Terms & Legal
  terms: {
    title: \"Mentions légales\",
    privacy: \"Politique de confidentialité\",
    termsConditions: \"Conditions générales d'utilisation\",
    copyright: \"Droits d'auteur\",
    disclaimer: \"Avertissement\"
  },

  // Date & Time
  date: {
    justNow: \"À l'instant\",
    minutesAgo: \"il y a {minutes} minutes\",
    hoursAgo: \"il y a {hours} heures\",
    daysAgo: \"il y a {days} jours\",
    weeksAgo: \"il y a {weeks} semaines\",
    monthsAgo: \"il y a {months} mois\",
    yearsAgo: \"il y a {years} ans\"
  }
}

export default fr
```

#### Fichier : `src/i18n/utils.ts`

```typescript
/**
 * Utilitaires pour le système de traduction
 * 
 * @note Ces fonctions permettent d'accéder facilement aux traductions
 * sans avoir à importer directement le fichier fr.ts partout
 */

import fr from './fr'

// Type pour les traductions
type Translations = typeof fr

/**
 * Récupère une traduction à partir d'une clé avec notation pointée
 * 
 * @example
 * t('blog.title') // => \"Blog\"
 * t('nav.home') // => \"Accueil\"
 * 
 * @param key - Clé de traduction (ex: 'blog.title')
 * @returns La traduction ou la clé si non trouvée
 */
export function t(key: string): string {
  const keys = key.split('.')
  let value: any = fr

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // En développement, affiche un warning pour les clés manquantes
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Clé de traduction non trouvée : ${key}`)
      }
      return key
    }
  }

  return typeof value === 'string' ? value : key
}

/**
 * Récupère toutes les traductions d'une section
 * 
 * @example
 * getSection('blog') // => { title: \"Blog\", description: \"...\", ... }
 * 
 * @param section - Nom de la section (ex: 'blog')
 * @returns Objet avec toutes les traductions de la section
 */
export function getSection(section: string) {
  return fr[section as keyof Translations] || {}
}

/**
 * Fonction helper pour remplacer des variables dans une traduction
 * 
 * @example
 * replace(t('date.minutesAgo'), { minutes: 5 }) // => \"il y a 5 minutes\"
 * 
 * @param text - Texte avec placeholders {variable}
 * @param vars - Objet avec les valeurs à remplacer
 * @returns Texte avec les variables remplacées
 */
export function replace(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\\{(\\w+)\\}/g, (_, key) => String(vars[key] ?? `{${key}}`))
}

/**
 * Export des traductions pour utilisation directe
 */
export { fr }
export default { t, getSection, replace, fr }
```

#### Fichier : `src/i18n/index.ts`

```typescript
/**
 * Point d'entrée pour le système i18n
 * Exporte toutes les fonctions et traductions
 */

export { t, getSection, replace, fr } from './utils'
export { default } from './utils'
```

---

### ÉTAPE 2 : Configurer le site en français

#### Fichier : `src/site.config.ts` (MODIFIER)

Modifie la configuration existante pour traduire en français :

```typescript
import type { CardListData, Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

/**
 * Configuration du thème en français
 * 
 * @note Cette configuration est maintenue dans src/ et ne sera pas écrasée
 * lors des mises à jour du thème Astro Pure
 */

export const theme: ThemeUserConfig = {
  // [Informations de base]
  
  /** Titre du site - utilisé dans les métadonnées et l'onglet du navigateur */
  title: 'Mon Blog Tech',
  
  /** Auteur du site - utilisé dans la page d'accueil et le copyright */
  author: 'Votre Nom',
  
  /** Description du site - utilisée dans les métadonnées */
  description: 'Blog technique sur l\\'administration système, DevOps et les technologies web',
  
  /** Favicon - chemin vers l'image dans public/ */
  favicon: '/favicon/favicon.ico',
  
  /** Image sociale par défaut - utilisée pour les partages sur les réseaux sociaux */
  socialCard: '/images/social-card.png',
  
  /** Configuration de la langue (IMPORTANT POUR LE SEO) */
  locale: {
    lang: 'fr-FR',        // Code langue ISO
    attrs: 'fr-FR',       // Attribut lang HTML
    dateLocale: 'fr-FR',  // Format de date français
    dateOptions: {
      day: 'numeric',
      month: 'long',      // Affiche le mois en toutes lettres
      year: 'numeric'
    }
  },
  
  /** Logo affiché sur la page d'accueil */
  logo: {
    src: '/src/assets/avatar.png',
    alt: 'Avatar'
  },

  /** Séparateur dans le titre (ex: \"Titre • Mon Blog\") */
  titleDelimiter: '•',
  
  /** Active le pré-rendu pour de meilleures performances SEO */
  prerender: true,
  
  /** CDN pour les packages npm (par défaut jsDelivr) */
  npmCDN: 'https://cdn.jsdelivr.net/npm',

  /** Balises head personnalisées (optionnel) */
  head: [],
  
  /** CSS personnalisé (optionnel) */
  customCss: [],

  // [Navigation]
  
  /** Menu de navigation dans le header */
  header: {
    menu: [
      { title: 'Blog', link: '/blog' },
      { title: 'Projets', link: '/projects' },
      { title: 'Liens', link: '/links' },
      { title: 'À Propos', link: '/about' }
    ]
  },

  // [Footer]
  
  /** Configuration du pied de page */
  footer: {
    /** Année du copyright */
    year: `© ${new Date().getFullYear()}`,
    // Alternative : année de création à maintenant
    // year: `© 2024 - ${new Date().getFullYear()}`,
    
    /** Liens dans le footer */
    links: [
      // Liens légaux (optionnels)
      // {
      //   title: 'Mentions légales',
      //   link: '/terms/list',
      //   pos: 2 // Position 2 = ajouté à la ligne du copyright
      // }
    ],
    
    /** Affiche \"Propulsé par Astro & Pure theme\" */
    credits: true,
    
    /** Liens vers les réseaux sociaux (optionnel) */
    social: {
      github: 'https://github.com/votre-username',
      // twitter: 'https://twitter.com/votre-username',
      // linkedin: 'https://linkedin.com/in/votre-username'
    }
  },

  // [Contenu]
  
  content: {
    /** Configuration des liens externes */
    externalLinks: {
      content: ' ↗',  // Symbole pour les liens externes
      properties: {
        style: 'user-select:none'
      }
    },
    
    /** Nombre d'articles par page */
    blogPageSize: 8,
    
    /** Plateformes de partage disponibles */
    share: ['x', 'bluesky']  // Retiré weibo pour audience française
  }
}

/**
 * Configuration des intégrations
 */
export const integ: IntegrationUserConfig = {
  // [Liens amis]
  links: {
    /** Journal de bord des liens (optionnel) */
    logbook: [],
    
    /** Info pour les demandes d'échange de liens */
    applyTip: [
      { name: 'Nom', val: theme.title },
      { name: 'Description', val: theme.description || 'Blog technique' },
      { name: 'Lien', val: 'https://votre-site.fr/' },
      { name: 'Avatar', val: 'https://votre-site.fr/favicon/favicon.ico' }
    ],
    
    /** Cache les avatars dans public/avatars/ pour de meilleures performances */
    cacheAvatar: false
  },
  
  // [Recherche]
  /** Active Pagefind pour la recherche sur le site */
  pagefind: true,
  
  // [Citation aléatoire]
  /** Citation aléatoire dans le footer (optionnel) */
  quote: {
    server: 'https://dummyjson.com/quotes/random',
    target: `(data) => (data.quote.length > 80 ? \\`\\${data.quote.slice(0, 80)}...\\` : data.quote || 'Erreur')`
  },
  
  // [Typographie]
  typography: {
    class: 'prose text-base',
    /** Style des citations (normal ou italic) */
    blockquoteStyle: 'italic',
    /** Style des blocs de code inline (code ou modern) */
    inlineCodeBlockStyle: 'modern'
  },
  
  // [Lightbox pour les images]
  mediumZoom: {
    enable: true,
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },
  
  // [Système de commentaires Waline]
  waline: {
    enable: true,
    /** URL de votre serveur Waline (à configurer) */
    server: 'https://votre-waline.exemple.com/',
    /** Émojis disponibles */
    emoji: ['bmoji', 'weibo'],
    /** Configuration supplémentaire */
    additionalConfigs: {
      pageview: true,    // Compteur de vues
      comment: true,     // Active les commentaires
      locale: {
        reaction0: 'J\\'aime',
        placeholder: 'Bienvenue ! Laissez un commentaire. (L\\'email permet de recevoir les réponses, connexion non obligatoire)'
      },
      imageUploader: false  // Désactive l'upload d'images
    }
  }
}

/**
 * Configuration des pages légales (optionnel)
 */
export const terms: CardListData = {
  title: 'Mentions légales',
  list: [
    {
      title: 'Politique de confidentialité',
      link: '/terms/privacy-policy'
    },
    {
      title: 'Conditions générales d\\'utilisation',
      link: '/terms/terms-and-conditions'
    },
    {
      title: 'Droits d\\'auteur',
      link: '/terms/copyright'
    },
    {
      title: 'Avertissement',
      link: '/terms/disclaimer'
    }
  ]
}

// Export final de la configuration
const config = { ...theme, integ } as Config
export default config
```

---

### ÉTAPE 3 : Créer un override local pour les textes du thème

Astro Pure utilise certains textes en dur dans ses composants. Pour les traduire sans modifier `packages/pure/`, on va créer des overrides locaux.

#### Fichier : `src/components/overrides/README.md`

```markdown
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

À compléter au fur et à mesure...
```

---

### ÉTAPE 4 : Documentation de maintenance

#### Fichier : `TRADUCTION_FR.md` (à la racine du projet)

```markdown
# 🇫🇷 Traduction française du site

## ✅ État actuel

Le site est entièrement traduit en français :
- ✅ Configuration principale (`src/site.config.ts`)
- ✅ Système de traduction centralisé (`src/i18n/`)
- ✅ Métadonnées SEO en français
- ✅ Format de dates en français

## 📁 Architecture de la traduction

```
src/
├── i18n/
│   ├── fr.ts          → Toutes les traductions françaises
│   ├── utils.ts       → Fonctions helpers (t, getSection, replace)
│   └── index.ts       → Point d'entrée
├── site.config.ts     → Configuration du site en français
└── components/
    └── overrides/     → Composants overridés pour traduction
```

## 🔧 Comment utiliser les traductions

### Dans un composant Astro

```astro
---
import { t } from '@/i18n'
---

<h1>{t('blog.title')}</h1>
<p>{t('blog.description')}</p>
```

### Pour une section complète

```astro
---
import { getSection } from '@/i18n'

const blogTranslations = getSection('blog')
---

<h1>{blogTranslations.title}</h1>
```

### Avec des variables

```astro
---
import { t, replace } from '@/i18n'

const minutesAgo = replace(t('date.minutesAgo'), { minutes: 5 })
// Résultat : \"il y a 5 minutes\"
---
```

## 📝 Ajouter une nouvelle traduction

1. Ouvrir `src/i18n/fr.ts`
2. Ajouter la nouvelle clé dans la section appropriée :

```typescript
export const fr = {
  // ... existant
  maNouvelle Section: {
    monTexte: 'Ma traduction'
  }
}
```

3. Utiliser dans un composant :

```astro
---
import { t } from '@/i18n'
---

<p>{t('maNouvelleSection.monTexte')}</p>
```

## 🔄 Mise à jour du thème Astro Pure

### Avant la mise à jour

1. Sauvegarder vos fichiers dans `src/`
2. Noter les composants que vous avez overridés

### Après la mise à jour

1. Vérifier que `src/site.config.ts` n'a pas été écrasé
2. Vérifier que `src/i18n/` est toujours présent
3. Tester le site en développement
4. Vérifier les composants overridés s'il y en a

### En cas de conflit

Si un fichier a été modifié par la mise à jour :

```bash
# Voir les différences
git diff src/site.config.ts

# Fusionner manuellement si nécessaire
```

## ✅ Checklist après mise à jour

- [ ] Le site démarre correctement
- [ ] Les traductions fonctionnent
- [ ] La navigation est en français
- [ ] Les dates sont au format français
- [ ] Les métadonnées SEO sont correctes
- [ ] Le système de commentaires (si activé) est en français

## 🌍 SEO et langue

Le site est configuré pour le français :

```typescript
// Dans src/site.config.ts
locale: {
  lang: 'fr-FR',        // Code langue pour le SEO
  attrs: 'fr-FR',       // Attribut HTML lang
  dateLocale: 'fr-FR'   // Format de dates
}
```

### Balises HTML générées

```html
<html lang=\"fr-FR\">
<meta property=\"og:locale\" content=\"fr-FR\">
<link rel=\"canonical\" href=\"https://votre-site.fr/page\">
```

## 🐛 Dépannage

### Les traductions ne s'affichent pas

1. Vérifier l'import : `import { t } from '@/i18n'`
2. Vérifier la clé : `t('section.cle')`
3. Vérifier la console (warnings en mode dev)

### Texte en anglais qui persiste

1. Identifier d'où vient le texte (composant du thème)
2. Créer un override dans `src/components/overrides/`
3. Modifier le texte dans l'override

### Dates toujours en anglais

Vérifier dans `src/site.config.ts` :

```typescript
locale: {
  dateLocale: 'fr-FR',  // Doit être fr-FR
  dateOptions: {
    day: 'numeric',
    month: 'long',       // long = mois en toutes lettres
    year: 'numeric'
  }
}
```

## 📚 Ressources

- [Documentation Astro Pure](https://astro-pure.js.org/docs)
- [Guide i18n Astro](https://docs.astro.build/en/guides/internationalization/)
- [Format de dates JS](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)

## 🎯 Prochaines étapes

- [ ] Personnaliser le contenu dans `src/site.config.ts`
- [ ] Ajouter votre logo dans `public/`
- [ ] Configurer Waline si vous utilisez les commentaires
- [ ] Créer vos premiers articles dans `src/content/blog/`

---

✅ **Traduction réussie !** Le site est maintenant 100% en français et prêt à être personnalisé.
```

---

## 🎯 Instructions pour Claude Code

**Copie-colle ce prompt dans Claude Code :**

```
Contexte :
Je viens de cloner le thème Astro Pure (https://astro-pure.js.org) et je veux le traduire entièrement en français.

Objectif :
Mettre en place un système de traduction français propre, maintenable et qui survit aux mises à jour du thème.

Consignes STRICTES :
1. NE JAMAIS modifier de fichiers dans packages/pure/
2. Tout doit être fait dans src/
3. Bien commenter chaque fichier en français
4. Créer la documentation de maintenance

Tâches à effectuer dans l'ordre :

ÉTAPE 1 : Créer le système i18n
- Créer src/i18n/fr.ts avec TOUTES les traductions (utilise le contenu fourni)
- Créer src/i18n/utils.ts avec les fonctions helpers (utilise le contenu fourni)
- Créer src/i18n/index.ts (utilise le contenu fourni)

ÉTAPE 2 : Configurer le site
- Modifier src/site.config.ts pour tout traduire en français (utilise le contenu fourni)
- Personnaliser : title, author, description, menu, etc.

ÉTAPE 3 : Documentation
- Créer src/components/overrides/README.md (utilise le contenu fourni)
- Créer TRADUCTION_FR.md à la racine (utilise le contenu fourni)

ÉTAPE 4 : Vérification
- Lancer npm run dev
- Vérifier que tout s'affiche en français
- Vérifier la console pour des warnings
- Tester la navigation

Une fois terminé, affiche-moi un résumé de ce qui a été fait avec la checklist de vérification.
```

---

## 📋 Checklist de vérification (pour toi)

Après que Claude Code ait terminé :

### Phase 1 : Fichiers créés
- [ ] `src/i18n/fr.ts` existe et contient toutes les traductions
- [ ] `src/i18n/utils.ts` existe avec les fonctions
- [ ] `src/i18n/index.ts` existe
- [ ] `src/site.config.ts` est en français
- [ ] `TRADUCTION_FR.md` existe à la racine
- [ ] `src/components/overrides/README.md` existe

### Phase 2 : Configuration
- [ ] Menu de navigation en français
- [ ] Locale configuré sur `fr-FR`
- [ ] Métadonnées du site en français
- [ ] Footer en français

### Phase 3 : Tests
```bash
# Lancer le site
npm run dev

# Visiter ces pages et vérifier qu'elles sont en français :
# - http://localhost:4321/
# - http://localhost:4321/blog
# - http://localhost:4321/projects
# - http://localhost:4321/about
# - http://localhost:4321/links
```

- [ ] Page d'accueil en français
- [ ] Navigation en français
- [ ] Footer en français
- [ ] Dates au format français
- [ ] Aucune erreur dans la console

### Phase 4 : SEO
- [ ] Inspecter une page : `<html lang=\"fr-FR\">`
- [ ] Métadonnée locale : `<meta property=\"og:locale\" content=\"fr-FR\">`
- [ ] Description en français
- [ ] Titre en français

---

## 🔄 Pour les mises à jour futures du thème

Quand une nouvelle version d'Astro Pure sort :

```bash
# 1. Sauvegarder ton travail
git commit -am \"Sauvegarde avant mise à jour thème\"

# 2. Mettre à jour le thème
npm update astro-pure

# 3. Tester
npm run dev

# 4. Si problème, check les fichiers :
# - src/site.config.ts
# - src/i18n/
# Ces fichiers NE DOIVENT PAS être écrasés

# 5. Si tout va bien
git commit -am \"Mise à jour thème Astro Pure vers X.X.X\"
```

---

## 💡 Pourquoi cette approche est meilleure

### ✅ Avantages

1. **Survit aux mises à jour** : Tout est dans `src/`, jamais touché par les updates
2. **Centralisé** : Une seule source de vérité pour les traductions
3. **Type-safe** : TypeScript évite les erreurs de clés
4. **Maintenable** : Facile d'ajouter/modifier des traductions
5. **Documenté** : Le fichier `TRADUCTION_FR.md` explique tout
6. **SEO optimal** : Configuration locale correcte

### 🎯 Différences avec l'approche précédente

| Avant (complexe) | Maintenant (simple) |
|------------------|---------------------|
| Middleware + cookies | Config statique |
| Détection langue | Français uniquement |
| Multiple langues | Une langue |
| Complexe | KISS |
| Risque SEO | SEO parfait |

---

