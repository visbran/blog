---
title: "Watchtower : mettre à jour ses conteneurs Docker automatiquement"
description: Watchtower surveille vos conteneurs Docker et les met à jour automatiquement dès qu'une nouvelle image est disponible. Fini les mises à jour manuelles.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - docker
  - devops
  - automatisation
language: fr
draft: false
comment: true
---

Maintenir des conteneurs Docker à jour est une tâche répétitive : vérifier les nouvelles versions, `docker pull`, `docker compose up -d`... sur chaque service. **Watchtower** automatise entièrement ce processus : il surveille vos conteneurs en arrière-plan et les redémarre avec la nouvelle image dès qu'une mise à jour est disponible.

## Comment fonctionne Watchtower ?

Watchtower s'exécute lui-même comme un conteneur Docker. À intervalles réguliers, il :

1. Vérifie les nouvelles versions des images utilisées par vos conteneurs
2. Télécharge les nouvelles images disponibles
3. Arrête le conteneur existant
4. Redémarre un nouveau conteneur avec la nouvelle image et les mêmes options (volumes, ports, variables d'environnement...)
5. Supprime l'ancienne image

Tout cela de manière transparente, sans modifier vos fichiers `compose.yml`.

## Installation

### Avec Docker Compose (recommandé)

```yaml
# compose.yml

services:
  watchtower:
    image: containrrr/watchtower:latest
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      # Vérifier toutes les 24 heures (en secondes)
      WATCHTOWER_POLL_INTERVAL: 86400
      # Supprimer les anciennes images après mise à jour
      WATCHTOWER_CLEANUP: "true"
      # Notification par email (optionnel)
      # WATCHTOWER_NOTIFICATIONS: email
```

```bash
docker compose up -d
```

### Avec docker run

```bash
docker run -d \
  --name watchtower \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e WATCHTOWER_POLL_INTERVAL=86400 \
  -e WATCHTOWER_CLEANUP=true \
  containrrr/watchtower
```

## Configuration essentielle

### Fréquence de vérification

Par défaut, Watchtower vérifie toutes les 24 heures. Configurable via `WATCHTOWER_POLL_INTERVAL` (en secondes) :

```yaml
environment:
  WATCHTOWER_POLL_INTERVAL: 86400   # 24 heures
  # WATCHTOWER_POLL_INTERVAL: 3600  # 1 heure
  # WATCHTOWER_POLL_INTERVAL: 43200 # 12 heures
```

Vous pouvez aussi utiliser une expression cron pour des horaires précis :

```yaml
environment:
  WATCHTOWER_SCHEDULE: "0 0 4 * * *"  # tous les jours à 4h00
```

Format : `secondes minutes heures jour-du-mois mois jour-de-la-semaine`

### Exclure des conteneurs

Pour ne pas mettre à jour certains conteneurs (bases de données, services critiques...), ajouter un label :

```yaml
# dans le compose.yml du service à exclure
services:
  postgres:
    image: postgres:15
    labels:
      - "com.centurylinklabs.watchtower.enable=false"
```

### Mode opt-in : ne mettre à jour que les conteneurs autorisés

Par défaut, Watchtower surveille **tous** les conteneurs. Pour surveiller uniquement les conteneurs qui le demandent explicitement :

```yaml
# compose.yml de Watchtower
services:
  watchtower:
    image: containrrr/watchtower:latest
    environment:
      WATCHTOWER_LABEL_ENABLE: "true"  # mode opt-in
```

```yaml
# compose.yml d'un service surveillé
services:
  nginx:
    image: nginx:alpine
    labels:
      - "com.centurylinklabs.watchtower.enable=true"
```

## Mode surveillance seule (sans mise à jour automatique)

Pour être notifié des mises à jour disponibles sans les appliquer automatiquement :

```yaml
environment:
  WATCHTOWER_MONITOR_ONLY: "true"
  WATCHTOWER_NOTIFICATIONS: email
  WATCHTOWER_NOTIFICATION_EMAIL_FROM: watchtower@monserveur.fr
  WATCHTOWER_NOTIFICATION_EMAIL_TO: admin@mondomaine.fr
  WATCHTOWER_NOTIFICATION_EMAIL_SERVER: smtp.mondomaine.fr
  WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PORT: "587"
  WATCHTOWER_NOTIFICATION_EMAIL_SERVER_USER: user@mondomaine.fr
  WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PASSWORD: motdepasse
```

## Notifications

Watchtower supporte plusieurs canaux de notification.

### Slack

```yaml
environment:
  WATCHTOWER_NOTIFICATIONS: slack
  WATCHTOWER_NOTIFICATION_SLACK_HOOK_URL: "https://hooks.slack.com/services/..."
```

### Gotify (self-hosted)

```yaml
environment:
  WATCHTOWER_NOTIFICATIONS: gotify
  WATCHTOWER_NOTIFICATION_GOTIFY_URL: "https://gotify.votredomaine.fr"
  WATCHTOWER_NOTIFICATION_GOTIFY_TOKEN: "votre-token"
```

### Shoutrrr (universel)

Watchtower utilise la bibliothèque Shoutrrr qui supporte des dizaines de services (Telegram, Discord, Ntfy, Pushover...) :

```yaml
environment:
  WATCHTOWER_NOTIFICATIONS: shoutrrr
  WATCHTOWER_NOTIFICATION_SHOUTRRR_URL: "telegram://token@telegram?channels=channel-id"
```

## Mise à jour manuelle à la demande

Pour déclencher une vérification immédiate sans attendre l'intervalle :

```bash
# Forcer la vérification maintenant
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower --run-once
```

Ou avec un conteneur Watchtower déjà en cours :

```bash
docker exec watchtower /watchtower --run-once
```

## Mettre à jour un conteneur spécifique

```bash
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower --run-once nom-du-conteneur
```

## Bonnes pratiques

### Utiliser des tags fixes pour les services critiques

Watchtower met à jour vers la dernière version du tag utilisé. Pour les services critiques (bases de données, applications de production), utiliser un tag fixe :

```yaml
# Pas surveillé par Watchtower (tag fixe = pas de "latest")
image: postgres:15.4

# Surveillé par Watchtower (latest = toujours la dernière)
image: nginx:latest
```

### Exclure les bases de données des mises à jour automatiques

Les mises à jour de bases de données (PostgreSQL, MariaDB) nécessitent souvent des migrations. Les exclure de Watchtower et les gérer manuellement :

```yaml
services:
  db:
    image: mariadb:11
    labels:
      - "com.centurylinklabs.watchtower.enable=false"
```

### Planifier les mises à jour en dehors des heures de pointe

```yaml
environment:
  WATCHTOWER_SCHEDULE: "0 0 3 * * 0"  # dimanche à 3h00
```

## Logs et surveillance

```bash
# Voir les logs de Watchtower en temps réel
docker logs -f watchtower

# Exemple de sortie lors d'une mise à jour
# time="..." level=info msg="Found new nginx:alpine image (sha256:...)"
# time="..." level=info msg="Stopping /nginx (sha256:...) with SIGTERM"
# time="..." level=info msg="Creating /nginx"
```

## Récapitulatif de la configuration

```yaml
services:
  watchtower:
    image: containrrr/watchtower:latest
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      WATCHTOWER_SCHEDULE: "0 0 4 * * *"  # 4h00 chaque nuit
      WATCHTOWER_CLEANUP: "true"           # supprimer les vieilles images
      WATCHTOWER_INCLUDE_STOPPED: "false"  # ignorer les conteneurs arrêtés
      WATCHTOWER_LABEL_ENABLE: "false"     # surveiller tous les conteneurs
      TZ: "Europe/Paris"
```

Watchtower est une brique essentielle d'un homelab bien maintenu. Couplé à [Docker Compose](/blog/docker-compose-orchestrer-conteneurs) pour l'orchestration et [Portainer](/blog/portainer-interface-docker) pour la supervision, vous avez une infrastructure Docker qui se maintient presque d'elle-même.
