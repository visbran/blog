---
title: "llm-gemini 0.31 : Gemini 3.1 Flash-Lite sort du labo et arrive dans ton terminal"
description: "Simon Willison a construit un écosystème incroyablement pratique autour de son outil `llm` : un CLI Python qui sert de hub universel pour discuter avec des..."
heroImage:
  src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80"
  alt: "llm-gemini 0.31 : Gemini 3.1 Flash-Lite sort du labo et arrive dans ton terminal"
  inferSize: true
publishDate: '2026-05-12T11:02:22.592Z'
tags:
  - llm-gemini
  - google-gemini
  - cli-ia
  - simon-willison
language: fr
draft: false
automated: true
contentType: tool
sources:
  - "https://simonwillison.net/2026/May/7/llm-gemini/#atom-everything"
---

## llm-gemini 0.31 : Gemini 3.1 Flash-Lite sort du labo et arrive dans ton terminal

> **TL;DR** : Le plugin `llm-gemini` en version 0.31 intègre officiellement le modèle `gemini-3.1-flash-lite` en stable, te permettant d'interroger Google Gemini directement depuis ta CLI pour du scripting, du debugging ou de l'automatisation sans jamais ouvrir un navigateur.

### Quand Gemini débarque dans ton workflow CLI

Simon Willison a construit un écosystème incroyablement pratique autour de son outil `llm` : un CLI Python qui sert de hub universel pour discuter avec des modèles de langage. L'idée est simple mais brillante : au lieu d'avoir une interface dédiée pour OpenAI, un script maison pour Anthropic et un notebook pour Google, tu passes par un seul outil normalisé. Chaque fournisseur devient un plugin. Le plugin `llm-gemini`, maintenu par Willison et disponible sur son dépôt habituel, fait exactement ce pont entre cette toolchain et l'API Google Gemini. Avec la release 0.31, ce n'est pas juste une mise à jour de numéro : le modèle `gemini-3.1-flash-lite` sort officiellement du statut preview et devient une option de production fiable pour tous tes scripts. Cela signifie que Google garantit désormais la stabilité du modèle et de son prix, ce qui transforme un gadget sympathique en outil d'infrastructure que tu peux lancer en cron sans sueur froide.

### Flash-Lite stable : l'arme secrète du batch processing

On connaît Gemini Pro pour sa polyvalence et sa capacité à ingérer des contextes faramineux, mais Flash-Lite, c'est l'autre extrémité du spectre. C'est le modèle rapide, léger et imbattable sur le rapport qualité/prix, spécialement conçu pour les tâches répétitives où la latence et le coût comptent plus que la créativité poussée. Tant qu'il était en preview, l'utiliser en automatisation relevant du bricolage : les comportements pouvaient changer d'une semaine à l'autre, la documentation était flottante, et surtout, tu ne pouvais pas fonder un workflow critique dessus. Maintenant que Google le considère comme final, tu peux l'intégrer dans tes chaînes CI, tes scripts de monitoring ou tes outils internes sans craindre une régression surprise à trois heures du matin. Pour un sysadmin qui veut résumer cinq cents lignes de logs brutes ou un dev qui génère des descriptions de commit en masse, c'est un game changer silencieux. Surtout, Flash-Lite conserve l'avantage principal de la famille Gemini : un context window colossal pour quelques centimes, ce qui le rend parfait pour l'analyse de fichiers volumineux directement en ligne de commande sans découpage manuel.

### Trois commandes pour être opérationnel

Tu ouvres ton terminal. Si ce n'est pas déjà fait, tu installes le coeur de l'outil avec `pip install llm`. Ensuite, tu ajoutes le plugin Google : `llm install llm-gemini`. Tu récupères ta clé API sur Google AI Studio, puis tu la configures via `llm keys set gemini`, où tu colles ta clé à l'invite. C'est tout. Pour vérifier que tout roule, tu lances un test simple : `llm -m gemini-3.1-flash-lite "Explique cette erreur : connection reset by peer"`. La réponse apparaît directement dans ton terminal, prête à être pipée dans un fichier ou relue par un autre outil. Pas de JSON à parser à la main, pas de curl biscornu, pas de gestion manuelle des en-têtes d'authentification : le plugin gère la négociation avec l'API Google et te ressort du texte propre. Tu peux même créer un alias dans ton shell pour éviter de taper le nom du modèle à chaque fois, ou utiliser le système de templates intégré à `llm` pour pré-enregistrer tes prompts les plus courants. Par exemple, `cat /var/log/nginx/error.log | llm -m gemini-3.1-flash-lite -t sumup` te donne un compte-rendu instantané si tu as défini un template `sumup`. Si tu veux creuser les options avancées, les templates de prompt ou le mode conversation, le dépôt du projet reste la référence : https://github.com/simonw/llm-gemini.

### Ce que tu vas vraiment en faire

Imagine cette fin de journée où un conteneur Docker refuse de démarrer et te crache cinquante lignes d'erreur Java absconses. Au lieu de switcher sur un navigateur, tu fais un copier-coller dans ton terminal et tu demandes à Flash-Lite de te réduire ça à trois lignes d'explication technique. Ou ce moment où tu dois transformer un fichier CSV mal formé et que tu n'as pas la motivation de réécrire un script Python : tu décris ta problématique au modèle, il te crache un one-liner `awk` ou `jq` fonctionnel du premier coup. Pour les développeurs, c'est aussi pratique pour générer rapidement des docstrings ou des tests unitaires à partir d'une signature de fonction, directement depuis l'éditeur si tu as un terminal intégré. Pour les sysadmins, c'est redoutable pour analyser des configurations legacy : tu balances un bloc de conf Nginx ou Apache incompréhensible datant de 2015, et le modèle te le traduit en directives modernes avec les warnings sur les options dépréciées. Le tout reste scriptable : tu peux pipe un `journalctl --since "1 hour ago" | llm -m gemini-3.1-flash-lite "extrais les IPs suspectes et leur nombre de tentatives échouées par minute"` et obtenir un tableau exploitable immédiatement. Mieux encore, comme le coût par token de Flash-Lite est ridiculement bas, tu n'hésites pas à lancer ces requêtes en boucle sur des dizaines de fichiers ou des gros dossiers de logs sans surveiller ta facture comme un rapace.

### Pourquoi cette 0.31 change la donne

Ce qui rend cette release significative, c'est le signal qu'elle envoie à l'écosystème. Google considère que Flash-Lite est mûr pour la production. Willison valide cette stabilité en l'intégrant proprement dans son plugin sans flag expérimental. Résultat, tu as une stack CLI complète, fiable et économique pour greffer de l'intelligence sur tes workflows existants. Pas besoin d'apprendre une nouvelle SDK Google, pas besoin de gérer toi-même les retries, le rate limiting ou le formatage des prompts. Tu restes dans ton environnement naturel, celui où `grep`, `sed` et `jq` règnent en maîtres, et tu ajoutes simplement Gemini comme un outil de plus dans ta boîte à outils Unix. Cette approche uniforme, où chaque modèle devient une option interchangeable dans une commande standardisée, change radicalement la manière dont on intègre l'IA au quotidien. Si tu cherches un moyen concret d'intégrer un LLM à ton quotidien de tech sans encombrer ton bureau de fenêtres web et sans vider ton portefeuille, `llm-gemini` 0.31 est probablement le meilleur point d'entrée actuel.