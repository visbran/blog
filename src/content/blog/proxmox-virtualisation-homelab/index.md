---
title: "Proxmox VE : installer et configurer la virtualisation pour son homelab"
description: Proxmox VE est la plateforme de virtualisation open source pour homelab. Gérez VMs et conteneurs LXC depuis une interface web complète et gratuite.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
  - virtualisation
  - devops
language: fr
draft: false
comment: true
---

Un homelab sans virtualisation est un homelab limité. **Proxmox VE** (Virtual Environment) est la plateforme de virtualisation open source la plus populaire pour les homelabs et les petites infrastructures : elle permet de faire tourner plusieurs machines virtuelles (VM) et conteneurs LXC sur un seul serveur physique, le tout depuis une interface web complète.

## Pourquoi Proxmox ?

Proxmox se distingue des alternatives par plusieurs points :

| | Proxmox VE | VMware ESXi | VirtualBox |
|---|---|---|---|
| Prix | Gratuit (abonnement support optionnel) | Payant / limité | Gratuit (desktop) |
| Interface | Web complète | Web complète | GUI desktop |
| KVM (VMs) | ✓ | ✓ | ✓ |
| LXC (conteneurs) | ✓ | ✗ | ✗ |
| Clustering | ✓ | Payant | ✗ |
| Snapshots | ✓ | Payant | ✓ |
| API REST | ✓ | ✓ | ✗ |
| Usage homelab | Idéal | Possible | Non recommandé |

**LXC vs VM :** les conteneurs LXC partagent le noyau de l'hôte (plus légers, démarrage en secondes) ; les VMs ont leur propre noyau (isolation totale, compatibilité maximale).

## Prérequis matériels

- **CPU** : 64 bits avec support de la virtualisation Intel VT-x ou AMD-V
- **RAM** : minimum 8 Go (16 Go+ recommandés)
- **Stockage** : SSD recommandé pour les VMs (NVMe idéal)
- **Réseau** : une interface Ethernet filaire

Vérifier le support de virtualisation :
```bash
grep -E 'vmx|svm' /proc/cpuinfo | head -1
# vmx = Intel VT-x, svm = AMD-V
```

## Installation

### 1. Télécharger l'ISO

Télécharger l'ISO Proxmox VE depuis [proxmox.com/downloads](https://www.proxmox.com/downloads).

### 2. Créer une clé USB bootable

```bash
# Linux
sudo dd if=proxmox-ve_8.x.iso of=/dev/sdc bs=4M status=progress

# Ou avec Ventoy (recommandé — copier simplement l'ISO)
```

### 3. Installer Proxmox

Booter depuis la clé USB et suivre l'assistant :

1. **Target harddisk** : sélectionner le disque d'installation
2. **Country / Timezone** : France / Europe/Paris
3. **Root password** : choisir un mot de passe fort
4. **Management network** : configurer l'IP (adresse statique recommandée)
   - IP : `192.168.1.50/24`
   - Gateway : `192.168.1.1`
   - DNS : `1.1.1.1`

L'installation prend environ 5 minutes.

### 4. Accéder à l'interface web

Après redémarrage, accéder à :

```
https://192.168.1.50:8006
```

Le certificat SSL est auto-signé → cliquer sur "Avancé > Continuer quand même".

Connexion : `root` / le mot de passe choisi à l'installation.

## Premier démarrage : désactiver le message "No valid subscription"

Proxmox affiche un message de souscription au démarrage. Pour un usage homelab, ceci n'est pas bloquant, mais peut être supprimé :

```bash
# Se connecter en SSH sur le nœud Proxmox
sed -Ezi.bak "s/(Ext.Msg.show\(\{.*title: gettext\('No valid subscription'\),.*?\}\);)/void 0;/s" \
  /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js
systemctl restart pveproxy
```

### Configurer les dépôts sans abonnement

```bash
# Désactiver le dépôt entreprise
sed -i 's/^deb/#deb/' /etc/apt/sources.list.d/pve-enterprise.list

# Activer le dépôt no-subscription (communauté)
echo "deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription" \
  > /etc/apt/sources.list.d/pve-no-subscription.list

# Mettre à jour
apt update && apt dist-upgrade -y
```

## Créer une VM

### 1. Uploader une ISO

Dans l'interface web :
- **Datacenter > pve > local (pve) > ISO Images > Upload**
- Ou **Download from URL** pour télécharger directement depuis internet

### 2. Créer la VM

**Create VM** (bouton en haut à droite) :

| Onglet | Paramètre recommandé |
|---|---|
| **General** | Name : `ubuntu-2404`, VM ID : 100 |
| **OS** | ISO : sélectionner l'ISO uploadée, Type : Linux |
| **System** | BIOS : OVMF (UEFI) pour les OS modernes, Qemu Agent : cocher |
| **Disks** | Bus : VirtIO SCSI, Taille : 32 Go minimum, Format : raw |
| **CPU** | Cores : 2, Type : host (meilleures performances) |
| **Memory** | 2048 Mo minimum |
| **Network** | Bridge : vmbr0, Model : VirtIO |

