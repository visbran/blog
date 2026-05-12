---
title: "Gitea : héberger son propre serveur Git"
description: Gitea est une forge Git légère auto-hébergée. Issues, pull requests, CI/CD avec Gitea Actions. Installation Docker en 5 minutes sur votre serveur.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
  - docker
  - auto-hébergement
  - git
language: fr
draft: true
comment: true
---

GitHub et GitLab sont pratiques, mais héberger son propre serveur Git offre un contrôle total sur son code. **Gitea** est une forge Git légère et rapide : issues, pull requests, webhooks, miroirs, et même un système de CI/CD (Gitea Actions, compatible GitHub Actions). Il s'installe en quelques minutes avec Docker.

## Pourquoi Gitea ?

| | GitHub | GitLab CE | Gitea |
|---|---|---|---|
| Hébergement | Cloud | Auto | Auto |
| RAM minimale | — | ~4 Go | ~150 Mo |
| Issues / PR | ✓ | ✓ | ✓ |
| CI/CD intégré | Actions | Pipelines | Actions |
| Miroir GitHub | Limité | ✓ | ✓ |
| Interface | Lente | Lourde | Rapide |

**Gitea vs Forgejo** : Forgejo est un fork communautaire de Gitea, fonctionnellement quasi-identique. Ce guide s'applique aux deux.

## Installation avec Docker Compose

### `compose.yml`

```yaml
services:
  gitea:
    image: gitea/gitea:latest
    restart: unless-stopped
    environment:
      USER_UID: 1000
      USER_GID: 1000
      GITEA__database__DB_TYPE: postgres
      GITEA__database__HOST: db:5432
      GITEA__database__NAME: gitea
      GITEA__database__USER: gitea
      GITEA__database__PASSWD: gitea_password
    ports:
      - "3000:3000"    # Interface web
      - "222:22"       # SSH Git
    volumes:
      - gitea_data:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    depends_on:
      - db
    networks:
      - gitea

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: gitea
      POSTGRES_USER: gitea
      POSTGRES_PASSWORD: gitea_password
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - gitea

networks:
  gitea:

volumes:
  gitea_data:
  db_data:
```

### Démarrer

```bash
docker compose up -d
```

Accéder à `http://ip:3000` pour l'assistant d'installation.

### Configuration initiale (interface web)

L'assistant propose quelques paramètres à ajuster :

- **URL de base** : `https://git.votredomaine.fr`
- **SSH Server Port** : `222` (correspond au mapping Docker)
- **Administrateur** : créer le compte admin

## Configuration avec reverse proxy

Pour exposer Gitea avec HTTPS, utiliser [Nginx](/blog/nginx-reverse-proxy-certbot-ssl) ou [Traefik](/blog/traefik-reverse-proxy-docker).

### Exemple avec Nginx

```nginx
server {
    listen 80;
    server_name git.votredomaine.fr;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name git.votredomaine.fr;

    ssl_certificate /etc/letsencrypt/live/git.votredomaine.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/git.votredomaine.fr/privkey.pem;

    client_max_body_size 512M;  # Pour les gros dépôts

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Configurer SSH pour Git

Le port SSH de Gitea est mappé sur le port 222 de l'hôte. Pour cloner via SSH sans préciser le port à chaque fois, configurer `~/.ssh/config` sur les machines clientes :

```
Host git.votredomaine.fr
    HostName git.votredomaine.fr
    User git
    Port 222
    IdentityFile ~/.ssh/id_ed25519
```

Cloner ensuite normalement :

```bash
git clone git@git.votredomaine.fr:utilisateur/mon-depot.git
```

## Gitea Actions (CI/CD)

Gitea Actions est compatible avec la syntaxe GitHub Actions. Il nécessite un runner.

### Installer un runner

```bash
# Sur le serveur hôte (pas dans le conteneur Gitea)
docker run -d \
  --name gitea-runner \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v gitea-runner:/data \
  -e CONFIG_FILE=/data/config.yml \
  gitea/act_runner:latest
