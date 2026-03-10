---
title: "Fail2ban : protéger ses services contre les attaques brute-force"
description: Fail2ban surveille vos logs et bannit automatiquement les IP suspectes. Protégez SSH, Nginx et vos services en quelques minutes.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
  - sécurité
  - ssh
language: fr
draft: false
comment: true
---

Les attaques par brute-force sont omniprésentes sur internet. Dès qu'un serveur est exposé, des bots tentent de s'y connecter en essayant des milliers de combinaisons d'identifiants et de mots de passe. **Fail2ban** est la solution de référence pour bloquer automatiquement ces tentatives.

## Qu'est-ce que Fail2ban ?

Fail2ban est un outil open source qui analyse les fichiers de logs de vos services et **bannit temporairement les adresses IP** qui présentent des comportements suspects (trop de tentatives de connexion échouées en peu de temps).

Il fonctionne en deux étapes :

1. **Surveillance** : il lit les logs en temps réel (`/var/log/auth.log`, `/var/log/nginx/access.log`, etc.)
2. **Action** : quand une IP dépasse le seuil configuré, il ajoute une règle dans `iptables` (ou `nftables`) pour la bloquer

## Installation

### Debian / Ubuntu

```bash
sudo apt update && sudo apt install fail2ban -y
```

### RHEL / AlmaLinux / Rocky Linux

```bash
sudo dnf install epel-release -y
sudo dnf install fail2ban -y
```

### Activer et démarrer le service

```bash
sudo systemctl enable --now fail2ban
sudo systemctl status fail2ban
```

## Configuration de base

Fail2ban utilise deux niveaux de configuration :

- `/etc/fail2ban/jail.conf` — fichier original du paquet (**ne jamais modifier**)
- `/etc/fail2ban/jail.local` — vos surcharges personnalisées (**c'est ici qu'on travaille**)

Créez votre fichier de configuration :

```bash
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

### Paramètres globaux essentiels

Dans la section `[DEFAULT]` :

```ini
[DEFAULT]
# Durée de bannissement (en secondes) — 1 heure
bantime  = 3600

# Fenêtre de temps pour compter les tentatives (10 minutes)
findtime = 600

# Nombre de tentatives avant bannissement
maxretry = 5

# Votre propre IP à ne jamais bannir (remplacez par votre IP)
ignoreip = 127.0.0.1/8 ::1
```

## Protéger SSH

La jail SSH est activée par défaut sur la plupart des distributions. Vérifiez et ajustez :

```ini
[sshd]
enabled  = true
port     = ssh
filter   = sshd
logpath  = /var/log/auth.log
maxretry = 3
bantime  = 86400
```

> **Astuce** : Si vous avez changé le port SSH (ex: 2222), remplacez `port = ssh` par `port = 2222`.

## Protéger Nginx

### Blocage des erreurs 4xx

```ini
[nginx-http-auth]
enabled  = true
filter   = nginx-http-auth
logpath  = /var/log/nginx/error.log
maxretry = 5

[nginx-limit-req]
enabled  = true
filter   = nginx-limit-req
logpath  = /var/log/nginx/error.log
maxretry = 10

[nginx-botsearch]
enabled  = true
filter   = nginx-botsearch
logpath  = /var/log/nginx/access.log
maxretry = 2
```

Rechargez Fail2ban après modification :

```bash
sudo systemctl reload fail2ban
```

## Commandes utiles

### Voir les jails actives

```bash
sudo fail2ban-client status
```

Exemple de sortie :

```
Status
|- Number of jail: 2
`- Jail list: nginx-http-auth, sshd
```

### Voir les IP bannies d'une jail

```bash
sudo fail2ban-client status sshd
```

### Débannir une IP manuellement

Si vous vous êtes banni vous-même :

```bash
sudo fail2ban-client set sshd unbanip 192.168.1.100
```

### Tester un filtre sur un fichier de log

```bash
sudo fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf
```

## Créer une jail personnalisée

Exemple pour protéger une application custom qui log dans `/var/log/monapp/access.log` :

### 1. Créer le filtre

```bash
sudo nano /etc/fail2ban/filter.d/monapp.conf
```

```ini
[Definition]
failregex = ^<HOST> .* "POST /login" 401
ignoreregex =
```

### 2. Créer la jail

Dans `/etc/fail2ban/jail.local` :

```ini
[monapp]
enabled  = true
filter   = monapp
logpath  = /var/log/monapp/access.log
maxretry = 5
bantime  = 3600
```

### 3. Recharger

```bash
sudo fail2ban-client reload
```

## Vérifier les bannissements dans les logs

```bash
sudo tail -f /var/log/fail2ban.log
```

Exemple de sortie lors d'un bannissement :

```
2026-03-10 08:23:11,456 fail2ban.actions [1234]: NOTICE  [sshd] Ban 185.220.101.45
```

## Configurer les notifications par email (optionnel)

Dans `/etc/fail2ban/jail.local`, section `[DEFAULT]` :

```ini
destemail = votre@email.fr
sender    = fail2ban@votre-serveur.fr
mta       = sendmail
action    = %(action_mwl)s
```

> `action_mwl` = mail avec les logs (`m`ail + `w`hois + `l`og)

## Récapitulatif

| Commande | Description |
|---|---|
| `fail2ban-client status` | Lister les jails actives |
| `fail2ban-client status sshd` | Voir les IP bannies de SSH |
| `fail2ban-client set sshd unbanip <IP>` | Débannir une IP |
| `fail2ban-client reload` | Recharger la configuration |
| `fail2ban-regex <log> <filtre>` | Tester un filtre |

Fail2ban est un outil simple mais redoutablement efficace. Couplé à un [pare-feu UFW](/blog/ufw-configurer-pare-feu-linux) et à une [configuration SSH solide](/blog/configuration-ssh), il constitue une première ligne de défense essentielle pour tout serveur exposé sur internet.
