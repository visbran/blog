---
title: "Digest IA — 11 mai 2026"
description: "La semaine dernière, Boris Cherny a lâché un thread sur X. Rien de spectaculaire à priori, juste quelques notes sur comment il utilise son propre outil au ..."
publishDate: '2026-05-11T18:09:19.413Z'
tags:
  - digest
  - ia
  - veille
language: fr
draft: false
automated: true
contentType: digest
sources:
  - "https://venturebeat.com/infrastructure/railway-secures-usd100-million-to-challenge-aws-with-ai-native-cloud"
  - "https://venturebeat.com/infrastructure/claude-code-costs-up-to-usd200-a-month-goose-does-the-same-thing-for-free"
  - "https://venturebeat.com/technology/listen-labs-raises-usd69m-after-viral-billboard-hiring-stunt-to-scale-ai"
  - "https://venturebeat.com/technology/salesforce-rolls-out-new-slackbot-ai-agent-as-it-battles-microsoft-and"
  - "https://venturebeat.com/technology/anthropic-launches-cowork-a-claude-desktop-agent-that-works-in-your-files-no"
  - "https://venturebeat.com/technology/nous-researchs-nouscoder-14b-is-an-open-source-coding-model-landing-right-in"
  - "https://venturebeat.com/technology/the-creator-of-claude-code-just-revealed-his-workflow-and-developers-are"
---

## Le créateur de Claude Code vient de balancer son workflow : voici pourquoi tu devrais tout piquer

La semaine dernière, Boris Cherny a lâché un thread sur X. Rien de spectaculaire à priori, juste quelques notes sur comment il utilise son propre outil au quotidien. Sauf que Cherny n'est pas n'importe qui : c'est le créateur et le lead de Claude Code chez Anthropic. Et en quelques jours, toute l'ingénierie mondiale s'est mise à décortiquer chaque phrase. Pas par fanatisme, mais parce que ce mec shippe plus vite avec son agent que la plupart des équipes avec dix développeurs.

Le plus dingue ? Son équipe vient de prouver que ce n'était pas du bluff. Cowork, le nouvel agent desktop d'Anthropic qui fouille dans tes fichiers sans te demander de coder, a été construit en environ une semaine et demie. Principalement par Claude Code lui-même. Si tu cherches encore la preuve que les agents IA ne sont pas un gadget, elle vient de tomber. Et elle change la donne pour ton workflow.

### Arrête de traiter ton agent comme un stagiaire

Le premier réflexe quand on débarque sur Claude Code, Goose ou n'importe quel agent terminal, c'est de se mettre à la place du chef de projet. Tu découpes la tâche en quinze micro-étapes, tu rédiges des prompts ultra-détaillés, tu vérifies chaque ligne de code avant de la valider. Résultat : tu passes ton temps à manager une IA au lieu de coder.

Ce que révèle l'approche de Cherny, c'est exactement l'inverse. Tu lui donnes un objectif macro, tu décris le contexte une bonne fois, et tu le lâsses dans le répertoire. L'agent n'est pas ton exécutant, c'est ton pair senior. Il explore, il teste, il échoue, il corrige. Tout seul.

L'implication pour ton quotidien est brutale. Si tu dois refactoriser un module legacy ou migrer une API, n'écris pas un prompt par fonction. Balance le dossier, explique la cible, et laisse l'agent proposer une stratégie globale. Oui, il va parfois dériver. Mais le temps que tu gagnes en ne micro-gérant pas compense largement les deux ou trois itérations de correction. La vraie compétence n'est plus d'écrire du code, c'est de formuler l'intention et de juger le résultat.

### L'outil qui se mange lui-même

Anthropic ne fait pas que prêcher, elle applique. L'équipe a développé Cowork — cet agent desktop qui étend Claude Code aux utilisateurs non-techniques pour qu'ils travaillent directement dans leurs fichiers — en dix jours, en utilisant massivement Claude Code. Ce n'est pas une démo marketing. C'est du dogfood radical, et ça montre à quel point le workflow est mature.

