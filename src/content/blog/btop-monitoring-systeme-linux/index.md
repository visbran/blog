---
title: "btop : le monitoring système moderne sous Linux"
description: btop remplace htop avec des graphiques clairs et une navigation à la souris. Surveillez CPU, mémoire, réseau, disques et processus en temps réel sous Linux.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
language: fr
draft: true
comment: true
---

`htop` est l'outil de monitoring incontournable sous Linux, mais `btop` pousse le concept beaucoup plus loin : interface graphique claire avec des graphiques en ASCII, surveillance complète (CPU, mémoire, réseau, disques, processus), thèmes personnalisables et navigation intuitive à la souris.

## Qu'est-ce que btop ?

btop++ (souvent simplement appelé `btop`) est un moniteur de ressources système en ligne de commande, successeur de `bpytop` (Python) réécrit en C++ pour de meilleures performances.

**Ce qu'il affiche :**
- **CPU** : utilisation par cœur avec graphique historique
- **Mémoire** : RAM, swap, cache avec graphique
- **Réseau** : débit montant/descendant par interface
- **Disques** : lecture/écriture, espace utilisé
- **Processus** : liste complète, filtrable, triable

## Installation

### Debian / Ubuntu

```bash
sudo apt install btop -y
```

### RHEL / AlmaLinux

```bash
sudo dnf install epel-release -y
sudo dnf install btop -y
```

### Depuis les binaires précompilés (dernière version)

```bash
# Télécharger depuis GitHub
wget https://github.com/aristocratos/btop/releases/latest/download/btop-x86_64-linux-musl.tbz

# Extraire et installer
tar xjf btop-x86_64-linux-musl.tbz
cd btop
sudo make install

# Vérifier
btop --version
```

### macOS

```bash
brew install btop
```

## Lancement

```bash
btop
```

L'interface s'ouvre directement dans le terminal avec toutes les informations.

## Navigation dans l'interface

### Sections de l'interface

Par défaut, btop affiche quatre zones :

```
┌─────────────────────┐ ┌──────────────┐
│    CPU (graphique)  │ │    MÉMOIRE   │
│    par cœur         │ │    graphique │
├─────────────────────┘ └──────────────┤
│    RÉSEAU + DISQUES                  │
├──────────────────────────────────────┤
│    PROCESSUS (liste filtrée)         │
└──────────────────────────────────────┘
```

### Raccourcis clavier essentiels

| Touche | Action |
|---|---|
| `q` | Quitter |
| `m` | Changer le menu |
| `h` | Aide |
| `f` | Filtrer les processus |
| `↑ ↓` | Naviguer dans les processus |
| `Entrée` | Détails d'un processus |
| `k` | Envoyer un signal à un processus |
| `t` | Arbre des processus (vue hiérarchique) |
| `p` | Trier par CPU |
| `M` | Trier par mémoire |
| `+` / `-` | Modifier la fréquence de mise à jour |
| `F2` | Ouvrir les options |
| `Esc` | Fermer un menu / retour |

### Navigation à la souris

btop supporte la souris dans la plupart des terminaux :
- **Clic** : sélectionner un processus ou une option
- **Défilement** : faire défiler la liste des processus
- **Clic droit** : menu contextuel sur un processus

## Gestion des processus

### Filtrer les processus

Appuyer sur `f` puis taper un terme de recherche. btop filtre en temps réel sur le nom du processus ou l'utilisateur.

```
Filtre : nginx
→ Affiche uniquement les processus liés à nginx
```

### Envoyer un signal à un processus

1. Sélectionner le processus avec `↑ ↓`
2. Appuyer sur `k`
3. Choisir le signal : `15` (SIGTERM, arrêt propre) ou `9` (SIGKILL, arrêt forcé)

### Vue arborescente

Appuyer sur `t` pour basculer en vue arbre et voir les processus parent/enfant :

```
├── systemd (1)
│   ├── nginx (1234)
│   │   ├── nginx worker (1235)
│   │   └── nginx worker (1236)
│   └── docker (1300)
│       └── containerd (1301)
```

## Personnalisation

### Ouvrir les options

Appuyer sur `F2` (ou `o`) pour accéder aux options :

- **Color theme** : choisir parmi une vingtaine de thèmes (Default, TTY, Dracula, Nord, Gruvbox...)
- **Update ms** : fréquence de rafraîchissement (1000ms par défaut)
- **CPU graph** : mode d'affichage du CPU
- **Shown boxes** : activer/désactiver chaque section (cpu, mem, net, proc, disk)

### Fichier de configuration

La configuration est stockée dans `~/.config/btop/btop.conf`. Elle est modifiable directement ou via l'interface.

Exemples d'options utiles :

```ini
# Thème
color_theme = "Default"

# Fréquence de mise à jour (ms)
update_ms = 2000

# Sections affichées
shown_boxes = "cpu mem net proc"

# Tri des processus par défaut
proc_sorting = "cpu lazy"

# Arbre de processus par défaut
proc_tree = False

# Afficher les températures CPU
show_cpu_freq = True
```

## Cas d'usage pratiques

### Surveiller un serveur sous charge

```bash
# Lancer btop sur un serveur distant via SSH
ssh user@serveur -t btop
```

L'option `-t` de SSH force l'allocation d'un pseudo-terminal, nécessaire pour les interfaces interactives.

### Identifier les processus gourmands

1. Lancer `btop`
2. Appuyer sur `p` pour trier par CPU ou `M` pour trier par mémoire
3. Les processus les plus gourmands remontent en tête de liste

### Surveiller le réseau en temps réel

La section réseau de btop affiche :
- Débit montant et descendant en temps réel
- Graphique historique des 5 dernières minutes
- Par interface réseau (eth0, wg0, docker0...)

## btop vs htop vs top

| Outil | Points forts | Limites |
|---|---|---|
| `top` | Universel, préinstallé | Interface datée, peu d'infos |
| `htop` | Simple, populaire, personnalisable | Pas de graphiques réseau/disque |
| `btop` | Graphiques, complet, moderne, souris | Pas toujours préinstallé |

Pour une utilisation quotidienne sur un serveur que vous administrez, btop est clairement supérieur. Pour un accès rapide sur n'importe quelle machine, `top` reste l'outil universel toujours disponible.

## Récapitulatif des raccourcis

| Touche | Action |
|---|---|
| `q` | Quitter |
| `f` | Filtrer les processus |
| `t` | Vue arborescente |
| `k` | Tuer / signal un processus |
| `p` / `M` | Trier par CPU / mémoire |
| `F2` | Options et thèmes |
| `h` | Aide complète |

btop est l'un des premiers outils à installer sur un nouveau serveur. Combiné à [tmux](/blog/tmux-multiplexeur-terminal) pour garder les sessions actives et à [systemd](/blog/systemd-creer-gerer-services) pour surveiller l'état des services, il constitue un tableau de bord complet pour l'administration système.
