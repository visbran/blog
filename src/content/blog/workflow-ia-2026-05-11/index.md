---
title: "Remplace Claude Code par Goose : le workflow agent IA gratuit qui tient dans ton terminal"
description: "Tu connais le refrain. On te vend la révolution de la programmation autonome, l'agent qui écrit, débogue et déploie tout seul dans ton terminal. Ça marche...."
publishDate: '2026-05-11T18:42:19.447Z'
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

## Remplace Claude Code par Goose : le workflow agent IA gratuit qui tient dans ton terminal

Tu connais le refrain. On te vend la révolution de la programmation autonome, l'agent qui écrit, débogue et déploie tout seul dans ton terminal. Ça marche. C'est bluffant. Et puis tu regardes le prix : vingt à deux cents dollars par mois pour Claude Code, abonnement obligatoire, tarification opaque. Anthropic tient le produit, toi tu tiens la carte bleue. Ça suffit. Il existe une alternative open source qui fait exactement la même chose sans te prendre un centime : Goose, développé par Block. Même principe, même puissance, zéro bullshit commercial. Voici comment tu bascules ton workflow quotidien dessus en moins de dix minutes.

### Arrête de payer pour ce qui devrait être un outil, pas un abonnement

Claude Code a un mérite : il a prouvé qu'un agent IA directement dans le shell change la donne. Tu lui décris une feature en français, il explore ta codebase, modifie les fichiers, lance les tests, corrige les erreurs à la volée. Le problème, c'est le modèle économique. Tu payes un forfait mensuel pour accéder à un logiciel qui, au fond, n'est qu'une interface entre toi et un modèle de langage. Goose démonte cette logique. C'est un agent CLI open source qui s'installe localement, se connecte à l'API de ton choix et exécute les mêmes actions : lecture du contexte, génération de code, manipulation de fichiers, exécution de commandes. La différence ? Tu contrôles la facture. Tu branches ta propre clé API, tu choisis ton provider, et tu ne payes que les tokens que tu consommes. Souvent, avec un modèle comme Claude 3.5 Sonnet via OpenRouter, une journée de dev intense coûte moins cher qu'un café. Le reste du temps, c'est gratuit.

### Ce qu'il te faut avant de te lancer

Pas besoin d'un monstre de PC ou d'un compte d'entreprise. Tu récupères un terminal sous macOS, Linux ou WSL sur Windows. Tu t'assures que Node ou ton environnement de base est à jour, mais l'essentiel est ailleurs. Goose te demande juste un provider LLM et une clé API. Crée-toi un compte sur OpenRouter si tu veux de la flexibilité, ou garde ta clé Anthropic, OpenAI ou Google existante. Le truc intelligent, c'est de stocker cette clé dans une variable d'environnement dans ton `.bashrc` ou `.zshrc`. Ainsi, Goose la récupère automatiquement au lancement sans que tu aies à la coller dans un fichier de config visible. Ensuite, place-toi dans un repo Git propre. L'agent va lire l'arborescence, saisir la structure du projet et proposer des modifications. Si tu n'as pas de versionning, arrête tout et initialise un `git` maintenant. Goose est puissant, mais il n'est pas infaillible. Git est ton filet.

### L'installation sans friction

Récupère le binaire Goose pour ton OS depuis le dépôt officiel. Une ligne dans ton terminal pour le télécharger, un `chmod +x`, tu le déplaces dans un dossier présent dans ton PATH comme `/usr/local/bin`, et c'est réglé. Au premier lancement, Goose te guide. Il détecte ton shell, lit ta clé API dans l'environnement, et te demande quel modèle tu veux utiliser. Tu sélectionnes Claude 3.5 Sonnet, GPT-4o, ou même un modèle local si tu as Ollama tournant en arrière-plan. Pas d'interface graphique inutile, pas de création de compte chez un tiers. Tu confirmes, tu retombes dans ton projet, et le prompt de l'agent apparaît. Trois minutes montre en main, tu as un agent autonome prêt à bosser dans ton codebase.

### Ton workflow au quotidien avec Goose

Tu ouvres ton terminal, tu navigues jusqu'à ton projet, tu tapes `goose`. L'agent scanne le répertoire, indexe les fichiers importants, et te demande ce que tu veux faire. Là, tu passes en mode chef d'orchestre. Tu ne codes plus ligne par ligne : tu décris l'intention.

Imaginons un cas concret. Tu as une API Node.js moisie avec une route qui renvoie tout un catalogue sans pagination. Tu écris : "Ajoute la pagination par limit et offset sur la route /items, modifie le contrôleur et écris un test qui vérifie que le offset fonctionne." Goose lit le fichier de routes, trouve le contrôleur, génère le code avec `parseInt` sur les query params, met à jour la requête SQL ou l'appel Mongo, puis crée le fichier de test dans le dossier adapté. Il te montre chaque diff, te demande la permission d'écrire. Tu valides. Il lance les tests avec la commande définie dans ton `package.json`. Si un test échoue, il lit l'erreur, corrige l'import manquant ou la typo, relance. Quand c'est vert, il te propose un message de commit. Tu vérifies rapidement le diff, tu merges. Tâche terminée.

Autre exemple : tu dois refactorer un script Python de trois cents lignes bourré de fonctions dupliquées. Tu dis : "Découpe ce fichier en trois modules, sépare la logique métier du parsing CLI, et assure-toi que les imports soient propres." Goose découpe, crée les nouveaux fichiers, réécrit les appels, met à jour le `__init__.py`. Il vérifie que le script s'exécute toujours avec la commande d'origine. Tu n'as pas touché au clavier pour écrire une seule déclaration d'import.

Le reproductible, c'est cette boucle : description naturelle → génération → validation humaine → exécution → test → commit. Tu gardes la main à chaque étape, mais tu élimines le temps de friction mécanique.

### Ce que tu gagnes concrètement

Le premier gain, c'est financier. Tu ne subis plus un abonnement à deux cents dollars qui te fait culpabiliser les mois où tu codes moins. Tu paies à l'usage, au prix du marché des tokens, et si un jour tu branches un modèle local gratuit, la facture tombe à zéro. Le deuxième gain, c'est la souveraineté. Ton code reste sur ta machine, le contexte est local, tu n'uploades rien dans une interface propriétaire qui servira demain à entraîner le modèle du vendeur. Le troisième gain, c'est la flexibilité. Tu changes de modèle quand tu veux. Un projet legacy demande un modèle cheap et rapide ? Tu mets GPT-4o-mini. Une architecture complexe ? Tu switches sur Claude 3.5 Sonnet. Goose s'en fout, il exécute.

### La règle d'or pour pas te planter

Goose exécute ce que tu lui demandes, y compris les mauvaises idées. Ne lui donne jamais les droits de production sur un serveur distant sans filet. Commence par des tâches isolées : refactor, tests unitaires, documentation. Garde toujours un `git status` proche de toi. L'agent est un accélérateur, pas un pilote automatique. Tu restes au commandement, lui fait le sale boulot.

Ferme l'abonnement. Garde ton fric. Garde ton contrôle. Goose te donne exactement la même puissance, et cette fois, c'est toi qui tiens les clés.