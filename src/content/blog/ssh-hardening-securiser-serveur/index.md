---
title: "SSH hardening : sécuriser son serveur Linux contre les intrusions"
description: Renforcez la sécurité de SSH avec les clés Ed25519, la désactivation du mot de passe, le changement de port et les restrictions d'accès. Guide 2025.
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

Un serveur exposé sur internet reçoit des centaines de tentatives de connexion SSH par jour. La configuration par défaut de SSH est fonctionnelle, mais loin d'être optimale en termes de sécurité. Ce guide présente les mesures concrètes pour durcir SSH et réduire drastiquement la surface d'attaque.

Pour la protection contre le brute-force en temps réel, [Fail2ban](/blog/fail2ban-proteger-services-brute-force) est un complément indispensable à ce guide.

## État des lieux : la configuration par défaut

Sur une installation fraîche, SSH autorise généralement :
- L'authentification par mot de passe (vulnérable au brute-force)
- La connexion en tant que `root`
- Les clés RSA 2048 bits (moins robustes que Ed25519)
- Le port 22 (scanné en continu par les bots)

Chaque point peut être amélioré.

## 1. Utiliser des clés Ed25519 à la place des mots de passe

### Pourquoi Ed25519 ?

Ed25519 est un algorithme de signature basé sur les courbes elliptiques. Par rapport à RSA :
- Clés beaucoup plus courtes (256 bits vs 2048-4096 bits)
- Plus rapide à générer et à vérifier
- Résistant aux attaques par canal auxiliaire
- Recommandé par les standards modernes (NIST, ANSSI)

### Générer une paire de clés Ed25519

Sur votre **machine locale** (pas sur le serveur) :

```bash
ssh-keygen -t ed25519 -C "commentaire@machine"
```

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/user/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase): [phrase de passe recommandée]
```

> Utilisez toujours une **phrase de passe** pour protéger votre clé privée.

Deux fichiers sont créés :
- `~/.ssh/id_ed25519` — clé privée (**ne jamais partager**)
- `~/.ssh/id_ed25519.pub` — clé publique (à copier sur le serveur)

### Déployer la clé publique sur le serveur

```bash
# Méthode recommandée
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@serveur

# Méthode manuelle
cat ~/.ssh/id_ed25519.pub | ssh user@serveur "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

Tester la connexion par clé :

```bash
ssh -i ~/.ssh/id_ed25519 user@serveur
```

> **Avant de continuer** : vérifiez que vous pouvez vous connecter avec la clé. Ne désactivez pas les mots de passe tant que ce n'est pas confirmé.

## 2. Modifier la configuration SSH (`/etc/ssh/sshd_config`)

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
sudo nano /etc/ssh/sshd_config
```

### Désactiver l'authentification par mot de passe

```ini
# Désactiver les mots de passe — clés uniquement
PasswordAuthentication no
ChallengeResponseAuthentication no
KbdInteractiveAuthentication no
```

### Désactiver la connexion root

```ini
# Interdire root en SSH
PermitRootLogin no
```

Si vous avez besoin d'accès root, connectez-vous avec un utilisateur normal puis `sudo su`.

### Limiter les utilisateurs autorisés

```ini
# Seuls ces utilisateurs peuvent se connecter
AllowUsers deployer brandon

# Ou autoriser un groupe entier
AllowGroups sshusers
```

### Désactiver les fonctionnalités inutiles

```ini
# Désactiver X11 forwarding si non utilisé
X11Forwarding no

# Désactiver le forwarding TCP si non utilisé
AllowTcpForwarding no

# Désactiver les tunnels
PermitTunnel no

# Réduire le timeout de connexion
LoginGraceTime 30

# Réduire le nombre de tentatives d'authentification par connexion
MaxAuthTries 3