Pour toi, sysadmin ou développeur, ça veut dire quoi ? Que tu peux désormais passer d'une idée à un prototype fonctionnel dans un temps ridicule. Pas besoin de monter une architecture complète pour un script d'automatisation interne. Tu décrives le besoin à l'agent, il génère le code, il le teste, il te livre. Ton rôle se déplace vers la validation et l'intégration.

Pense à toutes ces tâches que tu repousses parce qu'elles sont chiantes : nettoyer des logs, renommer des assets en masse, générer des rapports de conformité à partir de CSV épars. Avec ce workflow, tu ne touches plus à ces sujets. Tu les délègues à l'agent en langage naturel et tu récupères le livrable. Le gain n'est pas seulement technique, il est cognitif. Tu libères de la RAM mentale pour te concentrer sur l'architecture et les vrais problèmes.

### Quand l'agent sort du terminal

Cowork n'est pas qu'une news pour les marketeurs qui veulent trier leurs Excel. Pour l'équipe technique, c'est un signal fort : l'agentisme ne se limite plus à l'IDE. L'agent va désormais circuler dans ton système de fichiers, tes documents, tes bases de données locales, et exécuter des actions en ton nom.

Si tu administres des infrastructures ou des pipelines, imagine la suite. Au lieu d'écrire un playbook Ansible ou un script Bash pour une opération ponctuelle, tu demandes à l'agent d'explorer la structure, d'identifier les incohérences et de proposer un correctif. Il peut générer la documentation associée, mettre à jour les schémas, et même préparer le commit. Tout ça sans que tu quittes ton bureau.

La différence avec l'automatisation classique, c'est la plasticité. Un script fait une chose prévue. Un agent adapte sa stratégie selon ce qu'il découvre. Cowork popularise cette approche pour les non-devs, mais toi, tu peux l'exploiter bien plus loin. Combine ça avec des outils comme n8n ou des webhooks maison, et tu obtiens un collègue silencieux qui traite la partie ingrate de ton job.

### Et si tu ne veux pas payer 200 dollars par mois ?

Claude Code est un outil redoutable, mais sa tarification grimpe jusqu'à 200 dollars mensuels. Pour un freelance ou une petite équipe, c'est violent. Heureusement, l'écosystème ne se limite pas à Anthropic. Goose, par exemple, propose une expérience très similaire — agent terminal autonome, capable d'écrire, déboguer et déployer — gratuitement.

L'important n'est pas tant l'outil que la méthode. Le workflow de Cherny fonctionne avec n'importe quel agent suffisamment robuste. Tu peux donc reproduire la boucle d'autonomie avec Goose ou d'autres alternatives open source, tester la philosophie du lâcher-prise sur un projet personnel, et décider ensuite si tu investis dans un modèle premium pour la production.

Mon conseil : ne cherche pas à dupliquer la stack exacte d'Anthropic. Teste l'approche. Prends une tâche que tu avais prévue de faire cet après-midi, ouvre un agent dans ton terminal, décris-lui l'objectif en une phrase, et observe. Si tu reprends la main toutes les deux minutes, tu fais fausse route.

### Ton prochain projet ne mérite pas d'être codé à la main

La promesse des agents n'est plus d'assister ton écriture de code. C'est de supprimer l'étape d'écriture quand elle n'apporte pas de valeur. Boris Cherny et son équipe viennent de te montrer qu'on peut bâtir un produit entier en dix jours en laissant l'IA tenir le volant.

Ton action immédiate ? Choisis une corvée technique qui traîne depuis des semaines. Ouvre Claude Code, Goose, ou l'agent de ton choix. Donne-lui le contexte minimal nécessaire et l'objectif final. Puis recule d'un pas. Laisse-le planter, corriger, replanter, converger. Tu vas probablement être surpris par la qualité du résultat — et surtout, par le temps que tu as récupéré.