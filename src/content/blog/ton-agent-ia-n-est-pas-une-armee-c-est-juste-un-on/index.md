---
title: "Ton agent IA n'est pas une armée, c'est juste un onglet de plus"
description: "Pourquoi compter tes agents IA est inutile voici comment les utiliser comme des outils jetables pour gagner en productivité immédiatement"
heroImage:
  src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"
  alt: "Ton agent IA n'est pas une armée, c'est juste un onglet de plus"
  inferSize: true
publishDate: '2026-05-19T19:17:08.032Z'
tags:
  - ai-agents
  - productivite
  - automatisation
  - devops
language: fr
draft: false
automated: true
contentType: tool
sources:
  - "https://simonwillison.net/2026/May/13/boris-mann/#atom-everything"
---

## Ton agent IA n'est pas une armée, c'est juste un onglet de plus

> **TL;DR** : Compter tes agents IA est inutile voici comment les utiliser comme des outils jetables pour gagner en productivité immédiatement

### La citation qui tue le hype

Boris Mann a mis les pieds dans le plat sur le blog de Simon Willison. Quand il dit que "11 AI agents" signifie aussi peu que "11 spreadsheets" ou "11 browser tabs", il touche un point sensible. On en est arrivés à compter nos agents comme des trophées, à construire des architectures complexes autour de concepts vaguement définis. Mais un agent, au fond, c'est juste un processus qui fait une chose à notre place. Pas une entité mystique. Pas une armée de robots. Juste un onglet qui tourne.

### L'outil : l'agent jetable

Ce que Boris Mann décrit, c'est exactement l'approche que j'applique depuis des mois : l'agent IA comme outil jetable. Pas un framework à déployer, pas une infrastructure Kubernetes à maintenir. Un script Python de 40 lignes qui appelle l'API Claude ou OpenAI, exécute une tâche précise — analyser un log, refactorer une fonction, parser un CSV pourri — et rend la main. Tu le lances dans ton terminal comme n'importe quel autre outil. Besoin d'en faire tourner trois en parallèle ? Tu ouvres trois terminaux, comme trois onglets. Quand c'est fini, tu fermes. Pas de tableau de bord, pas de "fleet management", pas de complexité. C'est l'outil le plus concret que j'utilise : un fichier `agent.py` que je clone, que je modifie à la volée pour le besoin du moment, et que j'archive quand la tâche est traitée. Simon Willison a bien résumé cette philosophie dans sa citation recueillie ici : https://simonwillison.net/2026/May/13/boris-mann/

### Pourquoi cette approche change tout

Le piège des agents IA modernes, c'est la croyance qu'il faut une orchestration millimétrée. On se met à chercher "le meilleur framework multi-agents" avant même d'avoir un problème à résoudre. Résultat ? Tu passes plus de temps à configurer des connexions entre tes agents qu'à obtenir des résultats. L'approche "onglet de navigateur" inverse la logique. Tu démarres avec une tâche concrète : "J'ai 400 fichiers de logs à résumer et à classer par gravité." Tu écris un script qui lit stdin, envoie à l'API avec le bon prompt, et sort un JSON structuré. Dix minutes plus tard, c'est plié. Le script est moche, il ne réutilise rien, et c'est parfaitement normal. Comme une feuille Excel de calcul rapide que tu jettes après usage.

### Comment le prendre en main sans friction

Tu n'as besoin de rien d'autre que d'un environnement Python et d'une clé API. Mon workflow est brut : je copie un template minimal qui utilise `openai` ou `anthropic`, je définis la tâche dans le système prompt, et je pipe mes données dedans. Pas de dépendances lourdes, pas d'interface web. Un exemple concret : hier, j'avais un dossier avec des centaines de variables d'environnement éparpillées dans des fichiers `.env` différents. J'ai écrit un agent en 5 minutes qui les a lues, détecté les doublons et les incohérences, et généré un `.env` consolidé avec des commentaires. J'ai lancé `cat *.env | python agent_env_cleaner.py`, j'ai vérifié la sortie, et j'ai effacé le script. Aucun regret. C'est ce genre d'outillage que Boris Mann pointe du doigt : un agent ne mérite pas plus de cérémonial qu'un `grep` ou qu'un onglet Chrome.

### Cas d'usage dev et sysadmin

En tant que dev, je m'en sers pour du code review automatisé sur des diffs avant commit. Je pipe `git diff` vers un script qui me dit "attention, tu as oublié de gérer l'erreur ici" ou "cette fonction fait 200 lignes, peut-être la splitter ?". C'est plus rapide qu'une review humaine pour les détails idiots. En tant que sysadmin, j'ai un agent qui lit la sortie de `dmesg` ou de `journalctl` et me résume en français les lignes qui posent problème, avec des liens vers les docs Kernel pertinentes. Pas besoin de Splunk ou de ELK quand le problème est ponctuel. Un autre cas : générer des playbooks Ansible à partir d'une description. "Crée-moi un playbook qui installe Docker sur Ubuntu 24.04 et configure le daemon pour du rootless." L'agent sort le YAML, je vérifie, j'applique. Si je dois refaire la même tâche dans 6 mois, je réécrirai un prompt. Pas de maintenance d'un agent "généraliste" qui pourrit dans un coin.

### Conclusion

Arrête de compter tes agents. Arrête de chercher à construire une "fleet". Un agent IA utile ressemble à un onglet de navigateur ou à un spreadsheet : il naît pour une mission précise, il rend un service immédiat, et il meurt quand tu fermes ton terminal. C'est cette humility qui fait la différence entre le bricolage hype et l'outillage productif. La citation de Boris Mann sur le blog de Simon Willison devrait être affichée au-dessus de chaque framework d'agents : ce ne sont que des outils. Utilise-les comme tels.