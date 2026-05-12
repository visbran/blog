---
title: "systemd : créer et gérer ses propres services Linux"
description: systemd gère les services Linux. Créez vos propres units, activez le démarrage automatique et consultez les logs avec journalctl.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
  - automatisation
language: fr
draft: true
comment: true
---

Quand on administre un serveur Linux, on finit toujours par avoir besoin de lancer un script ou une application automatiquement au démarrage, de la redémarrer en cas de crash, et de consulter ses logs facilement. **systemd** est le système qui gère tout ça, et créer son propre service est plus simple qu'il n'y paraît.

## Qu'est-ce que systemd ?

systemd est le gestionnaire de processus (*init system*) utilisé par la quasi-totalité des distributions Linux modernes : Ubuntu, Debian, RHEL, Fedora, Arch Linux...

Il remplace les anciens scripts d'init (`/etc/init.d/`) et offre :
- Démarrage parallèle des services (plus rapide)
- Gestion des dépendances entre services
- Redémarrage automatique en cas de crash
- Journalisation centralisée via `journald`
- Timers (alternative à cron)

## Les commandes systemctl essentielles

```bash
# Démarrer un service
sudo systemctl start nginx

# Arrêter un service
sudo systemctl stop nginx

# Redémarrer un service
sudo systemctl restart nginx

# Recharger la configuration sans redémarrer
sudo systemctl reload nginx

# Activer le démarrage automatique au boot
sudo systemctl enable nginx

# Désactiver le démarrage automatique
sudo systemctl disable nginx

# Activer ET démarrer en une commande
sudo systemctl enable --now nginx

# Vérifier l'état d'un service
sudo systemctl status nginx
```

### Lire le statut d'un service

```bash
sudo systemctl status nginx
```

```
● nginx.service - A high performance web server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
     Active: active (running) since Mon 2026-03-10 10:00:00 CET
    Process: 1234 ExecStartPre=/usr/sbin/nginx -t
   Main PID: 1235 (nginx)
```

- **Loaded** : le fichier .service est chargé ; `enabled` = démarre au boot
- **Active: active (running)** : le service tourne
- **Active: failed** : le service a planté

## Structure d'un fichier .service

Les fichiers de service sont des fichiers texte avec l'extension `.service`, divisés en trois sections :

```ini
[Unit]
Description=Description de mon service
After=network.target        # Démarre après le réseau

[Service]
Type=simple
ExecStart=/usr/bin/monapp --option
Restart=on-failure
User=monuser

[Install]
WantedBy=multi-user.target  # Démarre en mode normal (multi-utilisateurs)
```

### Section [Unit]

| Directive | Description |
|---|---|
| `Description=` | Description lisible du service |
| `After=` | Démarre après ces unités |
| `Requires=` | Dépendances obligatoires |
| `Wants=` | Dépendances optionnelles |

### Section [Service]

| Directive | Description |
|---|---|
| `Type=simple` | Le processus principal est ExecStart (par défaut) |
| `Type=forking` | Le processus se "fork" en arrière-plan |
| `Type=oneshot` | S'exécute une fois et se termine |
| `ExecStart=` | Commande de démarrage (chemin absolu obligatoire) |
| `ExecStop=` | Commande d'arrêt |
| `ExecReload=` | Commande de rechargement |
| `Restart=` | Politique de redémarrage |
| `RestartSec=` | Délai avant redémarrage (ex: `5s`) |
| `User=` | Utilisateur sous lequel tourne le service |
| `WorkingDirectory=` | Répertoire de travail |
| `Environment=` | Variables d'environnement |
| `EnvironmentFile=` | Fichier de variables d'environnement |

### Valeurs de Restart=

| Valeur | Comportement |
|---|---|
| `no` | Jamais redémarré (défaut) |
| `always` | Toujours redémarré |
| `on-failure` | Redémarré uniquement en cas d'erreur |
| `on-abnormal` | Redémarré si signal ou timeout |

### Section [Install]

```ini
WantedBy=multi-user.target   # Mode normal sans interface graphique
WantedBy=graphical.target    # Mode avec interface graphique
```

## Exemple 1 : service pour un script Python

On a un script Python `/opt/monapp/app.py` qu'on veut lancer comme service.

```bash
sudo nano /etc/systemd/system/monapp.service
```