# Limiter les sessions simultanées par connexion
MaxSessions 3
```

### Changer le port (sécurité par l'obscurité)

```ini
# Changer le port par défaut
Port 2222
```

> Changer le port ne remplace pas une vraie sécurité, mais élimine 99% des scans automatiques de bots. Choisissez un port entre 1024 et 65535.

**Important** : ouvrez le nouveau port dans UFW **avant** de recharger SSH :

```bash
sudo ufw allow 2222/tcp
sudo ufw delete allow ssh  # supprimer l'ancienne règle
```

### Utiliser uniquement les algorithmes modernes

```ini
# Restreindre aux algorithmes forts
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com
MACs hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com
HostKeyAlgorithms ssh-ed25519,rsa-sha2-512,rsa-sha2-256
```

## 3. Appliquer et vérifier la configuration

### Vérifier la syntaxe avant de recharger

```bash
sudo sshd -t
# Aucune sortie = configuration valide
```

### Recharger SSH

```bash
sudo systemctl reload sshd
```

> Ne pas `restart` mais `reload` — les connexions actives sont maintenues.

### Tester dans un nouveau terminal

**Ouvrez un nouveau terminal** sans fermer le précédent et testez la connexion :

```bash
ssh -p 2222 -i ~/.ssh/id_ed25519 user@serveur
```

Si ça fonctionne, votre ancienne session peut être fermée. Si ça ne fonctionne pas, la session ouverte vous permet de corriger.

## 4. Authentification à deux facteurs (2FA)

Pour un niveau de sécurité supplémentaire, ajouter TOTP (Google Authenticator, Aegis...) :

```bash
sudo apt install libpam-google-authenticator -y

# Configurer pour l'utilisateur courant
google-authenticator
```

Répondre `y` à toutes les questions. Noter le QR code et les codes de secours.

Dans `/etc/ssh/sshd_config` :

```ini
AuthenticationMethods publickey,keyboard-interactive
KbdInteractiveAuthentication yes
```

Dans `/etc/pam.d/sshd`, ajouter en première ligne :

```
auth required pam_google_authenticator.so
```

Recharger SSH :

```bash
sudo systemctl reload sshd
```

La connexion demande alors la clé SSH **et** le code TOTP.

## 5. Bannière de connexion

Afficher un message d'avertissement légal avant la connexion dissuade les attaquants et peut avoir une valeur juridique :

```bash
sudo nano /etc/ssh/sshd_banner
```

```
╔════════════════════════════════════════╗
║  Accès réservé aux utilisateurs        ║
║  autorisés. Toute connexion non        ║
║  autorisée sera tracée et signalée.    ║
╚════════════════════════════════════════╝
```

Dans `/etc/ssh/sshd_config` :

```ini
Banner /etc/ssh/sshd_banner
```

## 6. Configuration cliente (`~/.ssh/config`)

Simplifiez vos connexions et appliquez des options par hôte sur votre machine locale :

```ini
# ~/.ssh/config

Host monserveur
    HostName 203.0.113.10
    User brandon
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
    ServerAliveCountMax 3

Host homelab
    HostName 192.168.1.10
    User admin
    IdentityFile ~/.ssh/id_homelab
```

Connexion simplifiée :

```bash
ssh monserveur  # au lieu de : ssh -p 2222 -i ~/.ssh/id_ed25519 brandon@203.0.113.10
```

## Configuration finale récapitulative

```ini
# /etc/ssh/sshd_config — configuration durcie

Port 2222
AddressFamily inet

# Authentification
PermitRootLogin no
PasswordAuthentication no
ChallengeResponseAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

# Restrictions
AllowUsers brandon deployer
LoginGraceTime 30
MaxAuthTries 3
MaxSessions 3

# Désactiver les fonctionnalités non utilisées
X11Forwarding no
AllowTcpForwarding no
PermitTunnel no
PrintMotd no

# Bannière
Banner /etc/ssh/sshd_banner

# Algorithmes modernes uniquement
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com
```

## Checklist de sécurité SSH

```
[ ] Clés Ed25519 générées et déployées
[ ] Connexion par clé testée et fonctionnelle
[ ] PasswordAuthentication no
[ ] PermitRootLogin no
[ ] Port changé (≠ 22) et ouvert dans UFW
[ ] AllowUsers configuré
[ ] sshd -t valide la configuration
[ ] Fail2ban configuré sur le nouveau port
[ ] Connexion testée dans un nouveau terminal avant de fermer l'actuel
```

SSH bien configuré est la base de la sécurité d'un serveur Linux. Complétez avec [UFW](/blog/ufw-configurer-pare-feu-linux) pour le pare-feu et [Fail2ban](/blog/fail2ban-proteger-services-brute-force) pour le bannissement dynamique des IP malveillantes.
