---
title: Comment supprimer un dossier ou un fichier avec un nom trop long
description: >-
  Il peut arriver que la modification de dossiers ou fichiers soit impossible en raison de la limite de 256 caractères.
publishDate: '2019-04-19T18:03:05+02:00'
tags:
  - administration système
  - windows
language: fr
draft: false
comment: true
heroImage:
  src: >-
    ./Comment-supprimer-un-dossier-ou-un-fichier-avec-un-nom-trop-long-sous-Windows.png
  alt: >-
    Comment supprimer un dossier ou un fichier avec un nom trop long sous
    Windows
---
Introduction à Robocopy
-----------------------

Lorsque vous essayez de modifier le nom d’un dossier ou d’un fichier dans une arborescence sous les systèmes d’exploitation Microsoft, il peut arriver que la modification soit impossible en raison de la longueur du nom du fichier, limitée à 256 caractères. Pour résoudre ce problème, vous pouvez utiliser l’outil intégré Robocopy, disponible sous Windows depuis 2006. Robocopy (Robust File Copy) est un outil puissant qui permet d’éviter des manipulations fastidieuses. Il offre des fonctionnalités telles que la tolérance à la perte de connexion réseau, la préservation du type de fichier et des métadonnées, un indicateur de progression dans l’invite de commandes, et la possibilité de copier des fichiers et des répertoires dont les noms excèdent les 256 caractères.

Utilisation de Robocopy avec l’option /Purge
--------------------------------------------

Pour supprimer un dossier ou un fichier avec un nom trop long, vous pouvez utiliser Robocopy pour copier en miroir un dossier vide et ensuite le supprimer. Pour ce faire, créez un dossier vide (par exemple « vide ») à la racine du lecteur C. Ensuite, ouvrez une invite de commandes en tant qu’administrateur et saisissez les commandes suivantes :

```bash
# On ce déplace dans le repertoire C:
cd C:\\
# On effectue la création d'un dosssier appelé 
```
Une fois cela fait, vous pouvez supprimer le dossier « vide » car il n’est plus nécessaire.

```bash
rmdir c:\\vide
```
**Remarque :** L’utilisation de RoboCopy avec l’option /Purge est une manipulation à effectuer avec précaution, car tous les fichiers et sous-dossiers inclus dans « le\_dossier\_long » seront supprimés.
