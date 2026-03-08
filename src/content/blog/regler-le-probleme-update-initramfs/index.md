---
title: Update-initramfs - Régler le problème set the resume variable to override this
description: >-
  Lors de la mise à jour de votre système Linux, vous pouvez rencontrer l'erreur suivante : 
  update-initramfs - Generating /boot/initrd.img-5.15.0-67-generic
publishDate: '2023-04-23T16:54:34+02:00'
tags:
  - administration système
  - linux
language: fr
draft: false
comment: true
heroImage:
  src: ./Regler-le-probleme-Set-the-RESUME-variable-to-override-this.png
---
Comprendre le problème
----------------------

Le fichier initrd.img est un fichier système qui contient les informations nécessaires au démarrage de votre système Linux. Il est créé lors de l’installation initiale de votre système et est mis à jour à chaque mise à jour importante. Si vous rencontrez l’erreur « update-initramfs: Generating /boot/initrd.img-5.15.0-67-generic », cela signifie que le système tente de reprendre à partir d’un emplacement de stockage incorrect.

### Trouver la partition correcte

La première étape consiste à trouver la partition correcte pour votre système de fichiers racine. Vous pouvez utiliser la commande suivante pour afficher une liste des partitions disponibles :

```bash
sudo fdisk -l

```

```bash
blkid | awk -F\\
```
Cela affichera une liste de toutes les partitions disponibles sur votre système. Trouvez la partition qui contient votre système de fichiers racine (généralement /dev/sda1) et notez le nom de l’appareil.

### Modifier le fichier /etc/initramfs-tools/conf.d/resume

La prochaine étape consiste à modifier le fichier /etc/initramfs-tools/conf.d/resume pour spécifier la partition correcte pour votre système de fichiers racine. Vous pouvez utiliser l’éditeur de texte de votre choix pour ouvrir le fichier :

```bash
sudo vim /etc/initramfs-tools/conf.d/resume

```
Dans le fichier, vous devriez voir la ligne suivante :

```bash
RESUME=UUID=09e25397-4a2c-4fb0-a605-a7013eecb59c

```
Remplacez l’UUID par le nom de l’appareil de votre partition de système de fichiers racine. Par exemple, si votre système de fichiers racine se trouve sur /dev/sda1, remplacez la ligne par :

```bash
RESUME=/dev/sda1
```
### Mettre à jour le fichier initramfs

Une fois que vous avez modifié le fichier /etc/initramfs-tools/conf.d/resume, vous devez mettre à jour le fichier initramfs en utilisant la commande suivante :

```bash
sudo update-initramfs -u -k all

```
Cela va générer un nouveau fichier initrd.img avec les modifications que vous avez apportées.

Redémarrer votre système
------------------------

Enfin, redémarrez votre système pour appliquer les modifications :

```bash
sudo reboot

```
Une fois que votre système a redémarré, vous ne devriez plus rencontrer l’erreur « update-initramfs: Generating /boot/initrd.img-5.15.0-67-generic ». Votre système devrait maintenant démarrer correctement.
