---
title: "logrotate : gérer la rotation des logs sous Linux"
description: Sans rotation des logs, vos fichiers /var/log grossissent indéfiniment. Logrotate automatise la compression, l'archivage et la suppression des anciens logs.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
  - automatisation
language: fr
draft: true
comment: true
---

Sur un serveur actif, les fichiers de logs grossissent en permanence. Sans gestion, `/var/log` peut saturer le disque et provoquer des pannes en cascade. **logrotate** est l'outil standard sous Linux pour automatiser la rotation des logs : compression, archivage, suppression des anciens fichiers, notification des services concernés.

## Qu'est-ce que logrotate ?

logrotate est un utilitaire qui tourne périodiquement (via cron ou systemd) et applique des règles de rotation à vos fichiers de logs :

- **Rotation** : renommer `app.log` en `app.log.1`, puis `app.log.1` en `app.log.2`...
- **Compression** : compresser les anciens logs (`app.log.1.gz`)
- **Suppression** : effacer les logs au-delà d'un certain nombre de rotations
- **Signal** : envoyer un signal au service pour qu'il réouvre son fichier de log

Il est préinstallé sur toutes les distributions Linux majeures.

## Fonctionnement général

logrotate est exécuté quotidiennement par cron (`/etc/cron.daily/logrotate`).

Il lit :
- `/etc/logrotate.conf` — configuration globale
- `/etc/logrotate.d/` — configurations par service (un fichier par service)

## Configuration globale (`/etc/logrotate.conf`)

```bash
cat /etc/logrotate.conf
```

```ini
# Rotation hebdomadaire par défaut
weekly

# Conserver 4 semaines d'historique
rotate 4

# Compresser les anciens logs
compress

# Ne pas échouer si le fichier est absent
missingok

# Ne pas rotater les fichiers vides
notifempty

# Inclure les configurations par service
include /etc/logrotate.d
```

## Syntaxe d'une configuration

```ini
/chemin/vers/fichier.log {
    daily           # fréquence : daily, weekly, monthly, yearly
    rotate 7        # nombre d'archives à conserver
    compress        # compresser avec gzip
    delaycompress   # ne pas compresser la rotation la plus récente
    missingok       # ignorer si le fichier n'existe pas
    notifempty      # ne pas rotater si le fichier est vide
    create 0640 user group  # créer un nouveau fichier vide avec ces droits
    postrotate
        # Commande exécutée après la rotation
        systemctl reload monservice > /dev/null 2>&1 || true
    endscript
}
```

## Options essentielles

| Option | Description |
|---|---|
| `daily` / `weekly` / `monthly` | Fréquence de rotation |
| `rotate N` | Nombre d'archives à conserver |
| `compress` | Compresser avec gzip |
| `delaycompress` | Reporter la compression d'une rotation (utile si le service garde le fichier ouvert) |
| `missingok` | Ne pas errorer si le fichier est absent |
| `notifempty` | Ignorer les fichiers vides |
| `create MODE USER GROUP` | Recréer le fichier après rotation |
| `size N` | Rotater quand le fichier dépasse N (ex: `100M`, `1G`) |
| `maxsize N` | Rotation forcée si taille dépassée (même si la fréquence n'est pas atteinte) |
| `dateext` | Suffixer avec la date plutôt qu'un numéro (`app.log-20260310.gz`) |
| `copytruncate` | Copier puis vider — utile si le service ne peut pas rouvrir le fichier |
| `postrotate` / `endscript` | Commandes exécutées après la rotation |
| `prerotate` / `endscript` | Commandes exécutées avant la rotation |
| `sharedscripts` | Exécuter postrotate une seule fois même pour plusieurs fichiers |

## Exemples pratiques

### Nginx

```ini
# /etc/logrotate.d/nginx

/var/log/nginx/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 $(cat /var/run/nginx.pid)
        fi
    endscript
}
```

> Le signal `USR1` dit à Nginx de rouvrir ses fichiers de log — nécessaire après la rotation.

### Application custom

```ini
# /etc/logrotate.d/monapp

/var/log/monapp/*.log {
    weekly
    rotate 8
    compress
    delaycompress
    missingok
    notifempty
    dateext
    create 0644 monuser monuser
    postrotate
        systemctl reload monapp > /dev/null 2>&1 || true
    endscript
}
```

### Logs avec rotation par taille

```ini
# Rotater dès que le fichier dépasse 100 Mo
/var/log/grosfichier.log {
    size 100M
    rotate 5
    compress
    missingok
    copytruncate
}
```

`copytruncate` est utile quand le processus garde le fichier ouvert en permanence et ne peut pas le rouvrir.

### Plusieurs fichiers dans une règle

```ini
/var/log/app/access.log
/var/log/app/error.log
/var/log/app/debug.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    sharedscripts
    postrotate
        systemctl reload app
    endscript
}
```

## Tester sa configuration

### Dry-run (simuler sans appliquer)

```bash
sudo logrotate --debug /etc/logrotate.d/monapp
```

Affiche ce qui serait fait sans modifier aucun fichier.

### Forcer la rotation maintenant

```bash
# Forcer la rotation même si la fréquence n'est pas atteinte
sudo logrotate --force /etc/logrotate.d/monapp
```

Utile pour tester ou pour une rotation manuelle d'urgence.

### Vérifier le fichier d'état

logrotate conserve la date de la dernière rotation dans `/var/lib/logrotate/status` :

```bash
cat /var/lib/logrotate/status
```

```
logrotate state -- version 2
"/var/log/nginx/access.log" 2026-3-10-6:0:0
"/var/log/monapp/app.log" 2026-3-7-6:0:0
```

## Surveiller les erreurs de logrotate

Les erreurs de logrotate sont dans le journal système :

```bash
sudo journalctl -u logrotate
# ou
sudo grep logrotate /var/log/syslog
```

## Créer une configuration pour un nouveau service

Procédure complète pour un service custom :

```bash
# 1. Créer le fichier de configuration
sudo nano /etc/logrotate.d/monservice

# 2. Tester en dry-run
sudo logrotate --debug /etc/logrotate.d/monservice

# 3. Forcer une première rotation pour valider
sudo logrotate --force /etc/logrotate.d/monservice

# 4. Vérifier que les logs sont bien archivés
ls -lh /var/log/monservice/
```

## Récapitulatif

| Commande | Description |
|---|---|
| `logrotate --debug /etc/logrotate.d/xxx` | Simuler sans appliquer |
| `logrotate --force /etc/logrotate.d/xxx` | Forcer la rotation |
| `logrotate /etc/logrotate.conf` | Exécuter manuellement toutes les règles |
| `cat /var/lib/logrotate/status` | Voir les dates de dernière rotation |

logrotate est un outil discret mais indispensable. Associé à [systemd](/blog/systemd-creer-gerer-services) pour la journalisation via `journald` et à [crontab](/blog/planification-de-taches-avec-crontab) pour l'automatisation, il complète une infrastructure de logs bien gérée.