```ini
[Unit]
Description=Mon application Python
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/monapp
ExecStart=/usr/bin/python3 /opt/monapp/app.py
Restart=on-failure
RestartSec=5s
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
# Recharger systemd pour prendre en compte le nouveau fichier
sudo systemctl daemon-reload

# Activer et démarrer le service
sudo systemctl enable --now monapp

# Vérifier
sudo systemctl status monapp
```

## Exemple 2 : service avec variables d'environnement

Pour ne pas mettre de secrets dans le fichier .service, utiliser un fichier d'environnement :

```bash
# Créer le fichier d'environnement
sudo nano /etc/monapp/env

# Contenu
DB_HOST=localhost
DB_PASSWORD=monsecret
API_KEY=abcdef123
```

```bash
# Sécuriser le fichier
sudo chmod 600 /etc/monapp/env
```

```ini
[Service]
EnvironmentFile=/etc/monapp/env
ExecStart=/opt/monapp/app
```

Les variables sont alors disponibles dans le processus comme des variables d'environnement classiques.

## Exemple 3 : service Node.js

```ini
[Unit]
Description=Application Node.js
After=network.target

[Service]
Type=simple
User=nodeuser
WorkingDirectory=/var/www/monapp
ExecStart=/usr/bin/node /var/www/monapp/server.js
Restart=always
RestartSec=3s
Environment=NODE_ENV=production
Environment=PORT=3000
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

## Consulter les logs avec journalctl

systemd centralise les logs de tous les services dans **journald**.

```bash
# Logs d'un service spécifique
sudo journalctl -u monapp

# Logs en temps réel
sudo journalctl -u monapp -f

# Dernières 50 lignes
sudo journalctl -u monapp -n 50

# Logs depuis le dernier boot
sudo journalctl -u monapp -b

# Logs d'une période donnée
sudo journalctl -u monapp --since "2026-03-01" --until "2026-03-10"

# Logs de tous les services (journal complet)
sudo journalctl -f
```

## Timers systemd : alternative à cron

Les timers systemd peuvent remplacer [crontab](/blog/planification-de-taches-avec-crontab). Ils offrent une meilleure gestion des erreurs et une journalisation intégrée.

### Créer un timer pour exécuter une tâche quotidienne

**Fichier service** `/etc/systemd/system/backup.service` :

```ini
[Unit]
Description=Sauvegarde quotidienne
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
User=root
```

**Fichier timer** `/etc/systemd/system/backup.timer` :

```ini
[Unit]
Description=Lancer backup.service chaque nuit

[Timer]
# Tous les jours à 2h00
OnCalendar=*-*-* 02:00:00
# Rattraper si le système était éteint
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
# Activer le timer (pas le service — c'est le timer qui le déclenche)
sudo systemctl enable --now backup.timer

# Voir les timers actifs
systemctl list-timers
```

## Déboguer un service qui ne démarre pas

```bash
# 1. Voir l'erreur dans le statut
sudo systemctl status monapp

# 2. Voir les logs détaillés
sudo journalctl -u monapp -n 50 --no-pager

# 3. Vérifier la syntaxe du fichier .service
sudo systemd-analyze verify /etc/systemd/system/monapp.service

# 4. Tester la commande manuellement
sudo -u monuser /chemin/vers/monapp
```

## Commandes de gestion avancées

```bash
# Recharger tous les fichiers .service modifiés
sudo systemctl daemon-reload

# Lister tous les services actifs
systemctl list-units --type=service --state=active

# Lister les services en échec
systemctl list-units --type=service --state=failed

# Voir les dépendances d'un service
systemctl list-dependencies nginx

# Voir le temps de démarrage de chaque service
systemd-analyze blame
```

## Récapitulatif

| Commande | Description |
|---|---|
| `systemctl start/stop/restart <service>` | Contrôler un service |
| `systemctl enable --now <service>` | Activer + démarrer |
| `systemctl status <service>` | État du service |
| `journalctl -u <service> -f` | Logs en temps réel |
| `systemctl daemon-reload` | Recharger après modification |
| `systemd-analyze blame` | Temps de démarrage |
| `systemctl list-timers` | Lister les timers actifs |

systemd est incontournable sur Linux moderne. Maîtriser la création de services permet d'industrialiser n'importe quel script ou application. Combiné aux [timers comme alternative à cron](/blog/planification-de-taches-avec-crontab), c'est un outil très puissant pour l'automatisation.
