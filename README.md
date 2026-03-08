# Visbran — Blog technique

> Blog personnel sur l'administration système, l'infrastructure, le homelab et le DevOps.

[![Astro](https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Vercel](https://img.shields.io/badge/Déployé_sur-Vercel-000000?logo=vercel&logoColor=white)](https://visbran.fr)
[![Licence](https://img.shields.io/badge/Licence-Apache_2.0-blue)](./LICENSE)

🌐 **[visbran.fr](https://visbran.fr)**

---

## À propos

Ce blog documente mes expériences et découvertes en tant qu'administrateur système et réseau. Les articles couvrent des sujets pratiques autour de Linux, Docker, la virtualisation, la sécurité et le self-hosting.

**Thématiques principales :**
- 🐧 Administration Linux (Debian, Ubuntu, Arch)
- 🐳 Conteneurisation & Docker
- 🔐 Sécurité système et réseau
- 🏠 Homelab & self-hosting
- ⚙️ DevOps & automatisation

---

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Framework | [Astro 5](https://astro.build) — output statique |
| Thème | [Astro Pure](https://github.com/cworld1/astro-theme-pure) par cworld1 |
| Style | [UnoCSS](https://unocss.dev) |
| Déploiement | [Vercel](https://vercel.com) |
| Commentaires | [Waline](https://waline.js.org) + anti-spam Cloudflare Turnstile |
| Recherche | [Pagefind](https://pagefind.app) |
| Maths | [KaTeX](https://katex.org) |
| Images | Sharp + zoom via Medium Zoom |

---

## Fonctionnalités

- ✅ Site 100% en français (système i18n centralisé dans `src/i18n/`)
- ✅ SEO complet — Open Graph, Twitter Card, JSON-LD, sitemap, RSS
- ✅ Mode sombre / clair
- ✅ Table des matières automatique
- ✅ Recherche full-text offline (Pagefind)
- ✅ Commentaires avec compteur de vues (Waline)
- ✅ Coloration syntaxique (Shiki) avec copie de code
- ✅ Images optimisées (WebP, responsive)
- ✅ En-têtes de sécurité (CSP, HSTS, X-Frame-Options…)
- ✅ Score Lighthouse ≥ 90

---

## Développement local

**Prérequis :** [Bun](https://bun.sh) ≥ 1.0

```bash
# Installer les dépendances
bun install

# Lancer le serveur de développement
bun dev

# Build de production
bun build

# Vérification TypeScript
bun check
```

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
# URL du serveur Waline (commentaires)
PUBLIC_WALINE_URL=https://votre-serveur-waline.vercel.app/

# Clé publique Cloudflare Turnstile (anti-spam)
PUBLIC_TURNSTILE_KEY=votre_cle_publique
```

---

## Structure du projet

```
src/
├── i18n/               # Traductions françaises
│   ├── fr.ts           # Toutes les chaînes de caractères
│   ├── utils.ts        # Fonctions t(), getSection(), replace()
│   └── index.ts        # Point d'entrée
├── components/
│   └── overrides/      # Composants remplaçant ceux du thème
├── content/
│   └── blog/           # Articles en Markdown
├── pages/
│   └── api/quote.ts    # Endpoint citations françaises
└── site.config.ts      # Configuration principale
```

---

## Ajouter un article

```bash
bun new
```

Ou créer manuellement un dossier dans `src/content/blog/` avec un fichier `index.md` :

```yaml
---
title: 'Titre de l'article'
description: 'Description courte (max 160 caractères)'
publishDate: '2026-01-01'
tags:
  - linux
  - docker
heroImage:
  src: ./image.png
  alt: 'Description de l'image'
---
```

---

## Déploiement

Le site se déploie automatiquement sur [Vercel](https://vercel.com) à chaque push sur `main`.

Les en-têtes de sécurité sont configurés dans [`vercel.json`](./vercel.json) :
`Content-Security-Policy`, `HSTS`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.

---

## Crédits

Ce blog est basé sur le thème **[Astro Pure](https://github.com/cworld1/astro-theme-pure)** de [cworld1](https://github.com/cworld1), distribué sous licence [Apache 2.0](https://github.com/cworld1/astro-theme-pure/blob/main/LICENSE).

Conformément à la licence, les fichiers du thème original sont conservés dans `packages/pure/` sans modification.
