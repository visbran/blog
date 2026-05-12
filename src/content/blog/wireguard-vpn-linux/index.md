---
title: "WireGuard : monter un VPN moderne sous Linux en 10 minutes"
description: WireGuard est le VPN le plus rapide et le plus simple à configurer. Créez un tunnel sécurisé entre vos machines Linux en quelques commandes.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
  - réseau
  - sécurité
language: fr
draft: false
comment: true
---

Les VPN traditionnels comme OpenVPN sont puissants mais complexes à configurer et à maintenir. **WireGuard** change la donne : quelques lignes de configuration suffisent pour créer un tunnel VPN sécurisé, rapide et fiable. Il est intégré directement dans le noyau Linux depuis la version 5.6.

## Qu'est-ce que WireGuard ?

WireGuard est un protocole VPN moderne conçu pour être simple, rapide et sécurisé. Contrairement à OpenVPN ou IPsec, son code source tient en moins de 4 000 lignes — ce qui facilite les audits de sécurité et réduit la surface d'attaque.

**Ses avantages :**
- Intégré au noyau Linux (performances natives)
- Configuration minimaliste (quelques lignes vs des dizaines pour OpenVPN)
- Cryptographie moderne : Curve25519, ChaCha20, Poly1305, BLAKE2
- Roaming : les clients mobiles changent d'IP sans couper la connexion
- Ping très faible grâce à l'intégration kernel

**Cas d'usage typiques :**
- Accéder à son homelab depuis l'extérieur
- Interconnecter plusieurs serveurs (réseau privé)
- Sécuriser sa connexion sur les réseaux publics

## Architecture WireGuard

WireGuard fonctionne en mode **peer-to-peer** : chaque machine est un pair (*peer*). En pratique, on désigne un pair comme serveur (point central) et les autres comme clients.

```
[Client laptop]  ──── tunnel WireGuard ────  [Serveur VPN]
[Client mobile]  ──── tunnel WireGuard ────  [Serveur VPN]
                                                    │
                                              [Homelab / réseau privé]
```

## Prérequis

- Un serveur Linux avec une IP publique (VPS, serveur dédié...)
- Noyau Linux ≥ 5.6 (Ubuntu 20.04+, Debian 11+, AlmaLinux 8+)
- Un client (Linux, Windows, macOS, iOS, Android)
- Port UDP ouvert sur le serveur (51820 par défaut)

## Installation

### Debian / Ubuntu

```bash
sudo apt update && sudo apt install wireguard -y
```

### RHEL / AlmaLinux / Rocky Linux

```bash
sudo dnf install epel-release -y
sudo dnf install wireguard-tools -y
```

### Vérifier l'installation

```bash
wg --version
# wireguard-tools v1.0.20210914
```

## Configuration du serveur

### 1. Générer les clés

```bash
# Créer le dossier de configuration
sudo mkdir -p /etc/wireguard
sudo chmod 700 /etc/wireguard

# Générer la paire de clés du serveur
wg genkey | sudo tee /etc/wireguard/server_private.key | wg pubkey | sudo tee /etc/wireguard/server_public.key

# Afficher les clés (noter la clé publique)
sudo cat /etc/wireguard/server_public.key
```

### 2. Créer le fichier de configuration

```bash
sudo nano /etc/wireguard/wg0.conf
```

```ini
[Interface]
# Adresse IP du serveur dans le tunnel VPN
Address = 10.0.0.1/24

# Port d'écoute UDP
ListenPort = 51820

# Clé privée du serveur
PrivateKey = <CONTENU_DE_server_private.key>

# Commandes pour activer le NAT (permet aux clients d'accéder à internet via le VPN)
# Remplacer eth0 par votre interface réseau principale (ip a pour vérifier)
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
```

### 3. Activer le routage IP

```bash
# Activer temporairement
sudo sysctl -w net.ipv4.ip_forward=1

# Rendre permanent
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 4. Ouvrir le port dans UFW

```bash
sudo ufw allow 51820/udp
sudo ufw reload
```

## Configuration d'un client Linux

### 1. Générer les clés du client

Sur la machine cliente :

```bash
wg genkey | tee client_private.key | wg pubkey > client_public.key
cat client_private.key
cat client_public.key
```

### 2. Créer la configuration client

```bash
sudo nano /etc/wireguard/wg0.conf
```

```ini
[Interface]
# Adresse IP du client dans le tunnel VPN
Address = 10.0.0.2/24

# Clé privée du client
PrivateKey = <CONTENU_DE_client_private.key>

# DNS via le tunnel (optionnel — utilise le DNS public de Cloudflare)
DNS = 1.1.1.1

