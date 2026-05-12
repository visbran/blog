---
title: "LUKS : chiffrer un disque ou une partition sous Linux"
description: LUKS est le standard de chiffrement de disque sous Linux. Protégez vos données sensibles sur un serveur, un disque externe ou une partition dédiée.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - linux
  - sécurité
  - administration système
language: fr
draft: false
comment: true
---

Le chiffrement de disque protège vos données contre l'accès physique non autorisé : vol de serveur, disque récupéré après mise au rebut, saisie d'équipement. **LUKS** (Linux Unified Key Setup) est le standard de chiffrement de disque sous Linux, intégré dans le noyau via `dm-crypt`.

## Cas d'usage

- **Disque externe** : chiffrer un disque USB ou portable contenant des données sensibles
- **Partition dédiée** : chiffrer uniquement `/home` ou une partition de données
- **Serveur** : protéger les données au repos en cas de compromission physique
- **LXC / VM** : chiffrer les volumes de données des conteneurs

> Pour le chiffrement de la partition système complète au moment de l'installation, voir l'article [Installation ArchLinux avec chiffrement LUKS](/blog/installation-archlinux).

## Outils nécessaires

```bash
# Installer cryptsetup (outil de gestion LUKS)
sudo apt install cryptsetup -y    # Debian/Ubuntu
sudo dnf install cryptsetup -y    # RHEL/AlmaLinux
```

## Chiffrer un disque ou une partition

> **⚠ Attention** : le chiffrement LUKS efface toutes les données existantes. Sauvegarder avant de continuer.

### 1. Identifier le disque cible

```bash
lsblk
```

```
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda      8:0    0   500G  0 disk
├─sda1   8:1    0   499G  0 part /
└─sda2   8:2    0     1G  0 part [SWAP]
sdb      8:16   0   2T    0 disk          ← disque cible
```

Dans cet exemple, `/dev/sdb` est le disque à chiffrer.

### 2. Créer le conteneur LUKS

```bash
sudo cryptsetup luksFormat /dev/sdb
```

```
WARNING!
========
This will overwrite data on /dev/sdb irrevocably.

Are you sure? (Type 'yes' in capital letters): YES
Enter passphrase for /dev/sdb:
Verify passphrase:
```

> Choisissez une phrase de passe longue et mémorable. Sans elle, les données sont **irrécupérables**.

### 3. Ouvrir le conteneur chiffré

```bash
# Ouvrir et mapper vers /dev/mapper/data
sudo cryptsetup open /dev/sdb data
```

Un périphérique virtuel `/dev/mapper/data` est créé — c'est via lui qu'on accède au disque déchiffré.

### 4. Créer un système de fichiers

```bash
sudo mkfs.ext4 /dev/mapper/data
# ou pour un usage moderne :
sudo mkfs.xfs /dev/mapper/data
```

### 5. Monter et utiliser

```bash
sudo mkdir -p /mnt/data
sudo mount /dev/mapper/data /mnt/data
```

Le disque est maintenant utilisable normalement.

### 6. Démonter et fermer

```bash
sudo umount /mnt/data
sudo cryptsetup close data
```

Une fois fermé, `/dev/mapper/data` disparaît et les données sont chiffrées.

## Montage automatique au démarrage

Pour monter un volume LUKS automatiquement au démarrage (serveur), il faut :
1. Stocker la phrase de passe dans un fichier clé sécurisé
2. Déclarer le volume dans `/etc/crypttab`
3. Déclarer le point de montage dans `/etc/fstab`

### Créer un fichier clé

```bash
# Générer une clé aléatoire de 4096 octets
sudo dd if=/dev/urandom of=/etc/keys/data.key bs=512 count=8
sudo chmod 400 /etc/keys/data.key
sudo mkdir -p /etc/keys
```

### Ajouter la clé au conteneur LUKS

```bash
sudo cryptsetup luksAddKey /dev/sdb /etc/keys/data.key
```

Le conteneur accepte maintenant deux méthodes d'ouverture : la phrase de passe et le fichier clé.

### Configurer `/etc/crypttab`

```bash
# Récupérer l'UUID du disque chiffré
sudo blkid /dev/sdb
# /dev/sdb: UUID="a1b2c3d4-..." TYPE="crypto_LUKS"
```

