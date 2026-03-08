---
title: 'Inxi, un outil linux pour afficher des infos systemes'
description: >-
  Inxi permet d'afficher rapidement les informations systèmes et matériels.
  Disponible sur la plupart des distributions Linux avec un support pour BSD
publishDate: '2021-04-23T15:32:53+02:00'
tags:
  - linux
  - scripting
language: fr
draft: false
comment: true
heroImage:
  src: ./Inxi-un-outil-linux-pour-afficher-des-infos-systemes.png
  alt: 'Inxi, un outil linux pour afficher des infos systemes'
---
Qu’est ce que INXI ?
====================

D’après le github (lien disponible ci-dessous), Inxi est un script qui est possible d’utiliser en CLI ou IRC. Disponible sur la plupart des distributions Linux avec un support pour BSD. Il permet d’afficher rapidement les informations systèmes et matériels :

- Processeur
- Pilotes utilisé
- Xorg
- Type d’environement de bureau
- Le noyau linux
- Utilisation de la RAM
- Et plein d’autres informations

[smxi/inxi](https://github.com/smxi/inxi)Une coloration syntaxique est disponible par défaut, vous pouvez la désactiver au besoin.

```bash
inxi -c 0
```
Installation du script
----------------------

Pour installer Inxi sur une distribution Debian avec le gestionnaire de paquet APT (Ubuntu, Linux Mint), il suffit de taper cette commande ci-dessous via le terminal :

```bash
sudo apt install -y inxi
```
Sur une distribution Linux basé sur RedHat/Yum, Fedora, taper la commande suivante :

```bash
sudo yum install -y inxi 
```
Le projet inxi dispose également d’une page GitHub dédiée à inxi avec des instructions détaillées sur la façon d’obtenir la dernière version de développement si vous souhaitez utiliser celle-ci à la place.

Utilisation du script
---------------------

Je vais montrer les commandes de base pour afficher les informations du C.P.U et de la R.A.M

```bash
inxi -C #affiche les informations du CPU
```
![](https://beta.visbran.fr/wp-content/uploads/2024/04/Capture_dcran_de_2020-11-27_16-30-21.png)Pour afficher plus d’informations :

```bash
inxi -CfxCa
```
![](https://beta.visbran.fr/wp-content/uploads/2024/04/Capture_dcran_de_2020-11-27_16-33-42.png)Pour afficher les informations liés à la RAM

```bash
inxi -m #affiche les informations de la mémoire
```
![](https://beta.visbran.fr/wp-content/uploads/2024/04/inxi_info_ram.png)Avec les droits root, plus d’informations s’affiche

![](https://beta.visbran.fr/wp-content/uploads/2024/04/inxi_info_ram_root.png)Les autres infos q’*inxi* peut afficher
=======================================

En plus des informations de processeur, inxi peut fournir des informations detaillées sur :

- Les cartes graphiques,
- Disques durs,
- Raid et partition,
- Usb,
- Capteur de température,
- Le système installé,
- La puce audio,
- La puce réseau.

Si vous voulez afficher toutes ces informations, il vous suffit de taper :

```bash
inxi -F
```
![](https://beta.visbran.fr/wp-content/uploads/2024/04/plusdinfo_inxi.png)
```bash
sudo inxi -v8 #affiche toutes les informations possibles
```

```bash
sudo inxi -F #affiche plus d'informations (numéro de serie, etc)
```
[Lien vers le manuel](https://smxi.org/docs/inxi-man.htm)
