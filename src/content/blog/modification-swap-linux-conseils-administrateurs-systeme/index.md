---
title: Modification du swap sous Linux
description: >-
  Le swap est un espace de stockage utilisé par le système d'exploitation pour stocker temporairement des données
publishDate: '2023-06-25T18:32:40+02:00'
tags:
  - administration système
  - linux
language: fr
draft: false
comment: true
heroImage:
  src: ./Modification-du-swap-sous-Linux.png
  alt: Modification du swap sous Linux
---
Le swap, également connu sous le nom de partition d’échange, est un espace de stockage utilisé par le système d’exploitation pour stocker temporairement des données. Le swap est particulièrement utile lorsque la mémoire vive (RAM) est insuffisante pour exécuter toutes les applications en cours d’exécution. Dans cet article, nous allons discuter de la modification du swap sous Linux et comment elle peut améliorer les performances de votre système d’exploitation.

Augmenter la taille du swap
---------------------------

Lorsque vous exécutez de nombreuses applications simultanément sur votre système Linux, il est possible que la mémoire vive soit insuffisante pour toutes les exécuter. Dans ce cas, le système d’exploitation utilise la partition de swap pour stocker temporairement des données. Si la taille de la partition de swap est insuffisante, vous pouvez rencontrer des problèmes de performances sur votre système.

Pour augmenter la taille du swap, vous pouvez suivre les étapes suivantes :

- Vérifiez la taille actuelle de la partition de swap en exécutant la commande :

```bash
`sudo swapon -s`
```
- Désactivez la partition de swap en exécutant la commande :

```bash
`sudo swapoff -v /dev/[nom_de_la_partition_swap]`
```
- Redimensionnez la partition de swap en utilisant la commande :

```bash
`sudo fdisk /dev/[nom_du_disque]`
```
- Créez une nouvelle partition de swap en utilisant la commande :

```bash
`sudo mkswap /dev/[nouveau_nom_de_la_partition_swap]`
```
- Activez la nouvelle partition de swap en utilisant la commande :

```bash
`sudo swapon /dev/[nouveau_nom_de_la_partition_swap]`
```
- Vérifiez que la nouvelle partition de swap est activée en exécutant la commande :

```bash
`sudo swapon -s`
```
Modifier la priorité du swap
----------------------------

La priorité du swap détermine l’ordre dans lequel les partitions de swap sont utilisées par le système d’exploitation. Si vous avez plusieurs partitions de swap sur votre système, vous pouvez modifier leur priorité pour améliorer les performances.

Pour modifier la priorité du swap, vous pouvez suivre les étapes suivantes :

1. Vérifiez la priorité actuelle des partitions de swap en exécutant la commande `sudo swapon -s`.
2. Désactivez toutes les partitions de swap en utilisant la commande `sudo swapoff -a`.
3. Modifiez la priorité de chaque partition de swap en utilisant la commande `sudo swapon -p [nouvelle_priorité] /dev/[nom_de_la_partition_swap]`.
4. Activez toutes les partitions de swap en utilisant la commande `sudo swapon -a`.
5. Vérifiez que les partitions de swap sont activées avec la nouvelle priorité en exécutant la commande `sudo swapon -s`.

Supprimer une partition de swap
-------------------------------

Si vous n’utilisez plus une partition de swap, vous pouvez la supprimer pour libérer de l’espace disque.

Pour supprimer une partition de swap, vous pouvez suivre les étapes suivantes :

1. Désactivez la partition de swap en utilisant la commande `sudo swapoff -v /dev/[nom_de_la_partition_swap]`.
2. Supprimez la partition de swap en utilisant la commande `sudo rm /dev/[nom_de_la_partition_swap]`.
3. Supprimez l’entrée de la partition de swap dans le fichier `/etc/fstab`.

Conclusion
----------

La modification du swap sous Linux est un processus important pour améliorer les performances de votre système d’exploitation. En augmentant la taille du swap, en modifiant la priorité du swap et en supprimant les partitions de swap inutilisées, vous pouvez améliorer les performances de votre système Linux. N’oubliez pas de sauvegarder vos données avant de modifier la partition de swap et de suivre les étapes avec prudence pour éviter toute perte de données ou tout autre problème. Ces conseils pratiques devraient aider les administrateurs système à optimiser leur système Linux pour une utilisation plus efficace.
