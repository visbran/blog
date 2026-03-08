---
title: 'Commande find linux : Comment supprimer des fichiers ?'
description: Comment utiliser la commande find sous Linux pour supprimer des fichiers.
publishDate: '2024-06-10T21:53:07+02:00'
tags:
  - administration système
  - linux
  - scripting
language: fr
draft: false
comment: true
heroImage:
  src: ./xik9zukjekq.jpg
  alt: 'Commande find linux : Comment supprimer des fichiers ?'
---
Introduction
------------

Gérer nos fichiers, c’est un peu comme notre pain quotidien, n’est-ce pas ? Parfois, je dois dire au revoir à certains fichiers pour libérer de l’espace ou pour des raisons de sécurité.

Dans cet article, je vais vous montrer comment utiliser la commande `<a href="https://www.man-linux-magique.net/man1/find.html">find</a>` sous Linux pour supprimer des fichiers.

Je vais explorer trois méthodes spécifiques :

- dire adieu aux fichiers de plus de 30 jours,
- supprimer les fichiers avec une extension spécifique et
- nettoyer l’ancien répertoire de manière récursive.

Prêt à commencer ?

![](https://media4.giphy.com/media/aCdrAmmWM7fI0LvC2u/giphy.gif?cid=7941fdc6j6lmf8l7ds7cwvxhrecw9k2pgr52iespsvhhscyo&ep=v1_gifs_search&rid=giphy.gif&ct=g)

Suppression des fichiers de plus de 30 jours
--------------------------------------------

La commande `find` peut être utilisée pour rechercher des fichiers et des répertoires de plus de 30 jours. Pour ce faire, vous pouvez utiliser la commande suivante dans votre terminal Linux :

```bash
	find /opt/backup -type f -mtime +30

```
Ici, `/opt/backup` est le répertoire à rechercher, `-type f` signifie que nous recherchons des fichiers, et `-mtime +30` signifie que nous recherchons des fichiers modifiés il y a plus de 30 jours. Une fois que vous avez confirmé que les fichiers corrects sont trouvés, vous pouvez ajouter le flag `-delete` pour supprimer ces fichiers.

Suppression des fichiers avec une extension spécifique
------------------------------------------------------

La commande `find` peut également être utilisée pour supprimer des fichiers avec une extension spécifique. Par exemple, pour supprimer tous les fichiers `.log` de plus de 30 jours, vous pouvez utiliser la commande suivante :

```javascript
find /var/log -name 
```
Ici, `-name "*.log"` signifie que nous recherchons des fichiers avec l’extension `.log`.

Suppression de l’ancien répertoire de manière récursive
-------------------------------------------------------

Enfin, la commande `find` peut être utilisée pour supprimer un ancien répertoire de manière récursive. Pour ce faire, vous pouvez utiliser la commande suivante :

```javascript
find /var/log -type d -mtime +30 -exec rm -rf {} \\\\\\\\;

```
Ici, `-type d` signifie que nous recherchons des répertoires, `-mtime +30` signifie que nous recherchons des répertoires modifiés il y a plus de 30 jours, et `-exec rm -rf {} \\\\\\\\;` signifie que nous souhaitons supprimer ces répertoires et leur contenu de manière récursive.

Conclusion
----------

La commande `find` sous Linux est un outil puissant pour la gestion des fichiers. Que vous souhaitiez supprimer des fichiers de plus de 30 jours, des fichiers avec une extension spécifique ou un ancien répertoire de manière récursive, `find` a la flexibilité de le faire. N’oubliez pas de faire preuve de prudence lors de l’utilisation de ces commandes, car la suppression de fichiers est une action irréversible.

Si vous avez besoin d’aide ou d’une assistance, vous pouvez mettre un commentaire ci-dessous ou via la [page de contact.](https://visbran.fr/contact/)
