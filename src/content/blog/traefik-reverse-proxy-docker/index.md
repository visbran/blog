---
title: "Traefik : reverse proxy Docker avec SSL Let's Encrypt automatique"
description: Traefik détecte automatiquement vos conteneurs Docker et génère des certificats SSL. Exposez vos services en HTTPS sans configuration manuelle de Nginx.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - docker
  - devops
  - linux
  - réseau
language: fr
draft: true
comment: true
---

Quand on multiplie les services Docker sur un serveur (Nextcloud, Gitea, Portainer, Grafana...), gérer les certificats SSL et les configurations Nginx à la main devient vite fastidieux. **Traefik** automatise entièrement ce travail : il détecte les conteneurs Docker via leurs labels, génère les certificats Let's Encrypt et gère le routage HTTPS — le tout sans toucher à un fichier de configuration pour chaque nouveau service.

## Qu'est-ce que Traefik ?

Traefik est un reverse proxy conçu pour les environnements conteneurisés. Contrairement à Nginx qui nécessite une configuration manuelle par service, Traefik se configure lui-même en lisant les **labels** des conteneurs Docker.

**Ses avantages pour un homelab / serveur :**
- Détection automatique des conteneurs Docker
- Certificats SSL Let's Encrypt générés et renouvelés automatiquement
- Dashboard web intégré pour visualiser les routes
- Zéro redémarrage pour ajouter un nouveau service
- Supporte HTTP, HTTPS, TCP, UDP

## Prérequis

- Docker + Docker Compose installés ([guide Docker](/blog/installer-docker-guide-complet-pour-debutants))
- Un nom de domaine avec des DNS configurés vers votre serveur
- Ports 80 et 443 ouverts dans votre pare-feu

```bash
# Ouvrir les ports avec UFW
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Architecture

```
Internet
    │
    ▼
[Traefik :80/:443]
    │
    ├── monapp.domaine.fr  ──→  conteneur:8080
    ├── blog.domaine.fr    ──→  conteneur:80
    └── git.domaine.fr     ──→  conteneur:3000
```

Traefik écoute sur les ports 80/443 et redirige le trafic vers le bon conteneur en fonction du nom de domaine.

## Structure des fichiers

```
traefik/
├── compose.yml           Définition du service Traefik
├── traefik.yml           Configuration statique de Traefik
├── config/
│   └── dynamic.yml       Configuration dynamique (middlewares...)
└── data/
    └── acme.json         Certificats Let's Encrypt (créé automatiquement)
```

## Configuration pas à pas

### 1. Créer le réseau Docker partagé

Tous les conteneurs exposés par Traefik doivent être sur le même réseau Docker :

```bash
docker network create traefik-network
```

### 2. Créer le fichier de certificats

```bash
mkdir -p traefik/data
touch traefik/data/acme.json
chmod 600 traefik/data/acme.json
```

> `chmod 600` est **obligatoire** — Traefik refuse de démarrer si le fichier est accessible en lecture par d'autres utilisateurs.

### 3. Configuration statique (`traefik.yml`)

```yaml
# traefik/traefik.yml

api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https

  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false   # Les conteneurs ne sont PAS exposés par défaut
    network: traefik-network

certificatesResolvers:
  letsencrypt:
    acme:
      email: votre@email.fr   # Remplacer par votre email
      storage: /data/acme.json
      httpChallenge:
        entryPoint: web
```

### 4. Configuration Docker Compose de Traefik (`compose.yml`)

```yaml
# traefik/compose.yml

services:
  traefik:
    image: traefik:v3.0
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/traefik.yml:ro
      - ./data/acme.json:/data/acme.json
    networks:
      - traefik-network
    labels:
      - "traefik.enable=true"
      # Dashboard Traefik — accessible sur dashboard.votredomaine.fr
      - "traefik.http.routers.dashboard.rule=Host(`dashboard.votredomaine.fr`)"
      - "traefik.http.routers.dashboard.entrypoints=websecure"
      - "traefik.http.routers.dashboard.tls.certresolver=letsencrypt"
      - "traefik.http.routers.dashboard.service=api@internal"
      # Protection par authentification basique
      - "traefik.http.routers.dashboard.middlewares=auth"
      - "traefik.http.middlewares.auth.basicauth.users=admin:$$apr1$$..."

