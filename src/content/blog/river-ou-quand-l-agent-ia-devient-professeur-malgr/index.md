---
title: "River, ou quand l'agent IA devient professeur malgré lui"
description: "On nous vend surtout des agents IA comme des remplaçants silencieux. Un truc qui s'installe dans un coin de VS Code, noyé dans les onglets, et qui crache d..."
heroImage:
  src: "https://picsum.photos/seed/learning-on-the-shop-floor/1200/630"
  alt: "River, ou quand l'agent IA devient professeur malgré lui"
  inferSize: true
publishDate: '2026-05-11T20:47:16.370Z'
tags:
  - river-shopify
  - apprentissage-osmose
  - culture-engineering
  - agents-codage
language: fr
draft: false
automated: true
contentType: tool
sources:
  - "https://simonwillison.net/2026/May/11/learning-on-the-shop-floor/#atom-everything"
---

## River, ou quand l'agent IA devient professeur malgré lui

> **TL;DR** : River, l'agent de codage interne de Shopify, refuse les messages privés et force tout le monde à travailler avec elle dans des canaux Slack publics, transformant chaque session de code en atelier d'apprentissage collectif que tu peux reproduire dès maintenant avec l'agent que tu as déjà sous la main.

On nous vend surtout des agents IA comme des remplaçants silencieux. Un truc qui s'installe dans un coin de VS Code, noyé dans les onglets, et qui crache du code que personne ne verra jamais. Shopify vient de montrer que c'est exactement l'inverse qu'il faut faire. Chez eux, River, leur agent de codage maison, a une règle absolue : elle ne répond pas aux MPs. Si tu veux qu'elle bosse, tu crées un canal Slack public et tu te mets à nu devant toute l'entreprise.

### Ce que River fait vraiment

River n'est pas un plugin caché dans ton IDE. C'est un agent qui vit intégralement dans Slack. Tu lui demandes de refactorer un service, de déchiffrer une regex écrite il y a cinq ans par un mec parti depuis longtemps, ou de préparer une review de PR complexe. Elle répond dans le thread, génère des bouts de code, pose des questions. Mais le mécanisme qui change tout, c'est que ces conversations se déroulent dans des canaux publics et searchables. Tobias Lütke, le CEO, travaille avec elle dans #tobi_river. Résultat : plus de 100 personnes y traînent, réagissent aux threads, ajoutent du contexte métier que l'agent ignore, relèvent des erreurs de logique, et parfois rappellent gentiment au patron qu'il a oublié comment fonctionne le framework maison. Le lien original où Lütke détaille ce fonctionnement est relayé par Simon Willison ici : https://simonwillison.net/2026/May/11/learning-on-the-shop-floor/. C'est le blueprint d'une culture engineering où l'IA est un catalyseur de transparence, pas un outil de remplacement.

### Pourquoi la visibilité vaut plus que le code généré

Ce qui compte chez Shopify, ce n'est pas tant ce que River produit. C'est l'environnement qu'elle force à créer. Les Allemands ont un mot pour ça : Lehrwerkstatt, l'atelier d'apprentissage. Quand tu bosses avec un agent en public, tu n'as plus besoin d'un cursus onboarding ou d'un plan de formation PowerPoint. L'apprentissage devient de l'osmose. Les gens apprennent en étant proches du travail réel. Ils voient comment tu formules un prompt quand la codebase est immonde, comment tu vérifies une suggestion qui a l'air trop propre, comment tu refuses une abstraction over-engineered proposée par l'IA. On a déjà vu ce mécanisme avec Midjourney à ses débuts. L'outil était volontairement dans des canaux Discord publics, forçant chacun à exposer ses prompts, ses ratés et ses découvertes. Cette visibilité forcée a compensé la nature absurde du prompting texte-à-image. River fait exactement pareil pour le code : elle expose la pensée technique au grand jour, et cette exposition vaut bien plus que le livrable final.

### Comment piquer l'idée ce matin avec tes outils actuels

Tu n'as pas besoin d'attendre que Shopify open-source River. L'outil importe moins que la posture. Prends l'agent que tu utilises déjà : Claude Code, Cursor, Aider, GitHub Copilot Chat, peu importe. La prochaine fois que tu attaques une tâche non triviale, ouvre un canal public dans ton Slack, Discord ou Mattermost. Appelle-le #ton_prenom_agent ou #refacto_auth_v2. Copie-colle ta session. Montre tes prompts bruts. Quand l'agent te propose une solution élégante mais dangereuse, ne la corrige pas dans le silence : réponds dans le thread, explique pourquoi c'est non, quelle contrainte métier il a oubliée. Si un collègue passe à ce moment-là et drop un "attention au race condition sur le paiement", tout le monde gagne. Le canal devient un vivier. Pour un sysadmin, c'est identique. Tu traques un incident à 3h du mat sur un cluster Kubernetes ? Ouvre #incident-pods-oomkill. Poste les logs bruts, demande à l'agent d'analyser les patterns, montre les commandes que tu tentes et celles qui foirent. Le lendemain, celui qui reprend le service ne tombe pas sur un ticket fermé avec un laconique "c'est réglé". Il trouve un fil narratif complet avec la pensée, les erreurs, les fausses pistes et la résolution.

### Quand l'osmose remplace l'onboarding

L'effet le plus sous-estimé ? L'onboarding. Imagine le nouveau qui arrive lundi. Au lieu de lui filer une documentation obsolète de 400 pages, tu lui donnes l'accès historique aux canaux publics des deux derniers mois. Il y voit comment vous avez migré la base de données, pourquoi vous avez refusé telle architecture suggérée par l'IA, comment le senior a argumenté contre un ORM automatique. C'est de la vraie connaissance du terrain, pas du bullshit théorique. Et ça ne coûte strictement rien : c'est un sous-produit naturel du travail quotidien exposé.

### Le piège à éviter

La tentation sera forte de ne partager que les succès. Résiste. La valeur est dans la merde. Dans le prompt raté, la suggestion idiote de l'agent, le bug que tu as manqué et que ton collègue a capturé en passant. Si tu ne montres que le code final propre, tu construis un musée inutile. River fonctionne chez Shopify parce que Tobias Lütke accepte que cent personnes le voient galérer et lui rappeler qu'il est rouillé. L'humilité n'est pas une qualité optionnelle ici, c'est le pré-requis technique. Si ton ego ne supporte pas que les autres voient ton agent partir dans le mur, tu ne feras jamais de Lehrwerkstatt. Tu feras juste du bricolage caché.

L'IA ne remplace pas la culture. Elle l'amplifie. Si ta culture est fermée et silotée, les agents IA la rendront pire en accélérant la production de dette invisible. Si ta culture est ouverte, River prouve que l'agent peut devenir le meilleur outil d'apprentissage organisationnel que tu aies jamais eu. Alors arrête de coder dans le noir. Ouvre un canal.