```

Enregistrer le runner dans Gitea :

**Administration du site > Actions > Runners > Créer un runner**

Copier le token et l'utiliser pour enregistrer le runner :

```bash
docker exec -it gitea-runner act_runner register \
  --instance https://git.votredomaine.fr \
  --token VOTRE_TOKEN \
  --name mon-runner \
  --labels ubuntu-latest:docker://node:18-bullseye
```

### Exemple de workflow

```yaml
# .gitea/workflows/build.yml
name: Build and test

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

La syntaxe est identique à GitHub Actions — les workflows existants fonctionnent généralement sans modification.

## Miroirs automatiques

Gitea peut créer des miroirs de dépôts GitHub, GitLab ou autres, mis à jour automatiquement.

**Nouveau dépôt > Migrer un dépôt externe** :
- URL du dépôt source (ex: `https://github.com/utilisateur/repo`)
- Intervalle de synchronisation : `8h` ou `24h`
- Cocher **Miroir** pour la synchronisation automatique

Utile pour avoir une copie locale de ses dépôts GitHub.

## Push miroir vers GitHub

L'inverse est aussi possible : pousser automatiquement depuis Gitea vers GitHub.

**Dépôt > Paramètres > Dépôts distants > Ajouter un dépôt distant** :
- URL : `https://github.com/utilisateur/depot.git`
- Clé d'accès : token GitHub avec permission `repo`
- Cocher **Activer le push automatique**

## Webhooks

Gitea supporte les webhooks pour déclencher des actions externes.

**Dépôt > Paramètres > Webhooks > Ajouter un webhook** :
- URL cible (ex: serveur de déploiement, Slack...)
- Événements : push, PR, issues...
- Format JSON compatible GitHub

## Administration

### Commandes utiles via l'interface

**Administration du site** (accessible aux admins) :
- **Tableau de bord** : statistiques, tâches de maintenance
- **Gestion des utilisateurs** : créer, désactiver, changer le rôle
- **Organisations** : grouper des utilisateurs et dépôts
- **Configuration Git** : hooks, LFS, taille maximale

### CLI Gitea

```bash
# Entrer dans le conteneur
docker exec -it gitea-gitea-1 bash

# Commandes gitea
gitea admin user create --username alice --password motdepasse --email alice@domaine.fr --admin
gitea admin user list
gitea dump  # Sauvegarde complète
```

## Sauvegarde

```bash
#!/bin/bash
# backup-gitea.sh

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backup/gitea"

# Dump Gitea (inclut la DB et les repos)
docker exec gitea-gitea-1 gitea dump -c /data/gitea/conf/app.ini \
  --file /tmp/gitea-dump-$DATE.zip

# Copier le dump
docker cp gitea-gitea-1:/tmp/gitea-dump-$DATE.zip "$BACKUP_DIR/"

echo "Sauvegarde Gitea : $BACKUP_DIR/gitea-dump-$DATE.zip"
```

## Mises à jour

```bash
# Mettre à jour vers la dernière version
docker compose pull gitea
docker compose up -d gitea
```

Vérifier les notes de version (CHANGELOG) avant les mises à jour majeures.

## Récapitulatif

| Fonctionnalité | URL / chemin |
|---|---|
| Interface web | `https://git.votredomaine.fr` |
| SSH clone | `git@git.votredomaine.fr:user/repo.git` (port 222) |
| API REST | `https://git.votredomaine.fr/api/swagger` |
| Administration | `https://git.votredomaine.fr/-/admin` |
| Workflows CI/CD | `.gitea/workflows/*.yml` |

Gitea offre une expérience proche de GitHub avec une empreinte minimale. Hébergé sur [Proxmox](/blog/proxmox-virtualisation-homelab) dans un LXC ou une VM, et accessible depuis l'extérieur via [WireGuard](/blog/wireguard-vpn-linux), il constitue le socle idéal d'une infrastructure de développement auto-hébergée.
