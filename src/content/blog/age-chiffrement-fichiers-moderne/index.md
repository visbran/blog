---
title: "age : le chiffrement de fichiers moderne et simple sous Linux"
description: age chiffre vos fichiers sans configuration. Alternative moderne à GPG, compatible clés SSH et idéal pour automatiser vos sauvegardes chiffrées.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - linux
  - sécurité
  - scripting
language: fr
draft: false
comment: true
---

[GPG](/blog/chiffrer-ses-donnees-gpg) est le standard historique pour le chiffrement de fichiers sous Linux, mais sa complexité (trousseau de clés, réseau de confiance, formats multiples, interface déroutante) rebute beaucoup d'utilisateurs. **age** (prononcé "ah-geh") a été conçu comme une alternative radicalement plus simple : pas de configuration, une seule façon de faire les choses, une cryptographie moderne.

## Pourquoi age plutôt que GPG ?

| | GPG | age |
|---|---|---|
| Configuration initiale | Complexe (trousseau, serveurs de clés) | Aucune |
| Format de clé | Complexe (fingerprint, subkeys...) | Fichier texte simple |
| Algorithmes | Choix multiples, certains anciens | Moderne uniquement (X25519, ChaCha20) |
| Interface | Nombreuses options et flags | 3 commandes |
| Automatisation | Difficile (passphrase, agent...) | Simple |
| Cas d'usage | Emails signés, PKI, ecosystème PGP | Fichiers, sauvegardes, scripts |

**age est fait pour :** chiffrer des fichiers, des sauvegardes, des secrets dans des scripts.
**GPG reste pertinent pour :** signer des commits Git, chiffrer des emails, interagir avec l'écosystème PGP.

## Installation

### Debian / Ubuntu

```bash
sudo apt install age -y
```

### RHEL / AlmaLinux

```bash
sudo dnf install age -y
# ou via EPEL si absent
sudo dnf install epel-release -y && sudo dnf install age -y
```

### Depuis les binaires GitHub (dernière version)

```bash
# Télécharger la dernière version (adapter l'URL selon la version)
curl -Lo age.tar.gz https://github.com/FiloSottile/age/releases/latest/download/age-v1.2.0-linux-amd64.tar.gz
tar xzf age.tar.gz
sudo mv age/age age/age-keygen /usr/local/bin/
```

### macOS

```bash
brew install age
```

### Vérifier l'installation

```bash
age --version
# age v1.2.0
```

## Deux modes de chiffrement

age supporte deux approches :

1. **Clés asymétriques** : paire clé publique / clé privée (idéal pour partager des fichiers chiffrés)
2. **Phrase de passe** : chiffrement symétrique protégé par un mot de passe (idéal pour les sauvegardes personnelles)

## Chiffrement par clé asymétrique

### Générer une paire de clés

```bash
age-keygen -o ma-cle.txt
```

```
Public key: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
```

Le fichier `ma-cle.txt` contient :
```
# created: 2026-03-10T10:00:00+01:00
# public key: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
AGE-SECRET-KEY-1QJEPF...
```

- **Clé publique** : peut être partagée librement (commence par `age1`)
- **Clé privée** : à conserver secrète (le fichier complet)

### Chiffrer un fichier

```bash
# Chiffrer avec la clé publique du destinataire
age -r age1ql3z7hjy54pw3hyww5... fichier.txt > fichier.txt.age

# Chiffrer pour soi-même (avec son propre fichier de clé)
age -r $(age-keygen -y ma-cle.txt) fichier.txt > fichier.txt.age
```

L'option `-r` accepte :
- Une clé publique age (`age1...`)
- Une URL GitHub (`github.com/username`) — age télécharge les clés SSH publiques du compte
- Un fichier contenant des clés publiques

### Chiffrer pour une clé SSH existante

age est compatible avec les clés SSH ! Vous pouvez chiffrer pour la clé SSH d'un serveur ou d'un utilisateur :

```bash
# Chiffrer avec une clé SSH Ed25519 existante
age -R ~/.ssh/id_ed25519.pub secret.txt > secret.txt.age

# Chiffrer pour les clés SSH d'un utilisateur GitHub
age -r github.com/visbran fichier.txt > fichier.txt.age
```

### Déchiffrer

```bash
# Déchiffrer avec la clé privée
age -d -i ma-cle.txt fichier.txt.age > fichier.txt

# Déchiffrer avec une clé SSH
age -d -i ~/.ssh/id_ed25519 secret.txt.age > secret.txt
```

