---
title: "Nextcloud : installer son cloud personnel sur un serveur Linux"
description: Installez Nextcloud sur votre serveur pour héberger fichiers, contacts et agenda. Guide Docker Compose avec Nginx, SSL Let's Encrypt et optimisations.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
  - docker
  - auto-hébergement
language: fr
draft: true
comment: true
---

Stocker ses fichiers chez Google Drive ou Dropbox implique de confier ses données à des tiers. **Nextcloud** est l'alternative open source : un cloud personnel que vous hébergez vous-même, avec les mêmes fonctionnalités (fichiers, calendrier, contacts, notes, visioconférence) mais sans dépendance à un service externe.

## Ce que Nextcloud propose

- **Fichiers** : synchronisation multi-appareils (desktop, mobile, web)
- **Calendrier et contacts** : protocoles CalDAV et CardDAV standard
- **Photos** : galerie automatique avec reconnaissance d'objets (optionnel)
- **Partage** : liens publics avec mot de passe et date d'expiration
- **Applications** : +200 apps dans le store Nextcloud (notes, tâches, visio...)

## Prérequis

- Serveur Linux avec Docker et Docker Compose installés
- Nom de domaine pointant sur le serveur
- Ports 80 et 443 ouverts ([UFW](/blog/ufw-configurer-pare-feu-linux))

## Installation avec Docker Compose

### Structure des fichiers

```
nextcloud/
├── compose.yml
├── nginx/
│   └── nextcloud.conf
└── data/          (créé automatiquement)
```

### `compose.yml`

```yaml
services:
  db:
    image: mariadb:11
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root_password_fort
      MYSQL_DATABASE: nextcloud
      MYSQL_USER: nextcloud
      MYSQL_PASSWORD: nextcloud_password
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - nextcloud

  redis:
    image: redis:alpine
    restart: unless-stopped
    networks:
      - nextcloud

  nextcloud:
    image: nextcloud:28
    restart: unless-stopped
    depends_on:
      - db
      - redis
    environment:
      MYSQL_HOST: db
      MYSQL_DATABASE: nextcloud
      MYSQL_USER: nextcloud
      MYSQL_PASSWORD: nextcloud_password
      REDIS_HOST: redis
      NEXTCLOUD_TRUSTED_DOMAINS: cloud.votredomaine.fr
      NEXTCLOUD_ADMIN_USER: admin
      NEXTCLOUD_ADMIN_PASSWORD: admin_password_fort
    volumes:
      - nextcloud_data:/var/www/html
    networks:
      - nextcloud

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nextcloud.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - nextcloud_data:/var/www/html:ro
    depends_on:
      - nextcloud
    networks:
      - nextcloud

networks:
  nextcloud:

volumes:
  db_data:
  nextcloud_data:
```

### Configuration Nginx (`nginx/nextcloud.conf`)

```nginx
server {
    listen 80;
    server_name cloud.votredomaine.fr;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cloud.votredomaine.fr;

    ssl_certificate /etc/letsencrypt/live/cloud.votredomaine.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cloud.votredomaine.fr/privkey.pem;

    # Headers de sécurité Nextcloud
    add_header Strict-Transport-Security "max-age=15552000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer" always;

    client_max_body_size 10G;
    fastcgi_buffers 64 4K;

    location / {
        proxy_pass http://nextcloud:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_request_buffering off;
    }
}
```

### Obtenir un certificat SSL

Avant de démarrer, obtenir un certificat Let's Encrypt :

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d cloud.votredomaine.fr
```

### Démarrer Nextcloud

```bash
docker compose up -d
```

L'installation se fait automatiquement au premier démarrage (2-3 minutes).

Accéder à `https://cloud.votredomaine.fr` avec les identifiants admin définis dans le compose.

## Optimisations post-installation

### Tâches planifiées (Cron)

Par défaut, Nextcloud utilise AJAX pour les tâches de fond. Configurer Cron pour de meilleures performances :

Dans **Paramètres > Administration > Paramètres de base > Tâches de fond**, choisir **Cron**.

Ajouter sur l'hôte (pas dans le conteneur) :

