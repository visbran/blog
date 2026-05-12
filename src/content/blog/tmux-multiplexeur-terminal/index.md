---
title: "tmux : le multiplexeur de terminal indispensable pour les admins sys"
description: tmux maintient vos sessions actives après déconnexion SSH et divise votre terminal en panneaux. Guide complet avec tous les raccourcis essentiels.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
  - ssh
  - scripting
language: fr
draft: false
comment: true
---

Vous avez déjà lancé une longue commande sur un serveur distant via SSH, puis perdu la connexion en plein milieu ? Ou jonglé entre six terminaux ouverts pour administrer un serveur ? **tmux** résout ces deux problèmes : il maintient vos sessions actives même après déconnexion, et permet de diviser un terminal en plusieurs panneaux.

## Qu'est-ce que tmux ?

tmux (terminal multiplexer) est un outil qui s'exécute en arrière-plan sur votre serveur. Il crée des **sessions persistantes** dans lesquelles vous pouvez ouvrir plusieurs fenêtres et panneaux. Vous vous déconnectez, vous vous reconnectez — votre session reprend exactement là où vous l'aviez laissée.

**Concepts clés :**
- **Session** : instance tmux (peut contenir plusieurs fenêtres)
- **Fenêtre** (window) : équivalent d'un onglet de navigateur
- **Panneau** (pane) : division d'une fenêtre (horizontal ou vertical)

```
Session "serveur-prod"
├── Fenêtre 0 : monitoring (htop)
├── Fenêtre 1 : logs (tail -f)
└── Fenêtre 2 : shell libre
    ├── Panneau gauche : /var/www
    └── Panneau droit : /var/log
```

## Installation

tmux est disponible dans tous les gestionnaires de paquets.

```bash
# Debian / Ubuntu
sudo apt install tmux -y

# RHEL / AlmaLinux
sudo dnf install tmux -y

# Vérifier la version
tmux -V
```

## Démarrage rapide

### Créer une session

```bash
# Nouvelle session sans nom
tmux

# Nouvelle session avec un nom (recommandé)
tmux new-session -s monserveur
# ou raccourci
tmux new -s monserveur
```

### Le préfixe : Ctrl+B

Toutes les commandes tmux commencent par le **préfixe** `Ctrl+B` (appuyer simultanément), suivi d'une touche.

```
Ctrl+B  puis  d   → se détacher de la session (la session continue en arrière-plan)
Ctrl+B  puis  ?   → aide (liste tous les raccourcis)
```

## Gestion des sessions

### Se détacher / réattacher

```bash
# Se détacher (la session continue de tourner)
Ctrl+B  puis  d

# Lister les sessions actives
tmux ls
# ou
tmux list-sessions

# Réattacher à une session
tmux attach -t monserveur
# ou raccourci
tmux a -t monserveur

# Réattacher à la dernière session
tmux a
```

### Nommer et gérer les sessions

```bash
# Renommer la session courante
Ctrl+B  puis  $

# Passer à la session suivante
Ctrl+B  puis  )

# Passer à la session précédente
Ctrl+B  puis  (

# Fermer la session courante
tmux kill-session -t monserveur
```

## Gestion des fenêtres

Les fenêtres sont comme des onglets à l'intérieur d'une session.

| Raccourci | Action |
|---|---|
| `Ctrl+B  c` | Créer une nouvelle fenêtre |
| `Ctrl+B  ,` | Renommer la fenêtre courante |
| `Ctrl+B  n` | Fenêtre suivante |
| `Ctrl+B  p` | Fenêtre précédente |
| `Ctrl+B  0-9` | Aller à la fenêtre n° |
| `Ctrl+B  w` | Liste des fenêtres (navigation interactive) |
| `Ctrl+B  &` | Fermer la fenêtre courante |

## Gestion des panneaux

Les panneaux permettent de diviser une fenêtre en plusieurs zones.

| Raccourci | Action |
|---|---|
| `Ctrl+B  %` | Diviser verticalement (côte à côte) |
| `Ctrl+B  "` | Diviser horizontalement (haut/bas) |
| `Ctrl+B  ←↑↓→` | Naviguer entre les panneaux |
| `Ctrl+B  z` | Zoom sur le panneau actif (toggle) |
| `Ctrl+B  x` | Fermer le panneau actif |
| `Ctrl+B  Espace` | Changer le layout des panneaux |
| `Ctrl+B  {` | Déplacer le panneau vers la gauche |
| `Ctrl+B  }` | Déplacer le panneau vers la droite |