## Chiffrement par phrase de passe

Plus simple, idéal pour les sauvegardes personnelles :

```bash
# Chiffrer avec une phrase de passe
age -p fichier.txt > fichier.txt.age
# Enter passphrase: ****
# Confirm passphrase: ****

# Déchiffrer
age -d fichier.txt.age > fichier.txt
# Enter passphrase: ****
```

## Chiffrer / déchiffrer depuis stdin

age s'intègre parfaitement dans les pipelines shell :

```bash
# Chiffrer la sortie d'une commande
tar czf - /home/user/documents | age -r age1... > backup.tar.gz.age

# Déchiffrer vers stdout et extraire directement
age -d -i ma-cle.txt backup.tar.gz.age | tar xzf -

# Chiffrer une variable d'environnement
echo "mon-secret" | age -r age1... > secret.age
```

## Cas d'usage : sauvegardes chiffrées automatisées

Exemple de script de sauvegarde avec chiffrement age :

```bash
#!/bin/bash
# /usr/local/bin/backup-chiffre.sh

SOURCE="/home/user/documents"
DEST="/backup/archive"
DATE=$(date +%Y-%m-%d)
CLE_PUBLIQUE="age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p"

tar czf - "$SOURCE" | age -r "$CLE_PUBLIQUE" > "$DEST/backup-$DATE.tar.gz.age"

echo "Sauvegarde chiffrée : $DEST/backup-$DATE.tar.gz.age"
```

Combiné avec [crontab](/blog/planification-de-taches-avec-crontab) ou un [timer systemd](/blog/systemd-creer-gerer-services) pour l'automatisation.

## Chiffrer plusieurs destinataires

age supporte le chiffrement pour plusieurs destinataires simultanément :

```bash
# Chiffrer pour Alice ET Bob
age -r age1alice... -r age1bob... document.pdf > document.pdf.age

# Les deux peuvent déchiffrer avec leur propre clé privée
```

## Protéger la clé privée par phrase de passe

La clé privée générée par `age-keygen` est en clair par défaut. Pour la protéger :

```bash
# Générer et chiffrer la clé privée avec une phrase de passe
age-keygen | age -p > ma-cle-protegee.age

# Déchiffrer la clé pour l'utiliser
age -d ma-cle-protegee.age | age -d -i /dev/stdin fichier.age > fichier
```

## Gestion des clés : où les stocker ?

```
~/.config/age/
├── identity.txt          Clé privée principale (chmod 600)
└── identity.txt.age      Clé privée chiffrée par phrase de passe (backup)

~/.ssh/authorized_keys    Compatible si on utilise des clés SSH
```

```bash
# Sécuriser la clé privée
chmod 600 ~/.config/age/identity.txt
```

## Comparaison des commandes GPG vs age

| Action | GPG | age |
|---|---|---|
| Générer des clés | `gpg --gen-key` | `age-keygen -o cle.txt` |
| Chiffrer | `gpg -e -r destinataire fichier` | `age -r age1... fichier > fichier.age` |
| Déchiffrer | `gpg -d fichier.gpg` | `age -d -i cle.txt fichier.age` |
| Chiffrer par mot de passe | `gpg -c fichier` | `age -p fichier > fichier.age` |
| Chiffrer un stream | Complexe | `commande \| age -r age1... > sortie.age` |

## Récapitulatif

| Commande | Description |
|---|---|
| `age-keygen -o cle.txt` | Générer une paire de clés |
| `age -r age1... fichier > fichier.age` | Chiffrer pour un destinataire |
| `age -R pubkey.txt fichier > fichier.age` | Chiffrer avec un fichier de clés publiques |
| `age -p fichier > fichier.age` | Chiffrer par phrase de passe |
| `age -d -i cle.txt fichier.age` | Déchiffrer avec une clé privée |
| `age -d fichier.age` | Déchiffrer par phrase de passe |
| `tar czf - dossier \| age -r age1... > backup.age` | Chiffrer une archive en une commande |

age est l'outil idéal pour tout ce qui nécessite du chiffrement de fichiers simple et scriptable. Pour aller plus loin sur la protection des données au repos, consultez l'article sur [LUKS](/blog/luks-chiffrement-disque-linux) pour le chiffrement complet d'un disque.
