---
title: "Génère des QR codes qui ne font pas pitié avec l'outil de Simon Willison"
description: "Génère des QR codes stylés pour URLs et WiFi avec l'outil gratuit de Simon Willison, prêt à copier ou exporter en PNG en quelques secondes"
heroImage:
  src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
  alt: "Génère des QR codes qui ne font pas pitié avec l'outil de Simon Willison"
  inferSize: true
publishDate: '2026-05-17T03:04:13.360Z'
tags:
  - qr-code
  - vibe-coding
  - outils-ia
  - simon-willison
language: fr
draft: false
automated: true
contentType: tool
sources:
  - "https://simonwillison.net/2026/May/15/qr-code-generator/#atom-everything"
---

## Génère des QR codes qui ne font pas pitié avec l'outil de Simon Willison

> **TL;DR** : Le générateur de Simon Willison te permet de créer en quelques clics des QR codes personnalisés pour URLs, textes ou réseaux WiFi, avec des styles square ou liquid, des couleurs custom, et un export direct en PNG ou presse-papiers.

### Les QR codes ne sont pas morts, et c'est tant mieux

On a tendance à les associer aux menus de restaurants ou aux passes sanitaires oubliés, mais dans l'équipe technique, un QR code bien placé reste un accélérateur redoutable. Tu dois partager l'URL d'un environnement de staging avec un collègue qui teste sur mobile ? Coller un mot de passe WiFi à vingt caractères spéciaux dans un téléphone ? Envoyer un lien vers une doc interne ou un dashboard Grafana depuis un écran de serveur ? À chaque fois, c'est la même perte de temps : taper sur un clavier tactile ou recopier manuellement une chaîne incompréhensible. Le QR code résout ça en une demi-seconde. Le problème, c'est que la plupart des générateurs en ligne sont soit ringards avec un watermark en plein milieu, soit bourrés de pubs, soit limités à l'URL basique sans aucune option de personnalisation. Tu te retrouves avec un carré noir et blanc moche que tu n'oses même pas montrer dans une présentation. C'est là que l'outil de Simon Willison change complètement la donne.

### Un outil minimaliste, mais pas basique

Disponible directement sur son blog à cette adresse : https://simonwillison.net/2026/May/15/qr-code-generator/, ce générateur ne te demande pas de créer un compte et ne te balance pas un modal de consentement cookies à la noix. Tu arrives, tu colles ton texte, ton URL ou tes identifiants de réseau dans le champ, et tu vois le résultat instantanément. Ce qui frappe immédiatement, c'est la flexibilité du rendu. Tu peux basculer entre un motif carré classique et un motif "liquid" qui adoucit les angles pour un résultat beaucoup plus moderne et agréable à scanner. Tu adjusts la taille en pixel, tu choisis tes couleurs de fond et de premier plan pour matcher l'identité visuelle de ton projet ou de ton entreprise, et tu ajoutes une bordure si tu veux un peu d'air visuel autour du bloc. C'est propre, c'est lisible, et ça ne fait pas amateur. Mais la killer feature pour le quotidien, c'est le support natif des réseaux WiFi. Tu rentres le SSID, le mot de passe et le type de sécurité, et l'outil génère un QR code standardisé que n'importe quel iPhone ou Android reconnaît nativement dans son appareil photo. Plus besoin de dicter un mot de passe à voix haute dans une salle de réunion ou de l'envoyer en clair sur un canal public. Tu génères, tu imprimes ou tu partages l'image, et chaque appareil qui scanne reçoit directement la proposition de connexion.

### Quand tu vas l'utiliser tous les jours

En tant que dev ou sysadmin, tu vas trouver des usages partout sans même chercher. Tu viens de déployer une appli temporaire sur un domaine de staging à rallonge ? Génère un QR, colle-le dans le canal de ton équipe ou sur l'écran de la machine de test, et tes collègues scannent pour ouvrir immédiatement la page sur leur téléphone. Tu prépares un atelier, une hackathon ou une review avec des intervenants extérieurs ? Un QR pour le WiFi invité imprimé sur une feuille A4 placée à l'entrée évite dix minutes de configuration pénible à chaque arrivée. Tu maintiens une documentation interne et tu veux qu'un code collé sur un équipement physique pointe vers le bon runbook ou le bon playbook Ansible ? Tu crées un QR avec les couleurs de ton équipe, tu l'imprimes sur une étiquette résistante, et tu transformes n'importe quel rack serveur ou IoT en point d'accès physique à l'information. Même pour toi, pour transférer rapidement un lien, un token ou un bloc de texte entre ta machine de bureau et ton téléphone sans passer par un service tiers ou une app propriétaire : tu génères le QR, tu le scannes avec ton appareil, le contenu est récupéré en un instant. C'est le pont le plus rapide entre le monde physique et digital.

### Copier-coller, c'est tout ce dont tu as besoin

L'interface est pensée pour la vitesse d'exécution, pas pour t'éblouir avec des animations inutiles. Une fois ton QR généré et personnalisé, tu as deux options : télécharger un fichier PNG propre et net, ou copier directement l'image dans ton presse-papiers. Cette deuxième option change absolument tout dans un workflow de développement. Tu es en pleine rédaction d'un ticket Jira, d'une page Confluence, d'un README GitHub ou d'une présentation rapide ? Tu génères le QR, tu copies, tu colles. Pas de fichier temporaire qui traîne sur ton bureau, pas de drag-and-drop hasardeux entre dix fenêtres. Pour les sysadmins qui préparent des visuels pour du matériel sur le terrain ou des affichages dans un datacenter, le PNG exporté à la résolution choisie fait le job sans retouche supplémentaire. Et comme tout est géré côté client dans ton navigateur, tu n'as même pas à te demander où tes données passent : l'URL de ton environnement sensible, le mot de passe de ton réseau interne ou le token temporaire ne quittent jamais ton navigateur. Pas de backend mystérieux, pas de logging tiers, juste du JavaScript qui fait le travail localement et efficacement.

### Ce que ça dit du tooling moderne

Simon Willison a construit cet outil avec l'aide de Claude, et c'est un exemple parfait de ce que le "vibe coding" fait de mieux quand il est bien canalisé : un besoin précis, une solution shipée rapidement, zéro bullshit fonctionnel. Pas de framework frontend lourd, pas de SaaS avec trois niveaux de pricing qui te forcent à t'inscrire pour exporter en haute résolution, juste une page web qui fait exactement ce qu'elle promet et qui le fait bien. C'est le genre d'utilitaire que tu bookmarkes dans ta barre de lancement et que tu ressors trois fois par semaine sans même y penser. Alors arrête d'installer des apps qui plantent au bout de deux scans ou de te battre avec des générateurs qui veulent ton email professionnel pour te spammer. Garde ce lien sous le coude, et la prochaine fois que tu dois partager une information entre le monde physique et l'écran, tu sais exactement quoi faire.