### Redimensionner un panneau

```
Ctrl+B  puis  :  puis  resize-pane -D 5   (agrandir vers le bas de 5 lignes)
Ctrl+B  puis  :  puis  resize-pane -U 5   (agrandir vers le haut)
Ctrl+B  puis  :  puis  resize-pane -L 10  (agrandir vers la gauche)
Ctrl+B  puis  :  puis  resize-pane -R 10  (agrandir vers la droite)
```

## Mode copie (défilement)

Par défaut, vous ne pouvez pas faire défiler l'historique dans tmux. Le mode copie permet ça :

```
Ctrl+B  puis  [    → entrer en mode copie
↑/↓ ou PgUp/PgDn  → naviguer
q                  → quitter le mode copie
```

Pour copier du texte :
```
Ctrl+B  puis  [    → mode copie
Espace             → début de sélection
↑↓←→               → sélectionner
Entrée             → copier la sélection
Ctrl+B  puis  ]    → coller
```

## Personnalisation (`~/.tmux.conf`)

Le fichier de configuration permet de personnaliser tmux. Quelques réglages utiles :

```bash
nano ~/.tmux.conf
```

```bash
# Changer le préfixe de Ctrl+B à Ctrl+A (plus ergonomique)
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# Diviser les panneaux avec | et - (plus intuitif)
bind | split-window -h
bind - split-window -v

# Recharger la config sans redémarrer
bind r source-file ~/.tmux.conf \; display "Config rechargée !"

# Activer la souris (défilement, sélection de panneaux)
set -g mouse on

# Agrandir l'historique de défilement
set -g history-limit 10000

# Afficher les noms des fenêtres dans la barre
set -g status-interval 5
set -g status-left "[#S] "
set -g status-right "%H:%M %d/%m"

# Numérotation des fenêtres à partir de 1
set -g base-index 1
```

Recharger la config :

```bash
tmux source-file ~/.tmux.conf
```

## Cas d'usage pratiques

### Lancer une tâche longue sans risquer l'interruption

```bash
# Ouvrir une session nommée
tmux new -s backup

# Lancer la commande
rsync -avz /data/ user@serveur:/backup/

# Se détacher (Ctrl+B d) — la commande continue
# Se reconnecter plus tard
tmux a -t backup
```

### Surveiller plusieurs logs en simultané

```bash
tmux new -s monitoring
# Fenêtre 1 : logs nginx
tail -f /var/log/nginx/access.log

# Nouvelle fenêtre (Ctrl+B c)
# Fenêtre 2 : logs système
journalctl -f

# Nouvelle fenêtre (Ctrl+B c)
# Fenêtre 3 : ressources système
htop
```

### Layout de travail automatisé au démarrage

Créer un script qui ouvre tmux avec votre environnement habituel :

```bash
#!/bin/bash
# ~/bin/workspace.sh

tmux new-session -d -s work -n shell
tmux new-window -t work -n logs
tmux send-keys -t work:logs "sudo journalctl -f" Enter
tmux new-window -t work -n monitor
tmux send-keys -t work:monitor "htop" Enter
tmux select-window -t work:shell
tmux attach -t work
```

```bash
chmod +x ~/bin/workspace.sh
./bin/workspace.sh
```

## Récapitulatif des commandes essentielles

### En ligne de commande

| Commande | Description |
|---|---|
| `tmux new -s nom` | Créer une session nommée |
| `tmux ls` | Lister les sessions |
| `tmux a -t nom` | Se rattacher à une session |
| `tmux kill-session -t nom` | Supprimer une session |

### Raccourcis dans tmux (après Ctrl+B)

| Touche | Action |
|---|---|
| `d` | Se détacher |
| `c` | Nouvelle fenêtre |
| `n / p` | Fenêtre suivante / précédente |
| `%` | Diviser verticalement |
| `"` | Diviser horizontalement |
| `←↑↓→` | Naviguer entre panneaux |
| `z` | Zoom panneau actif |
| `[` | Mode copie / défilement |
| `?` | Aide complète |

tmux est un outil qui change profondément la façon de travailler sur des serveurs distants. Combiné à une [configuration SSH solide](/blog/configuration-ssh) et [rsync](/blog/rsync-sauvegarder-synchroniser-fichiers) pour les sauvegardes, il fait partie des indispensables de l'admin sys.
