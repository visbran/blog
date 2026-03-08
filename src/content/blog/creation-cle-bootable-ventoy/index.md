---
title: 'Ventoy : l’utilitaire ultime pour la création de clé usb ...'
description: >-
  La force de Ventoy réside dans le fait de pouvoir mettre dans sa clé USB
  plusieurs ISO différentes sans avoir à la reformater
publishDate: '2020-05-30T12:18:32+02:00'
tags:
  - linux
  - windows
language: fr
draft: false
comment: true
heroImage:
  src: ./Ventoy-_-lutilitaire-ultime-pour-la-creation-de-cle-usb-bootable.png
  alt: 'Ventoy : l’utilitaire ultime pour la création de clé usb bootable'
---
Ventoy la nouvelle solution de clé usb bootable
===============================================

Ventoy est un nouveau dans le monde du logiciel open-source. Il est programmé en C par “longpanda” sur Github, basé en chine. Il est sorti de sa version beta il y a quelques jours.

Ce programme permet la création d’une clé USB bootable. Me direz-vous il existe déjà des solutions comme [Rufus](https://rufus.ie/) ou encore [BelenaEtcher](https://www.balena.io/etcher/). La différence de Ventoy réside dans le fait de pouvoir mettre dans sa clé USB plusieurs ISO différentes sans avoir à reformaté sa clé USB pour ajouter chaque ISO.

Voici les caractéristiques de Ventoy :

- 100 % Open Source
- Simple d’utilisation et facile à installé
- Rapide d’utilisation, la seul contrainte réside dans le fait de devoir copier L’ISO sur la clé USB
- Il supporte le BIOS ainsi que l’UEFI
- Un grand nombre de système d’exploitation à été testé (plus de 1100)
- Il est possible de démarrer en live sur un ISO mais aussi d’effectuer une installation complète
- Les ISO sont affichés sous forme de liste dans un menu lors du démarrage
- Il est possible stocker vos documents sur la clé, cela ne casse pas l’intégrité de la clé USB
- Mise à jour possible sans suppression des données &amp; ISO

Téléchargement de Ventoy
------------------------

Pour le téléchargement du logiciel Ventoy rien de plus simple rendez-vous sur le site officiel dans la rubrique « **Download** » puis selectionner la version compatible avec votre système d’exploitation, Windows ou Linux.   
A noter qu’aucune version pour mac n’est disponible actuellement.

](https://ventoy.net/en/index.html)Le code source du projet ainsi que les packages d’installation sont également disponible sur le repo de github :

](https://github.com/ventoy/Ventoy)Une fois le programme téléchargé, vous devez décompresser l’archive au format .zip sous Windows et tar.gz pour Linux.  
Pour décompresser le format .zip sous Windows, c’est très simple, faite un clique droit sur le fichier et sélectionner la mention « extraire ici » avec le logiciel de décompression WinRAR ou alors vous pouvez utiliser celui présent par défaut, la mention présente dans le menu contextuel est « extraire tout »  
  
Pour Linux vous avez deux possibilités, soit via l’interface graphique, c’est le même principe que sur Windows ou alors vous pouvez le faire avec une ligne de commande directement via le Terminal

```
<pre class="wp-block-code">```bash
tar -xzvf ventoy-1.0.97-linux.tar.gz
```
```

Ensuite allez vers le dossier et cliquez sur “Ventoy2disk.exe” et n’oubliez pas de brancher votre support USB avant afin qu’elle soit reconnu par le programme. Cliquez sur le bouton **Install** et patienter le temps de l’installation.

Principe d’utilisation
----------------------

Une fois que le logiciel est installé, il vous suffit simplement de glisser-déposer les ISO’s dans la clé USB et ils seront automatiquement détecté lors du Boot.
