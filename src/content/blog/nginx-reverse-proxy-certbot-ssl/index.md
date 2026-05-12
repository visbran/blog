---
title: "Nginx reverse proxy avec SSL Let's Encrypt via Certbot"
description: Configurez Nginx comme reverse proxy pour exposer vos services en HTTPS avec des certificats SSL gratuits Let's Encrypt générés automatiquement par Certbot.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
  - réseau
  - nginx
language: fr
draft: true
comment: true
---

Exposer un service web en HTTPS est aujourd'hui indispensable. **Nginx** configuré en reverse proxy permet de centraliser l'accès à plusieurs services derrière un seul serveur, tandis que **Certbot** génère et renouvelle automatiquement les certificats SSL Let's Encrypt. Cette combinaison est la référence pour les serveurs bare metal (sans Docker).

> Si vous utilisez Docker, [Traefik](/blog/traefik-reverse-proxy-docker) automatise l'ensemble de ce processus. Cet article s'adresse aux serveurs avec services natifs (sans conteneurs).

## Prérequis

- Un serveur Linux avec une IP publique
- Un nom de domaine pointant vers cette IP (enregistrement DNS A)
- Nginx installé
- Ports 80 et 443 ouverts dans le pare-feu

```bash
# Vérifier que le DNS est bien propagé
dig monservice.domaine.fr
# doit retourner l'IP de votre serveur
```

## Installation

### Nginx

```bash
# Debian / Ubuntu
sudo apt update && sudo apt install nginx -y

# RHEL / AlmaLinux
sudo dnf install nginx -y
sudo systemctl enable --now nginx
```

### Certbot

```bash
# Debian / Ubuntu
sudo apt install certbot python3-certbot-nginx -y

# RHEL / AlmaLinux
sudo dnf install epel-release -y
sudo dnf install certbot python3-certbot-nginx -y
```

### Ouvrir les ports

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Configurer Nginx comme reverse proxy

### Structure des fichiers de configuration

```
/etc/nginx/
├── nginx.conf              Configuration principale
├── sites-available/        Configurations disponibles
│   └── monservice.conf     Config de votre service
└── sites-enabled/          Liens symboliques vers sites-available
    └── monservice.conf -> ../sites-available/monservice.conf
```

### Créer la configuration du service

```bash
sudo nano /etc/nginx/sites-available/monservice.conf
```

```nginx
server {
    listen 80;
    server_name monservice.domaine.fr;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Remplacer :
- `monservice.domaine.fr` par votre domaine
- `http://127.0.0.1:8080` par l'adresse interne du service à exposer

### Activer la configuration

```bash
sudo ln -s /etc/nginx/sites-available/monservice.conf /etc/nginx/sites-enabled/

# Vérifier la syntaxe
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

## Générer le certificat SSL avec Certbot

```bash
sudo certbot --nginx -d monservice.domaine.fr
```

Certbot :
1. Vérifie que vous contrôlez le domaine (challenge HTTP sur le port 80)
2. Génère le certificat Let's Encrypt
3. **Modifie automatiquement** votre configuration Nginx pour activer HTTPS

Exemple de sortie :

```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/monservice.domaine.fr/fullchain.pem
Key is saved at: /etc/letsencrypt/live/monservice.domaine.fr/privkey.pem

Deploying certificate to VirtualHost /etc/nginx/sites-enabled/monservice.conf
Redirecting all traffic on port 80 to ssl in /etc/nginx/sites-enabled/monservice.conf
```

Votre configuration est automatiquement mise à jour avec HTTPS.

## Configuration Nginx après Certbot

Après l'exécution de Certbot, le fichier de configuration ressemble à :

```nginx
server {
    listen 80;
    server_name monservice.domaine.fr;
    return 301 https://$host$request_uri;  # Redirection HTTP → HTTPS
}

server {
    listen 443 ssl;
    server_name monservice.domaine.fr;

    ssl_certificate /etc/letsencrypt/live/monservice.domaine.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/monservice.domaine.fr/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Exemple complet : plusieurs services

```nginx
# /etc/nginx/sites-available/services.conf

# Service 1 : application web sur le port 3000
server {
    listen 443 ssl;
    server_name app.domaine.fr;

    ssl_certificate /etc/letsencrypt/live/app.domaine.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.domaine.fr/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";  # WebSocket support
    }
}

# Service 2 : Gitea sur le port 3001
server {
    listen 443 ssl;
    server_name git.domaine.fr;

    ssl_certificate /etc/letsencrypt/live/git.domaine.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/git.domaine.fr/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirection HTTP → HTTPS pour tous les domaines
server {
    listen 80;
    server_name app.domaine.fr git.domaine.fr;
    return 301 https://$host$request_uri;
}
```

Générer les certificats pour plusieurs domaines :

```bash
sudo certbot --nginx -d app.domaine.fr -d git.domaine.fr
```

## Renouvellement automatique des certificats

Les certificats Let's Encrypt expirent après 90 jours. Certbot configure automatiquement un timer systemd ou une tâche cron pour le renouvellement :

```bash
# Vérifier le timer de renouvellement
sudo systemctl status certbot.timer

# Tester le renouvellement (simulation)
sudo certbot renew --dry-run
```

## Optimisations de sécurité

### En-têtes de sécurité

Ajouter dans le bloc `server` HTTPS :

```nginx
# HSTS : forcer HTTPS pour 1 an
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Empêcher le clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# Empêcher le sniffing MIME
add_header X-Content-Type-Options "nosniff" always;
```

### Limiter la taille des requêtes

```nginx
# Limite à 10 Mo par requête (utile pour les uploads)
client_max_body_size 10M;
```

### Rate limiting

```nginx
# Définir une zone de rate limiting (dans nginx.conf, section http)
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# Appliquer dans un bloc location
location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://127.0.0.1:8080;
}
```

## Dépannage

### `nginx -t` signale une erreur

```bash
sudo nginx -t
# nginx: [emerg] unknown directive "..." in /etc/nginx/sites-enabled/...
```

Vérifier la syntaxe du fichier de configuration. Chaque directive doit se terminer par `;`.

### 502 Bad Gateway

Le service en amont n'est pas accessible. Vérifier :
```bash
# Le service tourne bien ?
sudo systemctl status monservice

# Le port est bien en écoute ?
ss -tlnp | grep 8080
```

### Certificat non généré (challenge échoue)

Vérifier que le port 80 est accessible depuis internet :
```bash
curl http://monservice.domaine.fr
```

Si un pare-feu externe (provider cloud) bloque le port 80, l'ouvrir dans la console du fournisseur.

## Récapitulatif des commandes

| Commande | Description |
|---|---|
| `nginx -t` | Vérifier la syntaxe de la config |
| `systemctl reload nginx` | Recharger sans couper les connexions |
| `certbot --nginx -d domaine.fr` | Générer un certificat SSL |
| `certbot renew --dry-run` | Tester le renouvellement |
| `certbot certificates` | Lister les certificats |

Nginx + Certbot est la combinaison de référence pour les serveurs bare metal. Pour une infrastructure Docker, [Traefik](/blog/traefik-reverse-proxy-docker) offre une expérience plus automatisée. Dans tous les cas, compléter avec [UFW](/blog/ufw-configurer-pare-feu-linux) et [Fail2ban](/blog/fail2ban-proteger-services-brute-force) pour sécuriser l'exposition des services.
