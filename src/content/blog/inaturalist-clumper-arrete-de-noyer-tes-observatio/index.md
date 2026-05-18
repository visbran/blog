---
title: "iNaturalist-clumper : arrête de noyer tes observations dans un flux JSON infini"
description: "Simon Willison libère inaturalist-clumper, un outil Python qui regroupe automatiquement les observations iNaturalist par session de terrain pour transformer un "
heroImage:
  src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
  alt: "iNaturalist-clumper : arrête de noyer tes observations dans un flux JSON infini"
  inferSize: true
publishDate: '2026-05-16T03:02:09.338Z'
tags:
  - inaturalist
  - python
  - data-pipeline
  - automatisation
language: fr
draft: false
automated: true
contentType: tool
sources:
  - "https://simonwillison.net/2026/May/15/inaturalist-clumper/#atom-everything"
---

## iNaturalist-clumper : arrête de noyer tes observations dans un flux JSON infini

> **TL;DR** : Simon Willison a publié le code source de son outil qui regroupe automatiquement les observations iNaturalist par session de terrain pour transformer un tas de données plates en récits géolocalisés exploitables.

### T'as shooté quarante champignons sur le même sentier, et ton API te crache quarante objets

Si t'as jamais traîné sur iNaturalist, voici le topo : c'est une plateforme de sciences participatives où tu balances une photo d'une bestiole ou d'une plante, et une communauté (aidée par de la vision par ordinateur) te dit ce que c'est. C'est génial. Le problème, c'est quand tu sors d'une rando de trois heures avec cinquante observations. Ton téléphone a pris cinquante photos, cinquante GPS, cinquante timestamps. Quand tu récupères tout ça via l'API d'iNaturalist, tu obtiens cinquante objets JSON distincts. Cinquante. Sur le même sentier. À dix minutes d'intervalle maximum.

Pour un humain, c'est évident : c'était une seule sortie. Pour la machine, c'est un flux plat, bruité, à plat. Si tu veux publier ça sur un blog ou construire une page de statistiques, tu te retrouves avec une liste interminable qui donne envie à personne de scroller. C'est là que [inaturalist-clumper](https://simonwillison.net/2026/May/15/inaturalist-clumper/) entre en jeu. Willison utilise cet outil en production depuis quelques semaines pour alimenter son propre blog avec ses observations naturalistes, et il vient de le stabiliser en version 0.1.

### Clumper, c'est quoi ? Un rassembleur de données intelligent

L'idée est simple au point d'en être frustrant de ne pas y avoir pensé avant. L'outil prend ton export iNaturalist et regroupe les observations en "clumps" — des amas, des paquets, des sessions. Une observation isolée dans ton jardin à midi ? Un clump à elle seule. Vingt photos faites entre 14h00 et 16h30 dans le même rayon de quelques centaines de mètres ? Un seul clump. La logique repose sur la proximité temporelle et spatiale. Pas d'IA générative qui hallucine un récit poétique sur la biodiversité : juste une heuristique propre, probablement basée sur des seuils de temps et de distance, qui dit "ces points sont assez proches pour être la même sortie".

Le résultat, c'est un JSON complètement restructuré. Willison met d'ailleurs un exemple de sortie en ligne dans son annonce — tu passes d'un tableau plat d'observations à une arborescence de sessions de terrain. Chaque clump contient ses métadonnées : la fourchette horaire, la bounding box géographique, et la liste des observations qu'il englobe. C'est propre. C'est lisible. Et surtout, c'est prêt à être affiché.

### Pourquoi tu devrais t'en foutre, même si tu confonds un chou avec une salade

OK, t'es dev. T'es peut-être sysadmin. Tu t'en fiches des champignons. Mais réfléchis deux secondes à combien de fois tu te retrouves avec des logs, des métriques, ou des événements d'API qui arrivent au kilomètre et que tu dois présenter à des humains. Ta supervision te balance une alerte par seconde pendant quinze minutes : est-ce qu'afficher quinze alertes séparées a du sens, ou est-ce que ce qu'il te faut, c'est un unique incident "panne de 14h02 à 14h17" ? Ton utilisateur a uploadé trente photos d'un événement : est-ce que ton backend les traite comme trente transactions indépendantes, ou est-ce qu'il les regroupe en un seul album ?

[inaturalist-clumper](https://simonwillison.net/2026/May/15/inaturalist-clumper/), sous le coude, c'est exactement ce pattern. C'est un pipeline de transformation qui ajoute de la sémantique à des données brutes. Willison l'a construit pour son blog, mais le cas d'usage est universel : tu prends un flux chronologique, tu y injectes une logique de regroupement, et tu sors une structure hiérarchisée. Que ce soit pour des données naturalistes, des sessions utilisateur, ou des batchs de jobs CI qui tournent trop proches dans le temps.

### Comment tu le prends en main

Le projet est un outil Python classique dans l'écosystème de Willison. Tu l'installes, tu lui pointes soit un export JSON d'iNaturalist, soit tu le branches sur l'API directement, et il te recrache le tout organisé. La version 0.1 est déjà rodée : Willison précise qu'il la fait tourner en prod depuis plusieurs semaines, ce qui veut dire que les angles morts ont été grattés à l'usage. Pas de vaste documentation théorique, pas d'abstraction inutile : un outil qui fait un job précis et le fait bien.

Si tu veux t'en inspirer sans même utiliser iNaturalist, vas voir le code. Le principe de clustering spatio-temporel est réimplémentable en quelques dizaines de lignes dans n'importe quel langage. Tu as besoin de parser des timestamps, de calculer des distances entre coordonnées GPS (formule de Haversine, rien de sorcier), et de balayer ton tableau dans l'ordre chronologique pour créer des groupes quand les seuils sont respectés. C'est du bricolage algorithmique accessible, et c'est précisément ce genre de script qu'on oublie d'écrire parce qu'on se dit "je vais trier ça plus tard".

### Le fond du problème : la mise en forme, c'est aussi du travail d'infra

On passe beaucoup de temps à pomper des données d'API, mais on sous-estime le temps passé à les rendre digestes. inaturalist-clumper ne résout pas un problème d'IA ou de scalabilité : il résout un problème d'expérience de lecture. Et entre nous, dans la plupart des dashboards et des rapports que tu bosses, c'est souvent ça le vrai goulot d'étranglement. Pas la collecte. L'organisation.

Alors oui, l'outil parle d'oiseaux et de fleurs. Mais derrière, c'est un rappel salutaire : avant de balancer des données brutes dans ton frontend ou ton template de newsletter, demande-toi si un simple regroupement intelligent ne ferait pas gagner du temps à tout le monde. Willison a posé le sien en open source. À toi de voir ce que tu vas en faire.