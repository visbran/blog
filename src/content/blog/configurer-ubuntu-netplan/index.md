---
title: Utiliser Netplan pour configurer votre réseau sous Ubuntu
description: >-
  Netplan est plus simple et plus facile à utiliser que les méthodes
  traditionnelles de configuration réseau sur Ubuntu.
publishDate: '2024-03-19T18:19:20+01:00'
tags:
  - administration système
  - linux
  - réseau
language: fr
draft: false
comment: true
heroImage:
  src: >-
    ./Utiliser-Netplan-pour-configurer-votre-reseau-sous-Ubuntu-_-Guide-complet.png
  alt: Utiliser Netplan pour configurer votre réseau sous Ubuntu
---
Netplan est un outil de configuration réseau pour Ubuntu qui simplifie la configuration d’une adresse IP statique. Il est recommandé d’utiliser Netplan car il est plus simple et plus facile à utiliser que les méthodes traditionnelles de configuration réseau sur Ubuntu.

Installation de Netplan
-----------------------

Pour installer Netplan, il est recommandé de vérifier d’abord la version d’Ubuntu que vous utilisez. Pour cela, vous pouvez utiliser la commande suivante dans le terminal :

```bash
lsb_release -a
```
Cela vous donnera des informations sur la version d’Ubuntu installée sur votre système. Si vous utilisez Ubuntu 16.04 ou une version ultérieure, vous pouvez installer Netplan en utilisant la commande suivante :

```bash
sudo apt install netplan.io
```
Configuration de Netplan
------------------------

Une fois Netplan installé, vous pouvez configurer l’interface réseau en utilisant un fichier de configuration YAML. Voici un exemple de fichier de configuration YAML :

```bash
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: no
      addresses: [192.168.1.100/24]
      gateway4: 192.168.1.1
      nameservers:
          addresses: [8.8.8.8, 8.8.4.4]
```
Dans cet exemple, nous avons configuré l’interface réseau enp0s3 avec une adresse IP statique de 192.168.1.100, un masque de sous-réseau de 24 bits et une passerelle par défaut de 192.168.1.1. Nous avons également spécifié les adresses IP des serveurs DNS de Google.

Validation de la configuration
------------------------------

Après avoir configuré Netplan, vous pouvez valider la configuration en utilisant la commande suivante :

```bash
sudo netplan try
```
Cela appliquera temporairement la configuration et vous permettra de tester qu’elle fonctionne correctement. Si tout fonctionne comme prévu, vous pouvez appliquer la configuration de façon permanente en utilisant la commande suivante :

```bash
sudo netplan apply
```
Conclusion
----------

Netplan est un outil simple et facile à utiliser pour configurer une adresse IP statique sur Ubuntu. En utilisant un fichier de configuration YAML, vous pouvez rapidement configurer l’interface réseau et appliquer les modifications manuellement ou automatiquement au démarrage. Si vous avez des questions ou des commentaires, n’hésitez pas à les partager dans la section commentaires ci-dessous.
