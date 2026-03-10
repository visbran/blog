---
title: "Docker Compose : orchestrer ses conteneurs avec un fichier YAML"
description: Docker Compose permet de définir et gérer des applications multi-conteneurs. Découvrez comment structurer vos services, volumes et réseaux en un seul fichier.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - docker
  - devops
  - linux
  - automatisation
language: fr
draft: false
comment: true
---

Dans l'[article précédent sur Docker](/blog/installer-docker-guide-complet-pour-debutants), nous avons vu comment installer et utiliser Docker pour lancer des conteneurs individuels. En pratique, une application réelle est rarement constituée d'un seul conteneur : une stack web typique combine un serveur web, une base de données, un cache… C'est là qu'intervient **Docker Compose**.

## Qu'est-ce que Docker Compose ?

Docker Compose est un outil qui permet de **définir et gérer des applications multi-conteneurs** à l'aide d'un fichier YAML. En une seule commande, vous pouvez démarrer, arrêter et gérer tous vos services.

> **Compose v1 vs v2** : depuis 2022, Compose est intégré directement dans Docker CLI. On utilise désormais `docker compose` (sans tiret) au lieu de l'ancien `docker-compose`. Si vous voyez encore `docker-compose` dans des tutoriels, ils sont probablement obsolètes.

## Installation

Compose v2 est inclus avec Docker Desktop (Windows, macOS). Sur Linux :

```bash
# Vérifier que Compose est disponible
docker compose version

# Si absent, installer le plugin
sudo apt install docker-compose-plugin -y
```

## Structure d'un fichier `compose.yml`

Le fichier `compose.yml` (anciennement `docker-compose.yml`, les deux fonctionnent) se place à la racine de votre projet.

```yaml
services:
  nom-service:
    image: nom-image:tag
    ports:
      - "port-hote:port-conteneur"
    environment:
      - VARIABLE=valeur
    volumes:
      - ./dossier-local:/dossier-conteneur
    networks:
      - mon-reseau

networks:
  mon-reseau:

volumes:
  mes-donnees:
```

## Exemple concret : WordPress + MariaDB

Un exemple classique qui illustre les concepts essentiels :

```yaml
services:
  db:
    image: mariadb:11
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: motdepasse_root
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wpuser
      MYSQL_PASSWORD: motdepasse_wp
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - wp-network

  wordpress:
    image: wordpress:latest
    restart: unless-stopped
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_NAME: wordpress
      WORDPRESS_DB_USER: wpuser
      WORDPRESS_DB_PASSWORD: motdepasse_wp
    volumes:
      - wp_data:/var/www/html
    networks:
      - wp-network
    depends_on:
      - db

networks:
  wp-network:

volumes:
  db_data:
  wp_data:
```

Points clés de cet exemple :

- **`depends_on`** : WordPress attend que MariaDB soit démarré
- **`restart: unless-stopped`** : les conteneurs redémarrent automatiquement (sauf arrêt manuel)
- **`volumes nommés`** (`db_data`, `wp_data`) : les données persistent entre les redémarrages
- **`networks`** : les services communiquent entre eux par leur nom (`db` est accessible via `http://db`)

## Commandes essentielles

### Démarrer les services

```bash
# Démarrer en arrière-plan (détaché)
docker compose up -d

# Démarrer en affichant les logs
docker compose up
```

### Arrêter les services

```bash
# Arrêter sans supprimer les conteneurs
docker compose stop

# Arrêter et supprimer les conteneurs (les volumes sont conservés)
docker compose down

# Arrêter, supprimer les conteneurs ET les volumes
docker compose down -v
```

### Voir l'état des services

```bash
docker compose ps
```

### Afficher les logs

```bash
# Logs de tous les services
docker compose logs

# Logs d'un service spécifique en temps réel
docker compose logs -f wordpress
```

### Exécuter une commande dans un conteneur

```bash
docker compose exec wordpress bash
docker compose exec db mariadb -u wpuser -p
```

### Reconstruire les images

```bash
docker compose build
docker compose up -d --build
```

## Variables d'environnement avec `.env`

Pour ne pas exposer les mots de passe dans `compose.yml`, utilisez un fichier `.env` :

```bash
# .env
MYSQL_ROOT_PASSWORD=motdepasse_root
MYSQL_PASSWORD=motdepasse_wp
```

```yaml
# compose.yml
services:
  db:
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
```

> **Important** : ajoutez `.env` à votre `.gitignore` pour ne pas commiter vos secrets.

## Mise à jour des images

Pour mettre à jour les images vers leur dernière version :

```bash
# Télécharger les nouvelles versions
docker compose pull

# Redémarrer avec les nouvelles images
docker compose up -d
```

## Exemple avancé : Nginx + PHP-FPM + MariaDB

```yaml
services:
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./app:/var/www/html
    networks:
      - app-network
    depends_on:
      - php

  php:
    image: php:8.3-fpm-alpine
    restart: unless-stopped
    volumes:
      - ./app:/var/www/html
    networks:
      - app-network
    depends_on:
      - db

  db:
    image: mariadb:11
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - app-network

networks:
  app-network:

volumes:
  db_data:
```

## Bonnes pratiques

- **Toujours fixer les versions** des images (`mariadb:11` plutôt que `mariadb:latest`) pour des déploiements reproductibles
- **Ne jamais commiter le fichier `.env`** — utilisez `.env.example` comme modèle documenté
- **Utiliser des volumes nommés** pour les données persistantes, pas des bind mounts pour les bases de données
- **Nommer votre projet** avec `docker compose -p monprojet up -d` pour éviter les conflits entre plusieurs stacks

## Récapitulatif des commandes

| Commande | Description |
|---|---|
| `docker compose up -d` | Démarrer les services en arrière-plan |
| `docker compose down` | Arrêter et supprimer les conteneurs |
| `docker compose ps` | Lister les services et leur état |
| `docker compose logs -f` | Afficher les logs en temps réel |
| `docker compose exec <service> bash` | Ouvrir un shell dans un conteneur |
| `docker compose pull` | Mettre à jour les images |
| `docker compose build` | Reconstruire les images locales |

Docker Compose est la base de tout environnement Docker organisé. Une fois maîtrisé, vous pouvez aller plus loin avec [Traefik comme reverse proxy](/blog/traefik-reverse-proxy-docker) pour exposer vos services avec SSL automatique.
