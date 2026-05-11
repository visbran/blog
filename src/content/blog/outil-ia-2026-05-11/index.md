---
title: "Learning on the Shop floor : l'agent de code de Shopify qui refuse les messages privés"
description: "Tu connais le scénario. Tu es bloqué à 17h45, tu ouvres un message privé avec l'agent IA de l'entreprise, tu lui demande de régler le souci, il te sort un ..."
publishDate: '2026-05-11T18:52:14.859Z'
tags:
  - outil-ia
  - outils
  - ia
language: fr
draft: false
automated: true
contentType: outil
sources:
  - "https://simonwillison.net/2026/May/11/learning-on-the-shop-floor/#atom-everything"
---

## Learning on the Shop floor : l'agent de code de Shopify qui refuse les messages privés

Tu connais le scénario. Tu es bloqué à 17h45, tu ouvres un message privé avec l'agent IA de l'entreprise, tu lui demande de régler le souci, il te sort un patch, tu pousses. Zéro review, zéro discussion, zéro partage. Le lendemain, personne ne sait que ce fix existe ni comment il marche. Tobias Lütke, CEO de Shopify, vient de présenter [River, leur agent de codage interne](https://twitter.com/tobi/status/2053121182044451016). La règle est brutale : River ne répond pas aux messages directs. Tout se passe en public, dans les channels Slack. Si tu veux du code, tu le demandes au milieu de tes collègues. Et c'est exactement pour ça que c'est génial.

### River, l'agent qui ne répond qu'en public

River est un coding agent avec accès à la codebase. Il lit, propose des modifications, exécute des tests, interagit avec les systèmes. Mais il n'existe que dans les channels publics. Tu veux split une classe en deux ? Tu vas dans #engineering, tu le ping, tu exposes ton besoin. Lui répond avec son raisonnement et le diff. Tout le monde voit passer l'interaction : le junior qui débarque, le tech lead qui flâne, l'ingénieur sécurité qui surveille. Ce n'est pas une préférence de communication, c'est une architecture de transparence. Le titre du post de Lütke est explicite : "Learning on the Shop floor". L'image est celle de l'apprenti dans l'atelier mécanique. Il n'apprend pas dans un coin avec un manuel, mais en regardant le réparateur travailler sur le moteur, en entendant les questions et les astuces. River transforme chaque channel en atelier ouvert.

### La transparence tue la dette technique silencieuse

Le vrai problème des agents privés, c'est le code fantôme. Ce code que personne n'a vu naître, que personne n'a relu, mais qui atterrit pourtant dans la base. Tu demandes un quick fix pour le timeout de l'API interne, l'agent te sort un hack avec un sleep de trois secondes, tu merges pour débloquer ton vendredi. Lundi, personne ne sait pourquoi l'API ralentit mystérieusement. En public, ce scénario est plus dur à tenir. Tes collègues voient le prompt, le sleep dans le diff, et quelqu'un intervient : "attends, le problème est au niveau du pool de connexions". L'agent devient un médiateur technique, pas un complice anonyme. Et il y a l'effet audience : tu ne vas pas balancer une demande floue en public. Tu prépares ton contexte, tu précises les contraintes. L'agent reçoit une meilleure spec, donc il crache un meilleur résultat.

### Trois situations où le public bat l'isolation

Pendant un incident à 22h, au lieu de te terrer seul dans ton terminal, tu vas dans #incidents. Tu demandes à River d'analyser les pods qui restart en boucle. Il poste son raisonnement : "Le pod échoue car la variable DATABASE_URL pointe vers l'ancien host. Je propose de patcher le ConfigMap." Toute l'équipe voit l'analyse. Quelqu'un peut dire stop si l'agent ignore un effet de bord. Le lendemain, le junior en shadowing a compris comment corréler un restart avec une migration de base. Pour un refactor, le dev ne bricole pas seul trois semaines. Il ouvre un thread dans #architecture, demande un découpage au bot. River propose la structure des modules et les interfaces. Le tech lead corrige : "tu as oublié la rétrocompatibilité v2". Le code est co-construit avant même le premier commit. Quant au nouveau, il apprend en regardant passer les conversations dans le channel public. Il voit comment on formule une bonne spec, comment on relit un diff. Pas besoin d'un manuel de trois cents pages.

### Ton propre River en trois coups de cuiller à pot

Tu n'as pas besoin d'une équipe ML dédiée pour reproduire ça. Un bot Slack, une fonction serverless, un accès API à Claude ou GPT-4, et une règle absolue : zéro DM. Configure le pour qu'il soit bavard utile. Pas juste "Voici le fix", mais "J'ai identifié le problème dans `billing.js`. Voici le diff. Point de vigilance : le taux est hardcodé." Pour les sysadmins, donne-lui un read-only sur tes logs Loki ou Datadog. Quand quelqu'un demande "pourquoi le service X est lent ?", l'agent query les métriques en public et expose son raisonnement. L'équipe corrige immédiatement si l'agent confond corrélation et causalité. La partie technique est simple. Le vrai défi est culturel : accepter de montrer tes brouillons, tes questions bêtes, et tes erreurs de prompt.

### L'IA appartient à l'équipe, pas au solo dev

Le risque des agents de codage, c'est le développeur cow-boy accéléré. Un mec seul avec un super-pouvoir qui génère du code dix fois plus vite. S'il se trompe, il entraîne la codebase. S'il a raison, personne ne comprend. River inverse ça. L'agent n'est pas un amplificateur individuel, c'est un outil collectif. Il force la discussion avant le merge et transforme chaque interaction en pair programming implicite. Alors oui, c'est moins confortable que de chuchoter à une IA dans un DM. Mais l'ingénierie n'a jamais été un sport de chambre. Ouvre ton agent au public. Ton équipe deviendra meilleure, et ton code aussi.