```bash
sudo nano /etc/crypttab
```

```
# <nom>  <device>                          <keyfile>         <options>
data     UUID=a1b2c3d4-e5f6-...            /etc/keys/data.key  luks
```

### Configurer `/etc/fstab`

```bash
sudo nano /etc/fstab
```

```
# Récupérer l'UUID du filesystem (après ouverture LUKS)
/dev/mapper/data  /mnt/data  ext4  defaults  0  2
```

Au prochain redémarrage, le disque sera déchiffré et monté automatiquement.

## Gestion des clés LUKS

LUKS supporte jusqu'à **8 slots** de clés (phrases de passe ou fichiers). Utile pour avoir une clé de secours.

### Voir les slots actifs

```bash
sudo cryptsetup luksDump /dev/sdb | grep "Key Slot"
```

```
Key Slot 0: ENABLED   ← phrase de passe
Key Slot 1: ENABLED   ← fichier clé
Key Slot 2: DISABLED
...
```

### Ajouter une phrase de passe de secours

```bash
sudo cryptsetup luksAddKey /dev/sdb
# Saisir une phrase de passe existante pour s'authentifier
# Puis saisir la nouvelle phrase de passe
```

### Changer la phrase de passe

```bash
sudo cryptsetup luksChangeKey /dev/sdb
```

### Supprimer une clé

```bash
# Supprimer le slot 1 (fichier clé)
sudo cryptsetup luksKillSlot /dev/sdb 1
```

> **Attention** : ne supprimez pas toutes les clés, le disque serait inaccessible.

## Vérifier l'état d'un volume LUKS

```bash
# Informations détaillées
sudo cryptsetup luksDump /dev/sdb

# État du mapping actif
sudo cryptsetup status data
```

```
/dev/mapper/data is active and is in use.
  type:    LUKS2
  cipher:  aes-xts-plain64
  keysize: 512 bits
  key location: keyring
  device:  /dev/sdb
  offset:  32768 sectors
  size:    3906xxxxxx sectors
  mode:    read/write
```

## Chiffrer un disque externe (usage nomade)

Pour un disque USB transportable, pas besoin de montage automatique :

```bash
# 1. Chiffrer
sudo cryptsetup luksFormat /dev/sdc

# 2. Ouvrir
sudo cryptsetup open /dev/sdc backup

# 3. Si nouveau : créer le filesystem
sudo mkfs.ext4 /dev/mapper/backup

# 4. Monter
sudo mount /dev/mapper/backup /mnt/backup

# --- utiliser le disque ---

# 5. Fermer proprement
sudo umount /mnt/backup
sudo cryptsetup close backup
```

## Sauvegarder l'en-tête LUKS

L'en-tête LUKS (premiers mégaoctets du disque) contient les métadonnées de chiffrement et les clés chiffrées. Sa corruption rend le disque inaccessible. **Sauvegarder l'en-tête est impératif.**

```bash
# Sauvegarder
sudo cryptsetup luksHeaderBackup /dev/sdb --header-backup-file /backup/sdb-luks-header.img

# Restaurer en cas de corruption
sudo cryptsetup luksHeaderRestore /dev/sdb --header-backup-file /backup/sdb-luks-header.img
```

Stocker cette sauvegarde sur un support différent du disque chiffré.

## Récapitulatif des commandes

| Commande | Description |
|---|---|
| `cryptsetup luksFormat /dev/sdX` | Chiffrer un disque/partition |
| `cryptsetup open /dev/sdX nom` | Ouvrir (déchiffrer) |
| `cryptsetup close nom` | Fermer (rechiffrer) |
| `cryptsetup luksDump /dev/sdX` | Infos sur le volume LUKS |
| `cryptsetup luksAddKey /dev/sdX` | Ajouter une clé |
| `cryptsetup luksKillSlot /dev/sdX N` | Supprimer un slot de clé |
| `cryptsetup luksHeaderBackup ...` | Sauvegarder l'en-tête |
| `cryptsetup status nom` | État du mapping actif |

LUKS offre un chiffrement robuste et transparent. Associé à [GPG](/blog/chiffrer-ses-donnees-gpg) pour le chiffrement de fichiers individuels et à une [configuration SSH sécurisée](/blog/ssh-hardening-securiser-serveur), il constitue une stratégie de protection des données complète.