### 3. Installer l'OS

- Démarrer la VM
- Ouvrir la **Console** dans l'interface web
- Suivre l'installation normalement

### 4. Installer l'agent QEMU

Après installation de l'OS, installer l'agent QEMU pour une meilleure intégration (IP visible dans l'interface, snapshots propres...) :

```bash
# Dans la VM
sudo apt install qemu-guest-agent -y
sudo systemctl enable --now qemu-guest-agent
```

## Créer un conteneur LXC

Les conteneurs LXC sont beaucoup plus légers que les VMs pour les services Linux.

### 1. Télécharger un template

**Datacenter > pve > local > CT Templates > Templates**

Choisir une image (Debian 12, Ubuntu 24.04, Alpine...) et cliquer **Download**.

### 2. Créer le conteneur

**Create CT** :

| Paramètre | Valeur |
|---|---|
| CT ID | 200 |
| Hostname | mon-conteneur |
| Password | mot de passe root |
| Template | debian-12-standard |
| Disk | 8 Go |
| CPU | 1 core |
| Memory | 512 Mo |
| Network | DHCP ou IP statique |

Les LXC démarrent en 2-3 secondes et consomment très peu de ressources.

## Snapshots et sauvegardes

### Snapshot (rapide, sur place)

Un snapshot capture l'état de la VM à un instant T. Utile avant une mise à jour risquée :

**VM > Snapshots > Take Snapshot**

Restauration instantanée en cas de problème : **Snapshots > Rollback**

> Les snapshots ne remplacent pas une vraie sauvegarde : ils sont stockés sur le même disque.

### Sauvegarde (Backup)

**Datacenter > Backup > Add** : planifier des sauvegardes automatiques vers un stockage local ou distant.

Format **zstd** recommandé : bon compromis vitesse / compression.

## Réseau Proxmox

Proxmox crée automatiquement un bridge `vmbr0` connecté à l'interface physique. Les VMs et LXC connectés à `vmbr0` obtiennent des adresses IP de votre réseau local.

### Configuration réseau dans `/etc/network/interfaces`

```bash
# Interface physique
auto enp3s0
iface enp3s0 inet manual

# Bridge principal
auto vmbr0
iface vmbr0 inet static
    address 192.168.1.50/24
    gateway 192.168.1.1
    dns-nameservers 1.1.1.1
    bridge-ports enp3s0
    bridge-stp off
    bridge-fd 0
```

### Réseau isolé pour les VMs (optionnel)

Créer un second bridge sans interface physique pour un réseau interne isolé :

**System > Network > Create > Linux Bridge**
- Name : `vmbr1`
- IPv4/CIDR : `10.10.0.1/24`
- Pas de bridge-ports

Les VMs sur `vmbr1` communiquent entre elles mais n'ont pas accès au réseau physique (sauf si NAT configuré).

## Commandes CLI utiles

```bash
# Lister les VMs
qm list

# Démarrer / Arrêter une VM
qm start 100
qm stop 100

# Lister les conteneurs LXC
pct list

# Démarrer / Arrêter un LXC
pct start 200
pct stop 200

# Entrer dans un LXC
pct enter 200

# Voir l'utilisation des ressources
pvesh get /nodes/pve/status
```

## Monitoring et alertes

Proxmox inclut des graphiques de performance pour chaque VM/LXC. Pour des alertes par email :

**Datacenter > Options > Email from address** — configurer l'adresse d'expédition.

**Datacenter > Users > root > Email** — ajouter une adresse de notification.

Les alertes sont envoyées en cas d'espace disque faible, d'erreur de sauvegarde, etc.

## Récapitulatif

| Action | Interface web | CLI |
|---|---|---|
| Créer une VM | Create VM | `qm create` |
| Démarrer/Arrêter | Boutons Start/Stop | `qm start 100` |
| Snapshot | VM > Snapshots | `qm snapshot 100 nom` |
| Sauvegarde | Datacenter > Backup | `vzdump 100` |
| Conteneur LXC | Create CT | `pct create` |
| Entrer dans un LXC | Console | `pct enter 200` |

Proxmox est la plateforme de choix pour un homelab évolutif. Avec un seul serveur physique, vous pouvez faire tourner des dizaines de VMs et LXC : un serveur [Docker](/blog/installer-docker-guide-complet-pour-debutants) dans une VM, un serveur DNS [Pi-hole](/blog/pi-hole-bloquer-publicites-reseau) dans un LXC, un VPN [WireGuard](/blog/wireguard-vpn-linux) dans un autre LXC...