[Peer]
# Clé publique du SERVEUR
PublicKey = <CONTENU_DE_server_public.key>

# IP publique du serveur et port
Endpoint = <IP_PUBLIQUE_SERVEUR>:51820

# Tout le trafic passe par le VPN
AllowedIPs = 0.0.0.0/0

# Maintenir la connexion active (utile derrière un NAT)
PersistentKeepalive = 25
```

> **AllowedIPs = 0.0.0.0/0** → tout le trafic passe par le VPN (full tunnel)
> **AllowedIPs = 10.0.0.0/24** → seul le trafic vers le réseau VPN passe par le tunnel (split tunnel)

### 3. Ajouter le client au serveur

De retour sur le **serveur**, ajouter le pair client :

```bash
sudo wg set wg0 peer <CLIENT_PUBLIC_KEY> allowed-ips 10.0.0.2/32
```

Ou l'ajouter directement dans `/etc/wireguard/wg0.conf` :

```ini
[Peer]
# Client laptop
PublicKey = <CLIENT_PUBLIC_KEY>
AllowedIPs = 10.0.0.2/32
```

## Démarrer WireGuard

### Sur le serveur

```bash
# Démarrer l'interface
sudo wg-quick up wg0

# Activer au démarrage
sudo systemctl enable --now wg-quick@wg0
```

### Sur le client

```bash
sudo wg-quick up wg0
```

## Vérifier la connexion

### Voir l'état du tunnel

```bash
sudo wg show
```

Exemple de sortie :

```
interface: wg0
  public key: <SERVER_PUBLIC_KEY>
  private key: (hidden)
  listening port: 51820

peer: <CLIENT_PUBLIC_KEY>
  endpoint: 203.0.113.10:54321
  allowed ips: 10.0.0.2/32
  latest handshake: 23 seconds ago
  transfer: 1.23 MiB received, 456 KiB sent
```

`latest handshake` confirme que le client est bien connecté.

### Tester la connectivité

```bash
# Depuis le client, pinger le serveur via le tunnel
ping 10.0.0.1

# Depuis le serveur, pinger le client
ping 10.0.0.2
```

## Ajouter plusieurs clients

Pour chaque nouveau client, répéter :
1. Générer une paire de clés sur le client
2. Ajouter un bloc `[Peer]` dans `/etc/wireguard/wg0.conf` sur le serveur avec une IP unique (`10.0.0.3/32`, `10.0.0.4/32`...)
3. Créer la config `/etc/wireguard/wg0.conf` sur le client avec son IP unique
4. `sudo wg reload wg0` sur le serveur (pas besoin de redémarrer)

## Client mobile (iOS / Android)

L'application officielle WireGuard est disponible sur l'App Store et le Play Store. Elle supporte l'import de configuration via **QR code** :

```bash
# Sur le serveur, générer un QR code pour la config d'un client mobile
sudo apt install qrencode -y
qrencode -t ansiutf8 < /chemin/vers/client_mobile.conf
```

Scanner le QR code depuis l'application — la configuration est importée automatiquement.

## Commandes de gestion

| Commande | Description |
|---|---|
| `wg show` | État du tunnel et des pairs connectés |
| `wg-quick up wg0` | Démarrer le tunnel |
| `wg-quick down wg0` | Arrêter le tunnel |
| `sudo wg reload wg0` | Recharger la config sans couper les connexions |
| `systemctl enable wg-quick@wg0` | Démarrer au boot |

## Dépannage

### Pas de connexion entre pairs
- Vérifier que le port UDP 51820 est ouvert : `sudo ufw status` et règles iptables
- Vérifier que `ip_forward` est activé : `sysctl net.ipv4.ip_forward`
- Vérifier les clés : la clé publique dans `[Peer]` doit correspondre à la clé privée du pair

### `latest handshake` absent
Le handshake n'a jamais eu lieu. Causes possibles :
- Mauvaise `Endpoint` (IP ou port)
- Pare-feu bloque UDP 51820
- Mauvaises clés

### Pas d'accès internet via le VPN
- Vérifier les règles PostUp/PostDown dans la config serveur
- Vérifier le nom de l'interface réseau (`eth0`, `ens3`, `enp0s3`...) : `ip route | grep default`

WireGuard est aujourd'hui la référence pour les VPN simples et performants. Associé à [UFW](/blog/ufw-configurer-pare-feu-linux) pour le pare-feu et [Fail2ban](/blog/fail2ban-proteger-services-brute-force) pour la protection, il constitue une infrastructure réseau solide pour tout homelab.
