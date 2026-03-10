# CLAUDE.md — visbran/blog

> Référence de travail pour Claude Code. Tenu à jour au fil des sessions.

## Projet

Blog technique personnel **www.visbran.fr** — administration système, Linux, DevOps, homelab.

- **Framework** : Astro 5 + thème `astro-pure` (npm ^1.4.1)
- **Package manager** : Bun (`bun run build`, `bun run dev`, `bun run check`)
- **Déploiement** : Vercel (auto-deploy sur push `main`)
- **Repo** : github.com/visbran/blog
- **Langue** : français uniquement

---

## Architecture

```
src/
├── i18n/               Traductions françaises (fr.ts, utils.ts, index.ts)
├── site.config.ts      Config principale du thème
├── content/blog/       Articles (un dossier par article)
├── pages/terms/        Pages légales (.md)
├── components/overrides/  Composants surchargés sans toucher au thème
└── pages/api/quote.ts  Endpoint citations françaises (prerender=false)

md/                     Notes et analyses (hors build)
vercel.json             Headers sécurité (CSP, HSTS) + redirects 301
```

**Ne jamais modifier** `node_modules/astro-pure/` — utiliser `src/components/overrides/` à la place.

---

## Écrire un article

### Structure

Chaque article = un dossier dans `src/content/blog/[slug]/` avec `index.md` (et optionnellement une image hero).

### Frontmatter requis

```yaml
---
title: "Titre de l'article"
description: "Description courte (max 160 caractères)"
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
language: fr
draft: false
comment: true
---
```

### Frontmatter optionnel

```yaml
updatedDate: '2026-04-01T10:00:00+01:00'
heroImage:
  src: ./nom-image.png
  alt: Description de l'image
```

### Contraintes importantes

- **`description` : maximum 160 caractères** — le build échoue si dépassé
- **YAML et apostrophes** : utiliser des guillemets doubles pour les valeurs contenant des apostrophes
  ```yaml
  # ERREUR
  title: 'Droits d'auteur'
  # CORRECT
  title: "Droits d'auteur"
  ```
- `heroImage` est optionnel — un article sans image fonctionne
- `draft: false` pour publier, `draft: true` pour masquer

### Tags utilisés (cohérence)

`linux` · `administration système` · `sécurité` · `ssh` · `réseau` · `scripting` · `automatisation` · `docker` · `devops` · `mysql` · `wordpress` · `windows` · `virtualisation`

---

## Configuration du site (`src/site.config.ts`)

### Footer — liens

```typescript
footer: {
  links: [
    { title: 'Mentions légales', link: '/terms/list', pos: 1 }
  ]
}
```

- **`pos: 1`** : ligne séparée au-dessus du copyright
- **`pos: 2`** : même ligne que le copyright (après `&`)
- Bug thème : le `&` s'affiche dès que `links.length > 0`, même sans lien `pos: 2`

### Waline — pièges

- **Server URL** : hardcodée — `import.meta.env` n'est pas résolu dans le contexte `virtual:config`
- **Emoji** : noms courts uniquement `['bmoji', 'weibo']` — Comment.astro préfixe déjà le CDN, les URLs complètes créent des doubles URLs
- **CSP** : `connect-src` doit inclure `https://cdn.jsdelivr.net` (fetch emoji via XHR)
- **SECURE_DOMAINS** sur le projet Waline Vercel : `visbran.fr,www.visbran.fr,localhost`

---

## Composants overridés (`src/components/overrides/`)

- **`Quote.astro`** : fetch direct `/api/quote` — le composant original du thème utilise eval dynamique incompatible avec la CSP
- **`Copyright.astro`** : imports depuis `astro-pure/utils` (pas de chemin relatif)
- **`TOC.astro`** : `generateToc` inlinée car non exposée par le package npm

Lors d'une mise à jour du thème, vérifier si ces composants ont changé en upstream.

---

## Mettre à jour le thème

```bash
bun update astro-pure
bun run check
bun run build
```

---

## Commandes

```bash
bun run dev      # Développement local
bun run build    # Build production (PAS bun build — c'est différent)
bun run check    # Vérification TypeScript + Astro
```

---

## Contenu éditorial

Voir `md/analyse-articles.md` pour l'inventaire complet et les recommandations.

### Articles publiés (23)

19 articles historiques + 4 nouveaux (mars 2026) :
- `fail2ban-proteger-services-brute-force`
- `docker-compose-orchestrer-conteneurs`
- `rsync-sauvegarder-synchroniser-fichiers`
- `ufw-configurer-pare-feu-linux`

### Prochains articles (priorité moyenne)

- WireGuard — VPN moderne
- Traefik — reverse proxy Docker + Let's Encrypt
- tmux — multiplexeur de terminal
- systemd — créer et gérer ses services

---

## Pièges connus

| Problème | Cause | Solution |
|---|---|---|
| `description` trop longue | max 160 chars dans le schema | Raccourcir la description |
| YAML `bad indentation` | Apostrophe dans une valeur entre guillemets simples | Utiliser des guillemets doubles |
| `import.meta.env` vide | Non résolu dans `virtual:config` | Utiliser `process.env` ou hardcoder |
| `bun build` au lieu de `bun run build` | Bundler Bun vs script npm | Toujours `bun run build` |
| Waline emojis en double URL | URL complète dans `emoji[]` | Noms courts uniquement |
| `&` parasite dans le footer | Bug thème : s'affiche si `links.length > 0` | Connu, pas bloquant |
