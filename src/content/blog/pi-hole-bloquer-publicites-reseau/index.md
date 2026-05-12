---
title: "Pi-hole : bloquer les publicités sur tout votre réseau"
description: Pi-hole est un serveur DNS qui bloque publicités et trackers pour tous les appareils de votre réseau. Installation sur Linux et configuration du routeur.
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

Les bloqueurs de publicités dans le navigateur ne protègent qu'un seul appareil et ne bloquent pas les publicités dans les applications mobiles, les smart TVs ou les objets connectés. **Pi-hole** est un serveur DNS qui filtre les domaines publicitaires pour **tous les appareils** de votre réseau en même temps.

## Comment fonctionne Pi-hole ?

Pi-hole agit comme un **serveur DNS local**. Au lieu d'utiliser le DNS de votre FAI ou de Google (8.8.8.8), vos appareils interrogent Pi-hole :

1. L'appareil demande : "Quelle est l'IP de `ads.doubleclick.net` ?"
2. Pi-hole vérifie sa liste de blocage
3. Si le domaine est bloqué → Pi-hole répond `0.0.0.0` (domaine inexistant)
4. Si le domaine est autorisé → Pi-hole transmet la requête au DNS upstream (Cloudflare, Google, etc.)

Le blocage est transparent et s'applique à tous les appareils sans configuration individuelle.

**Ce que Pi-hole bloque :**
- Publicités (Google Ads, DoubleClick, Taboola...)
- Trackers (Facebook Pixel, Google Analytics...)
- Malwares et domaines malveillants connus
- Télémétrie Windows et autres OS

## Prérequis

- Un serveur Linux avec une IP locale fixe (idéalement `192.168.1.x`)
- Le serveur doit être accessible en permanence (Raspberry Pi, VPS local, VM, LXC...)
- Accès à l'interface d'administration de votre routeur

## Installation

Pi-hole propose un script d'installation universel :

```bash
curl -sSL https://install.pi-hole.net | bash
```

> Si vous préférez inspecter le script avant de l'exécuter (recommandé) :
> ```bash
> curl -sSL https://install.pi-hole.net -o install.sh
> less install.sh
> bash install.sh
> ```

### Installation avec Docker Compose

Pour ceux qui préfèrent Docker :

```yaml
# compose.yml

services:
  pihole:
    image: pihole/pihole:latest
    restart: unless-stopped
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "80:80/tcp"
    environment:
      TZ: 'Europe/Paris'
      WEBPASSWORD: 'votre-mot-de-passe'
      PIHOLE_DNS_: '1.1.1.1;9.9.9.9'
    volumes:
      - pihole_data:/etc/pihole
      - dnsmasq_data:/etc/dnsmasq.d
    cap_add:
      - NET_ADMIN

volumes:
  pihole_data:
  dnsmasq_data:
```

> Le port 53 doit être libre. Sur Ubuntu 22.04+, `systemd-resolved` occupe ce port :
> ```bash
> sudo systemctl disable --now systemd-resolved
> sudo rm /etc/resolv.conf
> echo "nameserver 1.1.1.1" | sudo tee /etc/resolv.conf
> ```

### Configuration pendant l'installation (script)

L'assistant interactif demande :
1. **Interface réseau** : choisir l'interface principale (`eth0`, `ens3`...)
2. **DNS upstream** : serveur DNS amont (Cloudflare `1.1.1.1`, Quad9 `9.9.9.9`...)
3. **Listes de blocage** : accepter les listes par défaut
4. **Protocoles** : IPv4 et IPv6
5. **IP statique** : confirmer l'IP locale du serveur
6. **Interface web** : activer (recommandé)

À la fin, l'installateur affiche le mot de passe de l'interface web.

## Interface d'administration

Accessible sur `http://ip-du-serveur/admin` :

- **Dashboard** : statistiques en temps réel (requêtes totales, % bloquées, top domaines)
- **Query Log** : journal de toutes les requêtes DNS (utile pour déboguer)
- **Blacklist / Whitelist** : ajouter/retirer des domaines manuellement
- **Group Management** : différentes règles par groupe d'appareils
- **Settings** : configuration générale, DNS upstream, DHCP

## Configurer le réseau pour utiliser Pi-hole

### Option 1 : Configuration sur le routeur (recommandé)

