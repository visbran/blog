---
title: "Simon Willison lance datasette-llm-limits : enfin un limiteur de budget pour tes LLM"
description: "Plugin Datasette pour limiter les dépenses LLM par utilisateur avec plafonds journaliers glissants, indispensable pour éviter les factures surprises"
heroImage:
  src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"
  alt: "Simon Willison lance datasette-llm-limits : enfin un limiteur de budget pour tes LLM"
  inferSize: true
publishDate: '2026-05-18T03:04:40.903Z'
tags:
  - datasette
  - llm
  - cost-control
  - plugin
language: fr
draft: false
automated: true
contentType: tool
sources:
  - "https://simonwillison.net/2026/May/15/datasette-llm-limits/#atom-everything"
---

## Simon Willison lance datasette-llm-limits : enfin un limiteur de budget pour tes LLM

> **TL;DR** : datasette-llm-limits est un plugin Datasette qui impose des plafonds de dépenses en USD par utilisateur via des fenêtres glissantes, histoire d'éviter les factures surprises sur tes appels LLM.

### Quand la confiance dans les LLM rencontre la réalité du portefeuille

Tu as déjà glissé une clé API LLM dans un outil interne en te disant que tes collègues étaient raisonnables ? Bien sûr. Et tu as déjà vu un script de test, une boucle mal terminée ou un interne enthousiaste transformer une exploration de données en session de rafale sur GPT-4o à trois heures du matin ? C'est exactement dans ces moments-là que tu comprends que la confiance n'exclut pas le contrôle. Surtout quand chaque appel débite de vrais centimes sur un compte qui n'est pas le tien, ou pire, le tien.

Simon Willison vient de publier [datasette-llm-limits 0.1a0](https://simonwillison.net/2026/May/15/datasette-llm-limits/), un plugin qui vient combler ce vide dans l'écosystème Datasette. Pas de tableau de bord complexe, pas de proxy réseau à configurer, pas d'interception manuelle des requêtes HTTP. Juste une limite claire et brutale : à partir de ce montant, l'accès est coupé.

### Un plugin qui parle en dollars, pas en tokens abstraits

La plupart des outils de rate limiting se contentent de compter les tokens ou les requêtes par minute. C'est pratique pour la stabilité technique, mais ça ne reflète absolument pas la réalité budgétaire. Un résumé long avec Claude 3.7 Sonnet coûte nettement plus cher qu'une classification rapide via un modèle léger. Limiter à "1000 requêtes" ne protège pas ton budget si ces requêtes envoient chacune quinze mille tokens de contexte.

datasette-llm-limits travaille directement en dollars. Il s'appuie sur datasette-llm-accountant pour tracer précisément le coût de chaque appel effectué via datasette-llm. Tu configures un plafond, par exemple un dollar par utilisateur sur une fenêtre glissante de vingt-quatre heures, et le plugin fait le reste. Quand un utilisateur atteint sa limite, Datasette refuse l'appel avant même qu'il ne parte vers l'API du fournisseur. C'est propre, c'est immédiat, et ça ne dépend pas d'une rétroaction compliquée.

La configuration se fait dans le fichier metadata de ton instance, sous le bloc plugins.datasette-llm-limits.limits. Tu définis une règle avec un scope — ici actor pour cibler chaque identité connectée —, une fenêtre rolling-24h, et un amount_usd. Pas une ligne de code métier à modifier, pas de décorateur Python à ajouter sur tes fonctions. Tu décris ta politique de dépense en YAML, et c'est en vigueur immédiatement.

### Intégrer ça sans te prendre la tête

L'installation passe par pip dans l'environnement de ton instance Datasette, comme n'importe quel plugin. Mais attention, ce n'est pas un outil autonome. Il faut que datasette-llm soit déjà en place pour exposer les fonctionnalités LLM dans l'interface, et surtout que datasette-llm-accountant soit actif pour le suivi des coûts. Sans l'accountant, le limiter n'a aucune donnée fiable sur laquelle se baser pour bloquer quoi que ce soit. C'est une chaîne : l'un compte, l'autre verrouille.

Une fois les trois briques installées, l'ajout de la règle est trivial. Tu crées une clé de limite, par exemple per-user-daily, tu lui donnes un scope actor, une fenêtre rolling-24h, et tu fixes le plafond à un dollar, ou cinq, ou cent, selon ton contexte. Tu peux imaginer des variantes comme une limite globale pour une instance publique, ou des fenêtres hebdomadaires pour des usages plus souples. L'essentiel est que ce soit entièrement déclaratif. Tu changes le YAML, tu redémarres si nécessaire, et la sécurité budgétaire est en place.

### Trois cas où ça te sauve la mise au quotidien

Premier scénario : l'outil interne pour l'équipe support. Tu déploies Datasette sur les logs d'application avec un LLM intégré pour aider à formuler du SQL ou résumer des traces d'erreurs. Sans garde-fou, un technicien peut lancer une analyse exploratoire sur six mois de données avec des prompts à rallonge et des itérations sans fin. Avec une limite d'un dollar par jour et par utilisateur, il apprend vite à affiner ses prompts, à tester sur des échantillons, et à ne pas traiter l'interface comme un chatbot personnel. Le budget force la qualité.

Deuxième cas : la démo publique. Tu veux montrer comment un LLM interroge un jeu de données ouvert, mais tu ne veux surtout pas que quelqu'un transforme ton endpoint en relai gratuit pour ses propres traitements. Une limite par acteur, même modeste, casse l'économie de l'attaque. Même si un utilisateur crée plusieurs comptes, la granularité par identité freine considérablement l'exploitation, surtout si tu couples ça avec une authentification minimale.

Troisième cas : les pipelines automatisés. Tu utilises datasette-llm via un service account pour enrichir des données en batch. Un bug introduit une boucle infinie qui appelle le modèle à répétition. Sans limite, tu le découvres à la fin du mois en voyant la facture. Avec une limite journalière configurée sur le compte technique, le pipeline s'arrête tout seul au bout du plafond. C'est brutal, mais c'est efficace. Ça te laisse le temps de corriger sans flamber.

### Alpha, mais déjà plus mature que ton script maison

Oui, c'est une 0.1a0. L'interface de configuration va évoluer, et on n'a pas encore de règles ultra-fines par modèle ou par complexité de requête. Mais le fond est solide, et c'est exactement ce qui manquait à l'écosystème Datasette pour passer de l'expérimentation sympathique à la production interne sereine. Entre datasette-llm qui apporte l'IA dans l'interface, datasette-llm-accountant qui compte précisément, et datasette-llm-limits qui verrouille, tu as une stack complète et cohérente pour servir des LLM en self-service sans risquer ta tranquillité financière.

Si tu fais déjà tourner des modèles dans Datasette, ou si tu envisages d'ouvrir ça à ton équipe, ne déploie plus rien sans ce plugin. La configuration prend cinq minutes. La facture non maîtrisée, elle, peut te prendre des mois à digérer.