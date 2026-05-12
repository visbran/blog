---
title: "Portainer : gérer Docker avec une interface web intuitive"
description: Portainer offre une interface web complète pour gérer vos conteneurs Docker sans ligne de commande. Installation, configuration et utilisation en pratique.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - docker
  - devops
  - linux
language: fr
draft: false
comment: true
---

La ligne de commande Docker est puissante, mais pas toujours pratique pour superviser un ensemble de conteneurs, visualiser les logs en temps réel ou gérer les volumes et réseaux. **Portainer** est une interface web open source qui simplifie la gestion de Docker sans sacrifier le contrôle.

## Qu'est-ce que Portainer ?

Portainer est une interface d'administration web pour Docker (et Kubernetes). Il permet de gérer conteneurs, images, volumes, réseaux et stacks Compose depuis un navigateur, sans taper de commandes.

**Deux éditions :**
- **Community Edition (CE)** — gratuite, open source, suffisante pour un homelab ou un petit serveur
- **Business Edition (BE)** — payante, avec des fonctionnalités avancées (RBAC, audit...)

Ce guide couvre l'édition CE.

**Ce que Portainer permet de faire :**
- Démarrer, arrêter, redémarrer des conteneurs en un clic
- Consulter les logs en temps réel
- Ouvrir un terminal dans un conteneur
- Déployer des stacks Docker Compose via l'interface
- Gérer les images, volumes et réseaux
- Surveiller les ressources (CPU, mémoire)

## Prérequis

- Docker installé ([guide Docker](/blog/installer-docker-guide-complet-pour-debutants))
- Docker Compose v2 disponible ([guide Docker Compose](/blog/docker-compose-orchestrer-conteneurs))

## Installation avec Docker Compose

La méthode recommandée pour un déploiement propre et maintenable :

```yaml
# compose.yml

services:
  portainer:
    image: portainer/portainer-ce:latest
    restart: unless-stopped
    ports:
      - "9000:9000"
      - "9443:9443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data

volumes:
  portainer_data:
```

```bash
docker compose up -d
```

Portainer est accessible sur :
- `http://votre-ip:9000` (HTTP)
- `https://votre-ip:9443` (HTTPS avec certificat auto-signé)

### Installation derrière Traefik (HTTPS automatique)

Si vous utilisez [Traefik](/blog/traefik-reverse-proxy-docker), ajoutez les labels pour l'exposition HTTPS :

```yaml
services:
  portainer:
    image: portainer/portainer-ce:latest
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
    networks:
      - traefik-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.portainer.rule=Host(`portainer.votredomaine.fr`)"
      - "traefik.http.routers.portainer.entrypoints=websecure"
      - "traefik.http.routers.portainer.tls.certresolver=letsencrypt"
      - "traefik.http.services.portainer.loadbalancer.server.port=9000"

volumes:
  portainer_data:

networks:
  traefik-network:
    external: true
```

## Premier démarrage

À la première connexion, Portainer demande de créer un compte administrateur :

1. Aller sur `http://votre-ip:9000`
2. Créer un utilisateur admin avec un mot de passe fort (minimum 12 caractères)
3. Choisir **"Get Started"** pour gérer l'environnement Docker local

> **Important** : si vous n'accédez pas à l'interface dans les 5 minutes suivant le démarrage, Portainer se verrouille par sécurité. Relancez le conteneur : `docker compose restart portainer`.

## Vue d'ensemble de l'interface

### Dashboard principal

Le dashboard affiche un résumé de l'environnement :
- Nombre de conteneurs (en cours, arrêtés)
- Images disponibles
- Volumes et réseaux
- Utilisation des ressources (si Docker stats est activé)

### Gestion des conteneurs

**Containers > All containers** liste tous les conteneurs avec leur état.

Actions disponibles sur chaque conteneur :
- **Start / Stop / Restart / Kill**
- **Logs** : affichage en temps réel avec filtrage
- **Console** : terminal interactif dans le conteneur (équivalent `docker exec -it`)
- **Stats** : CPU, mémoire, réseau, I/O en temps réel
- **Inspect** : configuration complète JSON