La meilleure option : tous les appareils utilisent Pi-hole automatiquement.

Dans l'interface de votre routeur, chercher **DNS** dans les paramètres DHCP :
- **DNS primaire** : IP du serveur Pi-hole (ex: `192.168.1.100`)
- **DNS secondaire** : laisser vide ou mettre la même IP

Tous les nouveaux appareils obtenant une adresse via DHCP utiliseront Pi-hole.

### Option 2 : Configuration par appareil

Si vous ne pouvez pas modifier le routeur, configurer manuellement le DNS sur chaque appareil :

**Linux** (`/etc/resolv.conf` ou Netplan) :
```bash
# /etc/resolv.conf
nameserver 192.168.1.100
```

**Windows** : Paramètres réseau > Propriétés de la connexion > IPv4 > DNS manuel

### Option 3 : Pi-hole comme serveur DHCP

Pi-hole peut aussi gérer le DHCP à la place du routeur : désactiver le DHCP sur le routeur et activer celui de Pi-hole dans Settings > DHCP. Pi-hole distribue alors directement son IP comme DNS.

## Listes de blocage

Pi-hole est livré avec la liste **StevenBlack** (~170 000 domaines). Des milliers d'autres listes sont disponibles.

### Ajouter des listes

**Settings > Adlists > Add adlist**

Listes recommandées :

```
# StevenBlack (déjà incluse)
https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts

# OISD (très complète, peu de faux positifs)
https://big.oisd.nl/

# Hagezi (plusieurs niveaux de blocage)
https://raw.githubusercontent.com/hagezi/dns-blocklists/main/adblock/pro.txt

# Malware et phishing
https://raw.githubusercontent.com/nicehash/nicehash/master/etc/hosts
```

Après ajout : **Tools > Update Gravity** pour télécharger les nouvelles listes.

## Débloquer un domaine (whitelist)

Pi-hole peut parfois bloquer un service légitime. Pour le débloquer :

**Whitelist > Add domain** ou depuis le Query Log, cliquer sur le domaine bloqué > **Whitelist**.

Domaines fréquemment à whitelister :
- `clients4.google.com` (mise à jour Chrome)
- `connectivitycheck.gstatic.com` (détection réseau Android)
- `api.spotify.com` si Spotify est bloqué

## Mettre à jour Pi-hole

```bash
# Mise à jour de Pi-hole
pihole -up

# Mettre à jour les listes de blocage (gravity)
pihole -g
```

## Commandes utiles

```bash
# Voir les statistiques en CLI
pihole -c

# Activer / désactiver Pi-hole temporairement
pihole disable 30m   # désactiver pendant 30 minutes
pihole enable

# Voir les logs en temps réel
pihole -t

# Vider le cache DNS
pihole flush

# Voir la version
pihole -v
```

## Statistiques typiques

Sur un réseau domestique, Pi-hole bloque généralement entre **15% et 30%** de toutes les requêtes DNS. Sur un réseau avec des smart TVs et objets connectés, ce chiffre peut monter à 40%.

## Dépannage

### Un site ne charge plus
Vérifier dans le Query Log si le domaine est bloqué. Si oui, l'ajouter à la whitelist.

### Pi-hole ne bloque plus rien
Vérifier que votre routeur/appareil utilise bien l'IP de Pi-hole comme DNS :
```bash
nslookup ads.google.com
# Server: doit être l'IP de Pi-hole
```

### Pi-hole lent au démarrage
Le chargement de grandes listes de blocage (gravity) prend quelques secondes au démarrage. Attendre 30 secondes avant de tester.

## Récapitulatif

| Commande | Description |
|---|---|
| `pihole -up` | Mettre à jour Pi-hole |
| `pihole -g` | Mettre à jour les listes (gravity) |
| `pihole -c` | Statistiques en CLI |
| `pihole disable 30m` | Désactiver 30 minutes |
| `pihole enable` | Réactiver |
| `pihole -t` | Logs en temps réel |
| `pihole flush` | Vider le cache DNS |

Pi-hole est un des projets homelab les plus populaires car il apporte un bénéfice immédiat et visible sur tout le réseau. Associé à [WireGuard](/blog/wireguard-vpn-linux), vous pouvez même bénéficier du blocage depuis l'extérieur en vous connectant à votre VPN.
