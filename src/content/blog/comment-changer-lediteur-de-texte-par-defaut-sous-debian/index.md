---
title: Comment changer l'éditeur de texte par défaut sous Debian
description: >-
  Comment définir l'éditeur de texte par défaut sous Debian toutes versions confondu
publishDate: '2024-03-04T17:31:09+01:00'
tags:
  - administration système
  - linux
language: fr
draft: false
comment: true
heroImage:
  src: ./Planification-de-taches-avec-crontab-2.png
  alt: Comment changer l'éditeur de texte par défaut sous Debian
---
**Introduction**
----------------

Sous Debian, l’éditeur par défaut est généralement nano. Cependant, vous pouvez facilement le changer pour utiliser un autre éditeur, comme vim ou gedit. Ce guide complet vous explique comment modifier la configuration de votre système pour utiliser l’éditeur de votre choix.

**Pourquoi changer l’éditeur par défaut ?**
-------------------------------------------

Il existe plusieurs raisons pour lesquelles vous pouvez vouloir changer l’éditeur par défaut sous Debian:

- Vous êtes plus familier avec un autre éditeur.
- Vous préférez les fonctionnalités d’un autre éditeur.
- Vous avez besoin d’un éditeur plus puissant pour une tâche spécifique.

**Choisir un nouvel éditeur**
-----------------------------

Avant de changer l’éditeur par défaut, il est important de choisir un éditeur qui répond à vos besoins. Voici quelques facteurs à prendre en compte lors de votre choix:

- **Fonctionnalités:** Quels types de fonctionnalités recherchez-vous dans un éditeur ? Avez-vous besoin de la coloration syntaxique, de la numérotation des lignes, de la prise en charge des macros, etc. ?
- **Facilité d’utilisation:** Êtes-vous à l’aise avec l’interface et les commandes de l’éditeur ?
- **Popularité:** La popularité d’un éditeur peut être un indicateur de sa qualité et de sa communauté de support.

**Voici quelques-uns des éditeurs de texte les plus populaires pour Debian:**

- **Nano:** Un éditeur simple et convivial, idéal pour les débutants.
- **Vim:** Un éditeur puissant et personnalisable, populaire auprès des développeurs.
- **Gedit:** Un éditeur graphique avec une interface intuitive, adapté aux utilisateurs occasionnels.
- **Sublime Text:** Un éditeur payant avec de nombreuses fonctionnalités avancées, populaire auprès des développeurs et des écrivains.

**Changer l’éditeur par défaut**
--------------------------------

### **Étape 1: Installer l’éditeur**

La première étape consiste à installer l’éditeur que vous souhaitez utiliser comme éditeur par défaut. Vous pouvez le faire en utilisant la commande `apt` dans un terminal:

```bash
sudo apt install <nom-de-l'editeur>
```
Par exemple, pour installer vim, vous utiliseriez la commande suivante:

```bash
sudo apt install vim
```
### **Étape 2: Modifier la configuration**

Une fois l’éditeur installé, vous devez modifier la configuration de votre système pour l’utiliser comme éditeur par défaut. Il existe deux manières de le faire:

**1. Méthode utilisant le fichier de configuration**

- Ouvrez le fichier de configuration `/etc/default/editor` avec un éditeur de texte:

```bash
sudo nano /etc/default/editor
```
- Dans le fichier, recherchez la ligne `EDITOR`.
- Modifiez la valeur de la variable `EDITOR` pour qu’elle pointe vers l’éditeur de votre choix. Par exemple, pour utiliser vim comme éditeur par défaut, vous devez modifier la ligne comme ceci:

```bash
EDITOR=vim
```
- Enregistrez le fichier et quittez l’éditeur.

**2. Méthode utilisant l’utilitaire update-alternatives**

- Vous pouvez également utiliser l’utilitaire `update-alternatives` pour changer l’éditeur par défaut. Pour ce faire, ouvrez un terminal et tapez la commande suivante:

```bash
sudo update-alternatives --config editor
```
- Cette commande affichera une liste des éditeurs disponibles.
- Sélectionnez le numéro de l’éditeur que vous souhaitez utiliser comme éditeur par défaut.
- Appuyez sur Entrée pour enregistrer votre choix.

### **Étape 3: Déconnexion et reconnexion**

Pour que les modifications prennent effet, vous devez vous déconnecter et vous reconnecter à votre session.

**Conseils supplémentaires**
----------------------------

- Si vous n’êtes pas sûr de l’éditeur à choisir, vous pouvez essayer plusieurs éditeurs avant de prendre votre décision.
- Vous pouvez également installer plusieurs éditeurs et les utiliser en fonction de vos besoins.
- Il existe de nombreuses ressources disponibles en ligne pour vous aider à apprendre à utiliser les différents éditeurs disponibles pour Debian.

**Conclusion**
--------------

Vous avez maintenant appris comment changer l’éditeur par défaut sous Debian. En suivant les instructions de ce guide, vous pouvez facilement choisir l’éditeur qui vous convient le mieux et l’utiliser pour toutes vos tâches d’édition.
