---
title: "datasette-ip-rate-limit : un bouncer IP natif pour tes instances Datasette"
description: "Protège tes instances Datasette des crawlers abusifs avec datasette-ip-rate-limit, le plugin de rate limiting par IP de Simon Willison configurable en YAML."
heroImage:
  src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
  alt: "datasette-ip-rate-limit : un bouncer IP natif pour tes instances Datasette"
  inferSize: true
publishDate: '2026-05-15T03:01:55.640Z'
tags:
  - datasette
  - rate-limiting
  - python
  - sysadmin
language: fr
draft: false
automated: true
contentType: tool
sources:
  - "https://simonwillison.net/2026/May/14/datasette-ip-rate-limit/#atom-everything"
---

## datasette-ip-rate-limit : un bouncer IP natif pour tes instances Datasette

> **TL;DR** : Simon Willison vient de sortir [datasette-ip-rate-limit](https://simonwillison.net/2026/May/14/datasette-ip-rate-limit/), un plugin Datasette qui bloque les IPs trop gourmandes en quelques lignes de YAML, parfait pour survivre aux crawlers sauvages sans toucher à Nginx ni à Cloudflare.

### Le problème réel : quand tes données publiques deviennent une cible

T'as déployé une instance Datasette pour partager un dataset sympa. Les premiers jours, tout va bien. Puis un beau matin, ton serveur rame, les temps de réponse explosent et ton hébergeur te réclame un bras pour la bande passante. Le coupable ? Pas un hacker. Un crawler. Mal codé, réglé comme une horloge suisse, qui bouffe tes endpoints JSON à toute vitesse sans respecter le moindre crawl-delay.

C'est exactement ce qui est arrivé à Simon Willison sur datasette.io. Des bots mal comportés ont commencé à marteler certaines zones du site, en particulier les démos de bases de données comme global-power-plants ou legislators. Le genre de situation où tu te dis que tu vas pas remonter toute une infra Cloudflare ou te retaper une config Nginx complexe juste pour ça. Et tu as raison. Quand tu veux juste servir des données sans te prendre la tête, ajouter une couche réseau externe pour un simple anti-bot, c'est du gâchis.

### L'outil : un plugin Datasette qui met un mur devant les abus

La réponse de Simon s'appelle [datasette-ip-rate-limit 0.1a0](https://simonwillison.net/2026/May/14/datasette-ip-rate-limit/). C'est un plugin Python qui s'installe directement dans Datasette et qui ajoute une couche de rate limiting au niveau application, sans dépendre d'une appliance réseau externe. L'idée est simple : il récupère l'IP client via un header configurable, compte les requêtes sur une fenêtre glissante, et si une adresse dépasse la limite, elle se prend un blocage temporaire pendant quelques secondes.

Ce qui change tout, c'est que ça s'adresse aux IPs, pas aux utilisateurs authentifiés. Pas besoin de compte, de JWT ou de session. Tu bloques le bot proprement, au niveau requête, avant qu'il ne fasse suer ta base SQLite. C'est un middleware interne qui intercepte l'appel avant même qu'il n'atteigne la couche base de données, ce qui te fait économiser CPU et I/O disque pour rien.

### Mise en place : cinq minutes, pas une de plus

L'installation se fait comme n'importe quel plugin de l'écosystème. Tu lances `datasette install datasette-ip-rate-limit` et c'est plié. La configuration se passe dans ton fichier `datasette.yml` habituel. Tu déclares le plugin, tu lui indiques dans quel header aller chercher l'IP réelle du client, et tu définis tes règles de limitation.

Sur Fly.io par exemple, tu utiliseras le header `Fly-Client-IP`. Sur une stack plus classique avec un reverse proxy, ce sera probablement `X-Forwarded-For`. Le paramètre `max_keys: 10000` définit combien d'adresses IP le plugin garde en mémoire simultanément. C'est léger, quelques mégas de RAM tout au plus, donc tu peux monter haut sans inquiétude même sur une petite instance. Une fois le fichier sauvegardé, tu redémarres Datasette et le plugin est actif. Pas de règle iptables à maintenir, pas de reload Nginx à synchroniser sur trois instances, pas de WAF à payer.

### Configuration de prod : comment Simon filtre les crawlers

Le plus intéressant dans cette release, c'est la configuration réelle que Simon utilise en production sur datasette.io. Il l'a partagée telle quelle, et elle montre bien comment penser une protection sans taper à côté.

Il récupère l'IP via `Fly-Client-IP`, garde 10 000 clés en mémoire, puis exempte d'emblée certains chemins critiques : tout ce qui est statique (`/static/*`) et le endpoint Turnstile (`/-/turnstile*`), parce que bloquer un captcha ou des assets CSS serait contre-productif. Mais le clou du spectacle, c'est le système de règles nommées. Au lieu d'un rate limit global et brutal sur toute l'application, Simon a créé une règle "demo-databases" qui cible spécifiquement les paths `/global-power-plants/*` et `/legislators/*`. Sur ces endpoints coûteux, il autorise 60 requêtes par minute, puis bloque l'IP pendant 20 secondes si elle dépasse la limite.

Cette granularité est essentielle. Une requête SQL complexe sur 300 000 lignes avec full-text search n'a pas le même impact qu'une consultation de la page d'accueil. En ciblant uniquement les zones sensibles, tu protèges tes ressources sans punir un utilisateur lambda qui navigue normalement. Les autres zones restent fluides, et seuls les abus sur les datasets lourds sont muselés.

### Pourquoi ça change la donne pour tes projets

Si tu administres des instances Datasette, tu connais le dilemme. Soit tu exposes tout et tu espères que personne n'abuse, soit tu mets une authentification devant et tu perds l'avantage de la simplicité. datasette-ip-rate-limit casse ce faux dilemme en proposant une porte transparente : les humains passent, les bots qui martèlent prennent un mur temporaire. Une fenêtre de 60 secondes avec 60 requêtes max, suivie d'un blocage de 20 secondes, c'est pas une punition draconienne. C'est juste assez pour briser la boucle d'un crawler mal configuré et le forcer à passer à une autre cible.

C'est aussi une bouffée d'air pour les sysadmins qui gèrent des déploiements sur des PaaS. Tu n'as plus besoin de synchroniser une config Nginx sur plusieurs conteneurs ou de monter une règle Cloudflare pour chaque sous-domaine. Tu versionnes ta règle de rate limiting dans le même fichier YAML que le reste de ta configuration Datasette. C'est propre, c'est reproductible, ça vit dans le repo avec le reste de ton infra-as-code.

### Le fond de l'histoire : l'agentic engineering en action

Un dernier détail qui rend cette release particulièrement intéressante : Simon n'a pas écrit ce plugin tout seul dans son coin à la main. Il a utilisé Codex, basé sur GPT-5.5 xhigh, pour le construire. Il a identifié le besoin précisément — des crawlers qui tapent trop fort sur des démos spécifiques —, il a décrit le comportement attendu à l'IA, et il a itéré jusqu'à obtenir un plugin de production directement déployé sur datasette.io.

C'est exactement le genre de workflow agentic qui devient la norme. Pas pour remplacer la réflexion architecturelle, mais pour accélérer l'exécution d'une idée qui tient en une phrase : "je veux un rate limiter par IP avec des règles de path et une fenêtre glissante". Quelques heures plus tard, le plugin est sur PyPI et en prod. Le résultat est concis, ciblé, et il résout un vrai problème d'ops sans complexité inutile.

Alors si tu as une instance Datasette qui traîne et que tu commences à voir des IPs bizarrement gourmandes dans tes logs, tu sais quoi faire. Installe le plugin, reprends la config de Simon, adapte les paths à tes propres datasets, et dors tranquille. Les crawlers trouveront une autre porte.