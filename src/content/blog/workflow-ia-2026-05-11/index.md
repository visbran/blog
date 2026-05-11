---
title: "Claude Code costs up to $200 a month. Goose does the same thing for free."
description: "Tu connais le refrain. On te vend la révolution agentique, le développeur augmenté, l'IA qui commit à ta place. Et au moment de passer en production — de t..."
publishDate: '2026-05-11T18:25:49.138Z'
tags:
  - workflow
  - automatisation
  - ia
language: fr
draft: false
automated: true
contentType: workflow
sources:
  - "https://venturebeat.com/infrastructure/claude-code-costs-up-to-usd200-a-month-goose-does-the-same-thing-for-free"
---

## Claude Code te facture 200 $. Goose fait le même taf. Gratuit.

Tu connais le refrain. On te vend la révolution agentique, le développeur augmenté, l'IA qui commit à ta place. Et au moment de passer en production — de ton côté de l'écran — Anthropic te présente la note : entre 20 et 200 dollars par mois pour Claude Code. Pour un terminal qui appelle un LLM. Sauf que ton terminal, tu l'as déjà. Et l'agent, il existe en open source. Il s'appelle Goose. Il est développé par Block — oui, les anciens de Square — et il ne te demande pas un abonnement. Il te demande juste de l'installer.

### Pourquoi payer quand le terminal suffit ?

Claude Code est un bon produit. Il lit ton repo, édite tes fichiers, lance des commandes, déploie. Mais son prix n'est pas lié à la magie technique, il est lié au monopole temporaire. Derrière, c'est une API qui bouffe des tokens. Goose reprend exactement ce principe d'agent autonome dans le terminal, sauf que le logiciel est ouvert. Tu le contrôles. Tu choisis quel modèle alimente l'agent. Tu veux du local gratuit avec Ollama et un Qwen 2.5 Coder ? Go. Tu préfères brancher ta clé API Anthropic ou OpenAI à la consommation, sans forfait mensuel ? C'est aussi possible. La différence fondamentale : Goose est un outil, pas un service. Tu ne loues pas une promesse, tu configures une machine.

### La stack zéro abonnement

Voici ce que tu installes ce soir. Sur macOS ou Linux — Windows avec WSL fonctionne aussi — tu ouvres ton terminal. Si tu as Rust, tu fais `cargo install goose-cli`. Sinon, Homebrew te sauve : `brew install goose`. C'est le binaire. Pas de Docker à tirer, pas de tableau de bord cloud. Ensuite, tu initialises la configuration avec `goose configure`. Le CLI te demande quel provider LLM tu veux. C'est là que tout bascule.

Si tu vises le 100 % gratuit et offline, tu pointes vers Ollama. Assure-toi que ton serveur local tourne — `ollama serve` — et sélectionne un modèle de code robuste. Qwen 2.5 Coder 14B ou DeepSeek Coder V2 en 16B tiennent la route pour du scripting et de la maintenance. Ils tournent sur une RTX 4060 ou un Mac M3 Pro sans suer. Tu valides, et Goose discute avec ton localhost. Aucun token ne quitte ta machine, aucune facture ne tombe.

Si tu as besoin de puissance pour du code complexe — architecture lourde, refactorings transversaux — branche plutôt une clé API sur OpenRouter ou directement Claude ou OpenAI. Tu paies à la consommation, ce que tu utilises, quand tu l'utilises. Pas 200 $ prélevés le premier du mois parce que tu as eu un pic pendant trois jours.

### Le workflow en pratique

Tu entres dans ton repo. Tu lances `goose session`. L'agent s'éveille dans ton terminal. Il connaît déjà le contexte du dossier. Tu lui expliques le problème comme à un collègue : « Ce endpoint API ralentit depuis la dernière release, trouve la requête N+1 et patch-la. » Goose commence par un plan. Il te montre ce qu'il va toucher. Tu valides. Il édite alors directement les fichiers avec des appels outils intégrés — lecture, écriture, sed, commande shell. Tu le vois faire en temps réel. Il lance les tests avec `cargo test` ou `pytest`. S'il plante, il lit stderr, corrige, recommence.

Le secret pour que ce soit reproductible chez toi, c'est la boucle. Tu ne donnes pas un prompt de vingt lignes. Tu lui assignes une tâche atomique : un bug, un refactor, un scaffold. Goose travaille en mode itératif. Toi, tu restes dans ton éditeur — VS Code, Zed, Neovim — avec un terminal tmux à côté. L'agent vit dans le panneau de droite, ton code dans celui de gauche. Tu verifies chaque diff avant de commit. Ce n'est pas un remplacement de ton cerveau, c'est un stagiaire de terminal qui ne dort jamais et qui n'a pas besoin d'accès Slack.

Quand la session est propre, tu quittes avec `/exit`. Goose résume ce qu'il a fait. Tu relis le `git diff`, tu amend si besoin, tu pousses. Le tout sans quitter ton environnement habituel.

### Ce que tu gagnes concrètement

Le premier gain, c'est évident : tu gardes 200 $ par mois dans ta poche. Mais le vrai bénéfice est ailleurs. C'est la liberté de modèle. Claude Code te force dans l'écosystème Anthropic. Goose est agnostique. Demain, si DeepSeek sort un modèle cinq fois moins cher, tu changes deux lignes dans ton `~/.config/goose/config.yaml` et tu rebascules. Pas de migration, pas de rupture de service.

Deuxième gain : la transparence. Goose est open source. Tu sais exactement quel contexte il envoie, comment il structure ses appels outils. Pas de boîte noire qui ingère ton codebase entière pour entraîner un modèle tiers sans ton consentement — un risque réel avec les services closed-source.

Troisième point, et pas des moindres : la latence locale. Avec Ollama, tes requêtes ne partent pas sur Internet. L'agent répond en quelques secondes, même offline. Parfait pour coder dans le train, en avion, ou simplement quand le wifi de ton coworking décide de rendre l'âme.

Attention quand même : un modèle local de 14B ne rédige pas une architecture microservices from scratch avec la même élégance qu'un Claude 3.7 Sonnet. Il faut calibrer. Local pour le grunt work — tests, doc, refactors mécaniques. API à la consommation pour la conception abstraite. La règle d'or : Goose ne fait pas le café, il exécute ce que tu décides.

Tu n'as pas besoin d'un abonnement premium pour avoir un agent dans ton terminal. Tu as besoin d'un binaire de 30 Mo, d'un modèle — local ou payant à l'acte — et d'un peu de discipline dans tes sessions. Goose prouve que l'agent IA n'est pas une fonctionnalité SaaS, c'est une couche d'abstraction open source. Alors avant de rentrer dans le funnel de paiement d'Anthropic, teste l'alternative ce weekend. Installe-le sur un vrai projet, donne-lui une tâche de merde que tu repousses depuis deux semaines, et regarde-le bosser. Ton portefeuille et ton opssec te remercieront.