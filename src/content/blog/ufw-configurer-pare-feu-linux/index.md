---
title: "UFW : configurer un pare-feu simple sous Linux"
description: UFW (Uncomplicated Firewall) est l'outil idéal pour gérer iptables simplement. Apprenez à sécuriser votre serveur Linux avec des règles claires et efficaces.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
  - sécurité
  - réseau
language: fr
draft: false
comment: true
---

Un serveur Linux exposé sur internet sans pare-feu, c'est une porte grande ouverte. **UFW** (Uncomplicated Firewall) est l'interface la plus simple pour configurer `iptables` sous Linux. Installé par défaut sur Ubuntu, il permet de définir des règles de filtrage réseau sans connaître la syntaxe complexe d'iptables.

## Qu'est-ce que UFW ?

UFW est une interface en ligne de commande qui simplifie la gestion d'`iptables`. Il suit un principe simple : **tout est bloqué par défaut, vous ouvrez uniquement ce dont vous avez besoin**.

## Installation

### Ubuntu / Debian

UFW est préinstallé sur Ubuntu. Sur Debian :

```bash
sudo apt install ufw -y
```

### RHEL / AlmaLinux / Rocky Linux

```bash
sudo dnf install ufw -y
```

## Avant d'activer UFW : autoriser SSH

> **Attention** : activez toujours la règle SSH **avant** d'activer UFW, sinon vous vous retrouvez coupé de votre serveur.

```bash
sudo ufw allow ssh
```

Si votre SSH utilise un port personnalisé (ex: 2222) :

```bash
sudo ufw allow 2222/tcp
```

## Activer UFW

```bash
sudo ufw enable
```

Vérifier le statut :

```bash
sudo ufw status verbose
```

## Règles essentielles

### Autoriser un service par nom

UFW reconnaît les services courants via `/etc/services` :

```bash
sudo ufw allow ssh       # Port 22
sudo ufw allow http      # Port 80
sudo ufw allow https     # Port 443
```

### Autoriser un port spécifique

```bash
# TCP uniquement
sudo ufw allow 8080/tcp

# UDP uniquement
sudo ufw allow 53/udp

# TCP et UDP
sudo ufw allow 1194
```

### Autoriser une plage de ports

```bash
sudo ufw allow 6000:6007/tcp
```

### Bloquer un port

```bash
sudo ufw deny 3306/tcp
```

### Autoriser une IP spécifique

```bash
# Autoriser toutes les connexions depuis une IP
sudo ufw allow from 192.168.1.100

# Autoriser une IP sur un port précis
sudo ufw allow from 192.168.1.100 to any port 22
```

### Autoriser un sous-réseau

```bash
# Autoriser tout votre réseau local sur SSH
sudo ufw allow from 192.168.1.0/24 to any port 22
```

### Bloquer une IP

```bash
sudo ufw deny from 203.0.113.0
```

## Configuration typique pour un serveur web

```bash
# Réinitialiser les règles (optionnel, pour repartir proprement)
sudo ufw reset

# Politique par défaut : tout bloquer en entrée
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Autoriser SSH (à faire EN PREMIER)
sudo ufw allow ssh

# Autoriser le trafic web
sudo ufw allow http
sudo ufw allow https

# Activer
sudo ufw enable
```

## Configuration typique pour un serveur de base de données

Un serveur MariaDB/MySQL qui n'est accessible que depuis un serveur web spécifique :

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing

# SSH depuis votre IP d'administration uniquement
sudo ufw allow from 203.0.113.10 to any port 22

# MariaDB accessible uniquement depuis le serveur web
sudo ufw allow from 192.168.1.50 to any port 3306

sudo ufw enable
```

## Voir les règles actives

```bash
sudo ufw status verbose
```

Exemple de sortie :

```
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443                        ALLOW IN    Anywhere
22/tcp (v6)                ALLOW IN    Anywhere (v6)
80/tcp (v6)                ALLOW IN    Anywhere (v6)
443 (v6)                   ALLOW IN    Anywhere (v6)
```

Pour voir les règles numérotées :

```bash
sudo ufw status numbered
```

## Supprimer une règle

### Par numéro

```bash
# Afficher les règles numérotées
sudo ufw status numbered

# Supprimer la règle n°3
sudo ufw delete 3
```

### Par description

```bash
sudo ufw delete allow http
sudo ufw delete allow 8080/tcp
```

## Profils d'application

UFW peut gérer des profils d'application. Pour voir ceux disponibles :

```bash
sudo ufw app list
```

Exemple de sortie :

```
Available applications:
  Nginx Full
  Nginx HTTP
  Nginx HTTPS
  OpenSSH
```

Utiliser un profil :

```bash
# Autoriser Nginx HTTP + HTTPS
sudo ufw allow 'Nginx Full'

# Autoriser Nginx HTTPS uniquement
sudo ufw allow 'Nginx HTTPS'
```

## Activer les logs

```bash
# Activer le logging (niveau low par défaut)
sudo ufw logging on

# Niveau plus détaillé
sudo ufw logging medium
```

Les logs sont disponibles dans `/var/log/ufw.log` :

```bash
sudo tail -f /var/log/ufw.log
```

## Désactiver / réinitialiser UFW

```bash
# Désactiver sans perdre les règles
sudo ufw disable

# Réinitialiser toutes les règles
sudo ufw reset
```

## UFW et Fail2ban

UFW et [Fail2ban](/blog/fail2ban-proteger-services-brute-force) fonctionnent très bien ensemble. Fail2ban crée automatiquement des règles UFW/iptables pour bannir les IP malveillantes. Pour que Fail2ban utilise UFW comme backend, dans `/etc/fail2ban/jail.local` :

```ini
[DEFAULT]
banaction = ufw
```

## Récapitulatif des commandes

| Commande | Description |
|---|---|
| `ufw enable` | Activer le pare-feu |
| `ufw disable` | Désactiver le pare-feu |
| `ufw status verbose` | Afficher les règles actives |
| `ufw status numbered` | Afficher les règles numérotées |
| `ufw allow ssh` | Autoriser SSH |
| `ufw allow 80/tcp` | Autoriser un port TCP |
| `ufw deny 3306/tcp` | Bloquer un port TCP |
| `ufw allow from 192.168.1.0/24` | Autoriser un sous-réseau |
| `ufw delete 3` | Supprimer la règle n°3 |
| `ufw reset` | Réinitialiser toutes les règles |

UFW est simple, lisible et suffisant pour la grande majorité des serveurs. Combiné à [Fail2ban](/blog/fail2ban-proteger-services-brute-force) pour le bannissement dynamique et à une [configuration SSH solide](/blog/configuration-ssh), vous disposez d'une sécurité de base robuste sans complexité inutile.
