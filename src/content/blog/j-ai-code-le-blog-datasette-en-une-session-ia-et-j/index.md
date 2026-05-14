---
title: "J'ai codé le blog Datasette en une session IA et j'ai publié la bande-son complète"
description: "Simon Willison a code le blog Datasette en une session IA avec Codex et publie le transcript Markdown complet, voici pourquoi tu devrais faire pareil"
heroImage:
  src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
  alt: "J'ai codé le blog Datasette en une session IA et j'ai publié la bande-son complète"
  inferSize: true
publishDate: '2026-05-14T03:02:38.551Z'
tags:
  - datasette
  - openai-codex
  - vibe-coding
  - documentation-automatique
language: fr
draft: false
automated: true
contentType: tutorial
sources:
  - "https://simonwillison.net/2026/May/13/welcome-to-the-datasette-blog/#atom-everything"
---

## J'ai codé le blog Datasette en une session IA et j'ai publié la bande-son complète

> **TL;DR** : Simon Willison a construit le blog officiel de Datasette en une session unique avec OpenAI Codex desktop, puis a exporté et publié l'intégralité du transcript Markdown pour montrer exactement comment le projet est né étape par étape.

### Arrête de ne montrer que le code final

La plupart des projets IA que tu vois passer sur GitHub ou Twitter ne livrent que le résultat : un repo propre, un déploiement flashy, un README élagué au couteau. Tu vois le succès, mais pas la route. Tu ne vois pas la demande mal formulée qui a envoyé l'agent dans un mur, le détour inutile de vingt minutes, la correction à mi-parcours qui a tout sauvé. Pourtant, c'est précisément là que se trouve la vraie valeur cognitive. Quand Simon Willison a décidé que Datasette méritait enfin un blog officiel pour annoncer les évolutions à venir, il n'a pas juste pushé du HTML et rédigé un communiqué de presse. Il a ouvert une session unique dans OpenAI Codex desktop et il a publié la totalité de la conversation. Le lien vers le transcript brut est dans son article. Tu peux lire chaque prompt, chaque réponse du modèle, chaque itération, chaque fichier créé puis déplacé. C'est radical par sa transparence, mais surtout c'est un workflow immédiatement reproductible chez toi.

### Le principe : une session, un artefact, zéro perte de contexte

Voici comment ça marche concrètement. Willison n'a pas chipoté dans trois outils différents ou relancé un nouveau chat à chaque blocage. Il a lancé Codex desktop — l'agent de codage local d'OpenAI — et il a gardé la conversation ouverte du début à la fin. Une seule discussion continue, du premier "crée-moi un blog minimaliste pour Datasette" jusqu'au dernier ajustement de métadonnées Open Graph. Le truc décisif, c'est que Codex desktop propose une fonction d'export du transcript de session en Markdown native. Ce n'est pas un simple git diff ni un copier-coller approximatif depuis l'interface web. C'est la conversation entière, formatée proprement : ce que Willison a demandé, ce que l'agent a proposé, les fichiers générés, les commandes shell exécutées, les erreurs rencontrées et corrigées en direct, les moments où l'humain a repris la main pour rectifier la trajectoire. Quand tu exportes ça, tu obtiens un document linéaire, lisible, qui raconte l'histoire complète du projet sans effort de réécriture.

### Pourquoi le transcript vaut plus que le repository

Tu pourrais te dire que `git log` suffit à retracer l'histoire. Faux. Git garde les états successifs du code, mais il efface l'intention. Il ne dit pas : "j'ai d'abord demandé une sidebar, puis j'ai réalisé que c'était inutile pour un blog statique, donc on l'a virée au prompt suivant". Le transcript Markdown capture la boucle de feedback humain-modèle dans sa totalité. Pour un projet open source comme Datasette, c'est de l'or. Un nouveau contributeur peut lire la session et comprendre pourquoi telle structure de dossier a été choisie, pourquoi tel générateur statique a été préféré à un autre, à quel moment la décision de séparer les templates a été prise, ou même pourquoi telle librairie a été abandonnée après test. C'est de la documentation narrative, auto-générée, sans effort rédactionnel supplémentaire. Tu ne rédiges rien, tu ne structures rien à la main. Tu exportes et tu publies. Le document parle de lui-même et il remplace avantageusement les séances de "knowledge transfer" interminables.

### Adapte ce workflow à ton environnement actuel

Tu n'as pas forcément Codex desktop sous la main, et peut-être que ton entreprise bloque les agents locaux. Peu importe : la méthode reste valide avec n'importe quel agent de codage. L'essentiel, c'est la discipline de session. Quand tu démarres un projet from scratch avec un LLM, ne fragmente pas l'historique. Garde le même thread, le même contexte. Si tu utilises Cursor, Claude Code, ou même une interface web, copie régulièrement l'historique dans un fichier `session.md` brut à côté de ton repo. À la fin du projet, tu as deux livrables : le code fonctionnel, et le récit de sa conception. Publie ce récit dans ton repository sous `SESSION.md` ou convertis-le en article de blog. Si ton outil a un export natif en Markdown, comme Codex desktop, c'est encore mieux : le formatage est propre, les blocs de code sont intacts, la chronologie est respectée et tu perds zéro minute en mise en page. Le gain immédiat ? Quand tu dois repasser sur le projet dans six mois, tu ne te demandes pas pourquoi tu as fait tel choix d'architecture ou pourquoi ce fichier est placé là. Tu relis ta propre session et tu récupères le contexte perdu en cinq minutes.

### Ce que ça change pour ton équipe ou ta communauté

Ce n'est pas un gadget pour fans d'IA. C'est une pratique d'ingénierie sérieuse. En publiant le transcript de la construction du blog Datasette, Willison démontre deux choses concrètes. Premièrement, le "vibe coding" n'est pas une boîte noire magique et opaque : on peut l'inspecter, l'auditer, l'améliorer collectivement. Deuxièmement, l'export de session transforme chaque projet solo en matériel pédagogique brut et authentique. Tes collègues n'ont plus besoin de te demander "tu as utilisé quel prompt exact pour générer le système d'authentification ?". Le prompt est là, en ligne 67 du transcript. Tes utilisateurs peuvent vérifier qu'aucune donnée sensible n'a fuité pendant la génération. Et toi, tu peux recycler les bons passages de session dans des templates réutilisables pour les prochains projets. C'est de l'automatisation de la documentation par l'existant, sans pipeline CI complexe, sans outil tiers payant. Tu codes, tu exportes, tu publies. Point final.