### Déployer une stack Compose

**Stacks > Add stack** permet de coller directement un fichier `compose.yml` et de le déployer :

1. Donner un nom à la stack
2. Coller le contenu du `compose.yml`
3. Définir les variables d'environnement si nécessaire
4. Cliquer **Deploy the stack**

Portainer gère ensuite la stack comme une unité : mise à jour, redémarrage, suppression.

### Gestion des images

**Images** liste toutes les images téléchargées avec leur taille.

- **Pull** : télécharger une nouvelle image depuis Docker Hub
- **Build** : construire une image depuis un Dockerfile
- **Remove** : supprimer les images inutilisées (libérer de l'espace)

Bouton pratique : **Remove unused images** — supprime toutes les images non utilisées par un conteneur actif.

### Volumes et réseaux

**Volumes** liste tous les volumes Docker avec leur point de montage.

**Networks** liste les réseaux Docker. Vous pouvez créer des réseaux personnalisés directement depuis l'interface.

## Ouvrir un terminal dans un conteneur

Une fonctionnalité particulièrement utile : accéder à un shell dans un conteneur sans connaître les commandes Docker.

1. Aller dans **Containers**
2. Cliquer sur le conteneur cible
3. Onglet **Console**
4. Choisir le shell (`/bin/sh` ou `/bin/bash`)
5. Cliquer **Connect**

Équivalent en ligne de commande : `docker exec -it <conteneur> bash`

## Mettre à jour Portainer

```bash
# Arrêter et supprimer le conteneur (les données sont dans le volume)
docker compose down

# Télécharger la nouvelle image
docker compose pull

# Redémarrer
docker compose up -d
```

Le volume `portainer_data` conserve toute la configuration : utilisateurs, stacks, paramètres.

## Sécuriser l'accès

### Changer le port par défaut

Si Portainer est exposé directement (sans reverse proxy), changer les ports par défaut :

```yaml
ports:
  - "18443:9443"  # port personnalisé
```

### Configurer le pare-feu

Si Portainer n'est accessible que depuis votre réseau local :

```bash
# Autoriser uniquement depuis le réseau local
sudo ufw allow from 192.168.1.0/24 to any port 9000
sudo ufw deny 9000  # bloquer depuis internet
```

### Activer l'authentification 2FA

Dans Portainer : **My account > Two-factor authentication > Enable 2FA**

Compatible avec Google Authenticator, Aegis, ou tout client TOTP.

### Désactiver le compte admin par défaut

Après avoir créé un second compte administrateur, il est recommandé de désactiver le compte `admin` initial : **Users > admin > Disable**.

## Portainer Agent (gestion de serveurs distants)

Portainer peut gérer plusieurs hôtes Docker depuis une seule interface. Sur chaque hôte distant, déployer l'agent :

```yaml
# compose.yml sur le serveur distant

services:
  portainer_agent:
    image: portainer/agent:latest
    restart: unless-stopped
    ports:
      - "9001:9001"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/volumes:/var/lib/docker/volumes
```

Dans Portainer principal : **Environments > Add environment > Agent** et saisir l'IP du serveur distant avec le port 9001.

## Récapitulatif

| Fonctionnalité | Accès dans Portainer |
|---|---|
| Lister les conteneurs | Containers > All containers |
| Voir les logs | Container > Logs |
| Ouvrir un shell | Container > Console |
| Déployer une stack Compose | Stacks > Add stack |
| Gérer les images | Images |
| Nettoyer les images inutilisées | Images > Remove unused images |
| Surveiller les ressources | Container > Stats |
| Gérer les volumes | Volumes |

Portainer est un excellent outil pour les équipes ou pour administrer Docker sans être à l'aise avec la ligne de commande. Déployé derrière [Traefik](/blog/traefik-reverse-proxy-docker) avec HTTPS automatique, il s'intègre naturellement dans une infrastructure [Docker Compose](/blog/docker-compose-orchestrer-conteneurs).
