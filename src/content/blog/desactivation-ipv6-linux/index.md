---
title: "Désactivation d'IPv6 sous GNU/Linux : Guide étape par étape"
description: >-
  Dans cet article nous allons voir comment simplement désactiver la
  fonctionnalité IPV6 sur un système d’exploitation Linux.
publishDate: '2021-10-21T11:41:53+02:00'
tags:
  - linux
  - réseau
language: fr
draft: false
comment: true
heroImage:
  src: ./Desactivation-dIPv6-sous-GNU_Linux-_-Guide-etape-par-etape.png
  alt: 'Désactivation d&rsquo;IPv6 sous GNU/Linux : Guide étape par étape'
---
Modifications du fichier sysctl.conf
------------------------------------

Il est possible de désactiver complètement l’utilisation de l’ipv6 sous linux via le fichier sysctl.conf. Ce fichier est situé dans /etc/

Pour pouvoir le modifier il faut l’ouvrir en mode super utilisateur ou Root en utilisant l’editeur de votre choix.

```bash
sudo vim /etc/sysctl.conf
```
Pour désactiver l’ipv6 sur toutes les cartes réseaux

```bash
net.ipv6.conf.all.disable_ipv6 = 1
```
Pour désactiver sur une carte en particulier

```bash
net.ipv6.conf.enp0s3.disable_ipv6 = 1
```
Pour appliquer les changements, taper directement le commande suivante et redémarrer le système.

```bash
sudo sysctl -p
```