networks:
  traefik-network:
    external: true
```

### Générer le mot de passe pour le dashboard

```bash
# Installer htpasswd
sudo apt install apache2-utils -y

# Générer le hash (remplacer 'admin' et 'monmotdepasse')
htpasswd -nb admin monmotdepasse
# Résultat : admin:$apr1$...
```

> Dans le fichier compose.yml, les `$` doivent être doublés (`$$`) pour échapper le YAML.

### 5. Démarrer Traefik

```bash
cd traefik/
docker compose up -d
docker compose logs -f traefik
```

## Exposer un service avec Traefik

Pour exposer un conteneur, il suffit d'ajouter des **labels** dans son `compose.yml` :

```yaml
# compose.yml d'un service quelconque (ex: Portainer)

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

**C'est tout.** Traefik détecte automatiquement ce conteneur, génère un certificat SSL pour `portainer.votredomaine.fr` et configure le routage.

### Explication des labels

| Label | Description |
|---|---|
| `traefik.enable=true` | Expose ce conteneur via Traefik |
| `traefik.http.routers.<nom>.rule` | Règle de routage (domaine, chemin...) |
| `traefik.http.routers.<nom>.entrypoints` | Point d'entrée (`web` ou `websecure`) |
| `traefik.http.routers.<nom>.tls.certresolver` | Résolveur SSL à utiliser |
| `traefik.http.services.<nom>.loadbalancer.server.port` | Port interne du conteneur |

## Middlewares utiles

Les middlewares permettent de transformer les requêtes avant qu'elles atteignent le conteneur.

### Redirection HTTP → HTTPS automatique

Déjà configurée dans `traefik.yml` via `redirections`. Toutes les requêtes HTTP sont redirigées vers HTTPS.

### Authentification basique

```yaml
labels:
  - "traefik.http.middlewares.auth-basic.basicauth.users=admin:$$apr1$$..."
  - "traefik.http.routers.monservice.middlewares=auth-basic"
```

### Rate limiting

```yaml
labels:
  - "traefik.http.middlewares.ratelimit.ratelimit.average=100"
  - "traefik.http.middlewares.ratelimit.ratelimit.burst=50"
  - "traefik.http.routers.monservice.middlewares=ratelimit"
```

### Headers de sécurité

```yaml
labels:
  - "traefik.http.middlewares.secheaders.headers.stsSeconds=31536000"
  - "traefik.http.middlewares.secheaders.headers.stsIncludeSubdomains=true"
  - "traefik.http.middlewares.secheaders.headers.forceSTSHeader=true"
```

## Vérifier les certificats

```bash
# Voir les certificats générés
cat traefik/data/acme.json | python3 -m json.tool | grep '"domain"' -A 3
```

Le renouvellement des certificats est automatique — Traefik les renouvelle 30 jours avant expiration.

## Dépannage

### Le certificat SSL ne se génère pas
- Vérifier que le domaine pointe bien vers l'IP du serveur : `dig votredomaine.fr`
- Vérifier que le port 80 est accessible depuis internet (nécessaire pour le challenge HTTP)
- Consulter les logs : `docker compose logs traefik | grep -i acme`

### Le service n'est pas accessible
- Vérifier que le conteneur est sur le réseau `traefik-network`
- Vérifier que `traefik.enable=true` est dans les labels
- Consulter le dashboard Traefik pour voir si la route est détectée

### `acme.json` — erreur de permissions
```bash
chmod 600 traefik/data/acme.json
```

## Récapitulatif

| Élément | Rôle |
|---|---|
| `traefik.yml` | Config statique (ports, provider Docker, Let's Encrypt) |
| `acme.json` | Stockage des certificats SSL |
| Labels `traefik.enable=true` | Active l'exposition du conteneur |
| Labels `routers.*.rule` | Définit le domaine de routage |
| Labels `tls.certresolver` | Active HTTPS automatique |
| Réseau `traefik-network` | Relie Traefik aux conteneurs |

Traefik transforme la gestion des services Docker exposés en quelque chose de presque automatique. Combiné à [Docker Compose](/blog/docker-compose-orchestrer-conteneurs) pour l'orchestration et [UFW](/blog/ufw-configurer-pare-feu-linux) pour le pare-feu, vous avez une infrastructure homelab solide et maintenable.
