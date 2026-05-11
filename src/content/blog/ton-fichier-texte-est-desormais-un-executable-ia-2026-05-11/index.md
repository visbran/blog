---
title: "Ton fichier texte est désormais un exécutable IA"
description: "On a tous ce dossier `~/bin` qui pèse trois tonnes de bricolage : alias Zsh abscons, scripts Python de cinq lignes qui en appellent trois cents via `openai..."
publishDate: '2026-05-11T19:41:32.462Z'
tags:
  - llm-cli
  - shebang
  - unix-workflow
  - prompt-as-code
language: fr
draft: false
automated: true
contentType: workflow
sources:
  - "https://simonwillison.net/2026/May/11/llm-shebang/#atom-everything"
---

## Ton fichier texte est désormais un exécutable IA

On a tous ce dossier `~/bin` qui pèse trois tonnes de bricolage : alias Zsh abscons, scripts Python de cinq lignes qui en appellent trois cents via `openai.ChatCompletion.create`, des one-liners `curl` copiés à l'arrache sur StackOverflow. Et si la frontière entre "fichier texte" et "outil IA" ne tenait plus qu'à une ligne de permission et une ligne de shebang ? C'est l'idée d'une élégance brutale, popularisée par une TIL de Simon Willison : utiliser sa CLI `llm` directement comme interpréteur système. Fini les wrappers, fini le boilerplate. Tu écris ta consigne dans un fichier, tu le rends exécutable, et le noyau s'occupe du reste.

> **TL;DR** : En mettant `#!/usr/bin/env llm` en tête d'un fichier et en faisant `chmod +x`, tu transformes ce fichier en script shell natif dont le contenu est envoyé comme prompt à un LLM, prêt à être chaîné via des pipes Unix.

### Le binaire qui colle le tout

Tout repose sur `llm`, l'outil en ligne de commande que Simon Willison maintient. Si tu ne l'as pas encore, l'installation est ridicule : un simple `pip install llm`. Ensuite, une seule commande pour stocker ta clé API — `llm keys set openai` (ou `anthropic`, `gemini`, `groq`, peu importe ton fournisseur) — et c'est réglé. Tu peux même fixer un modèle par défaut avec `llm models default gpt-4o` pour ne pas avoir à préciser `-m` à chaque appel. C'est léger, sans daemon, sans interface web, et il sait parler à quasiment tous les endpoints du marché, y compris Ollama en local. Bref, c'est l'outil idéal pour bricoler des workflows IA directement dans le terminal, sans ouvrir VS Code ni écrire une seule ligne de Python.

### Comment le noyau parle à l'API

Le shebang, c'est cette première ligne qui dit au noyau quel binaire lancer quand tu exécutes un fichier. Classiquement, c'est `#!/usr/bin/env python3`. Ici, on remplace l'interpréteur par notre CLI `llm`. Quand tu crées un fichier nommé `corrige-moi`, que tu mets `#!/usr/bin/env llm` en haut, et que tu fais `chmod +x corrige-moi` suivi de `./corrige-moi`, le système lance `llm` en lui passant le chemin du fichier en argument. La CLI ingère alors le contenu du fichier — tout ce qui suit la ligne shebang — et l'expédie comme prompt au modèle configuré. Le fichier *est* la requête. Tu obtiens la réponse directement dans ton terminal, comme si tu avais tout tapé à la main, mais avec un outil reproductible, versionnable, et modifiable à la volée.

### Deux exemples prêts à l'emploi

**Premier use case : le correcteur orthographique pipeable.**

Crée un fichier `corrige-orthographe` :

```
#!/usr/bin/env llm
Tu es un correcteur brutal et concis. Corrige l'orthographe et la grammaire du texte ci-dessous. Ne justifie rien, ne donne aucun contexte supplémentaire, sors uniquement le texte corrigé.
```

Rends-le exécutable (`chmod +x corrige-orthographe`). Maintenant, pour corriger n'importe quel texte :

```bash
cat brouillon.txt | ./corrige-orthographe
```

La consigne vit dans le fichier exécutable ; le contenu à traiter arrive par `stdin`, natif, propre, chaînable avec n'importe quel autre outil Unix. Tu peux même rediriger la sortie ailleurs sans effort.

**Deuxième use case : le générateur de messages de commit.**

Crée `genere-commit` :

```
#!/usr/bin/env llm
Résume les modifications suivantes en un message de commit Git au format conventionnel (titre uniquement, impératif présent, 50 caractères max).
```

Utilisation immédiate :

```bash
git diff --cached | ./genere-commit
```

Pas besoin d'installer un plugin Git ou un tool Node qui pèse deux cents dépendances. Tu as un prompt spécifique, encapsulé dans un exécutable que tu peux copier d'un projet à l'autre, modifier à la volée, ou pousser sur un dépôt dotfiles pour le retrouver partout.

### Pourquoi ce pattern est une pépite

Ce qui change radicalement, c'est la friction. Avant, transformer une idée de prompt en outil réutilisable impliquait soit de se taper un script Python avec gestion des clés API et des retries, soit de créer un alias bash hermétique à base de `curl` et de `jq`. Avec le shebang `llm`, tu obtiens l'essence même de la philosophie Unix : un outil qui fait une chose, bien, et qui se compose via `|`, `>`, ou `&&`. Tes prompts deviennent des citoyens de première classe dans ton système : ils vivent dans `~/bin`, ils sont versionnés dans Git, ils suivent la même logique que n'importe quel autre script d'administration. Tu ne traites plus l'IA comme une application séparée, mais comme une couche système au même titre que `sed`, `awk` ou `grep`. Besoin d'un avis sur un diff ? D'un résumé de log ? D'une traduction rapide ? C'est désormais un fichier exécutable parmi les autres.

### Les pièges à éviter

Restons pragmatiques. Chaque exécution est un appel réseau (ou un déclenchement de modèle local), donc n'enferme surtout pas ça dans une boucle `for` qui traite dix mille fichiers, sauf si tu as le temps de boire trois cafés entre chaque itération. Pense aussi à la facture : si tu branches ça dans un pipeline CI sans garde-fou, prépare-toi à une surprise sur le prochain relevé. Enfin, et c'est crucial : tout le contenu du fichier part chez le fournisseur de modèle. Ne place jamais de clés privées, de données personnelles ou de secrets d'entreprise dans le corps de ton script shebangé. Le traitement local avec Ollama règle ce souci de confidentialité, mais la latence sera alors celle de ton GPU. Et évidemment, `llm` doit être présent dans ton `PATH`, sinon le noyau ne trouvera rien à exécuter.