```bash
# Exécuter le cron Nextcloud toutes les 5 minutes
*/5 * * * * docker exec nextcloud-nextcloud-1 php -f /var/www/html/cron.php
```

### Cache OPcache

Activer OPcache dans le conteneur Nextcloud pour de meilleures performances PHP. Créer un fichier `php/opcache.ini` :

```ini
opcache.enable=1
opcache.interned_strings_buffer=32
opcache.max_accelerated_files=10000
opcache.memory_consumption=128
opcache.save_comments=1
opcache.revalidate_freq=1
```

Et monter dans le compose :

```yaml
nextcloud:
  volumes:
    - nextcloud_data:/var/www/html
    - ./php/opcache.ini:/usr/local/etc/php/conf.d/opcache.ini
```

## Configuration recommandée

### Augmenter la taille d'upload

Dans `nextcloud_data/config/config.php` (après le premier démarrage) :

```php
'upload_max_size' => '10G',
```

Ou via une variable d'environnement dans le compose :

```yaml
environment:
  PHP_UPLOAD_LIMIT: 10G
  PHP_MEMORY_LIMIT: 512M
```

### Activer la maintenance automatique

```bash
# Via occ (outil CLI Nextcloud)
docker exec -u www-data nextcloud-nextcloud-1 php occ maintenance:mode --on
docker exec -u www-data nextcloud-nextcloud-1 php occ db:add-missing-indices
docker exec -u www-data nextcloud-nextcloud-1 php occ maintenance:mode --off
```

## Applications essentielles

Dans **Applications** (menu utilisateur) :

| Application | Utilité |
|---|---|
| **Contacts** | Carnet d'adresses CardDAV |
| **Calendrier** | Agenda CalDAV, compatible iOS/Android |
| **Notes** | Notes Markdown |
| **Tasks** | Gestion de tâches (CalDAV) |
| **Talk** | Visioconférence et messagerie |
| **Memories** | Galerie photos organisée |

## Sauvegarde

Nextcloud nécessite de sauvegarder deux éléments : les fichiers et la base de données.

```bash
#!/bin/bash
# backup-nextcloud.sh

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backup/nextcloud"

# Activer le mode maintenance
docker exec -u www-data nextcloud-nextcloud-1 php occ maintenance:mode --on

# Sauvegarder la base de données
docker exec nextcloud-db-1 mysqldump -u nextcloud -pnextcloud_password nextcloud \
  | gzip > "$BACKUP_DIR/db-$DATE.sql.gz"

# Sauvegarder les fichiers (données utilisateur)
tar czf "$BACKUP_DIR/data-$DATE.tar.gz" \
  $(docker volume inspect nextcloud_nextcloud_data --format '{{.Mountpoint}}')/data

# Désactiver le mode maintenance
docker exec -u www-data nextcloud-nextcloud-1 php occ maintenance:mode --off

echo "Sauvegarde Nextcloud terminée : $DATE"
```

## Synchronisation sur vos appareils

| Plateforme | Client |
|---|---|
| Windows / macOS / Linux | Nextcloud Desktop (nextcloud.com/install) |
| Android | Nextcloud (F-Droid ou Play Store) |
| iOS | Nextcloud (App Store) |
| Calendrier iOS/Android | Connexion CalDAV native |

URL du serveur CalDAV : `https://cloud.votredomaine.fr/remote.php/dav`

## Mises à jour

```bash
# Mettre à jour l'image Nextcloud
docker compose pull nextcloud
docker compose up -d nextcloud
```

> Toujours vérifier les notes de version Nextcloud avant une mise à jour majeure. Activer le mode maintenance avant et après.

## Récapitulatif

| Composant | Rôle |
|---|---|
| Nextcloud | Application cloud (PHP) |
| MariaDB | Base de données |
| Redis | Cache sessions et fichiers |
| Nginx | Reverse proxy HTTPS |

Nextcloud est l'outil central d'un homelab auto-hébergé. Associé à [WireGuard](/blog/wireguard-vpn-linux) pour un accès sécurisé depuis l'extérieur et à [Proxmox](/blog/proxmox-virtualisation-homelab) pour l'isolation, vous disposez d'un cloud personnel complet et privé.
