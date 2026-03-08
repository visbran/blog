---
title: Planification de tâches avec crontab
description: Crontab est un outil puissant pour automatiser des tâches répétitives sur un
  système Unix.
publishDate: '2024-03-04T18:01:38+01:00'
tags:
  - administration système
  - linux
  - automatisation
  - sécurité
  - scripting
language: fr
draft: false
comment: true
heroImage:
  src: ./Planification-de-taches-avec-crontab.png
  alt: Planification de tâches avec crontab
---
Crontab est un outil puissant pour automatiser des tâches répétitives sur un système Unix. Ce guide complet vous explique comment utiliser crontab pour :

- Planifier des tâches quotidiennes, hebdomadaires ou mensuelles.
- Exécuter des scripts et des commandes à des moments précis.
- Rediriger la sortie des commandes vers des fichiers journaux.
- Gérer les tâches crontab pour plusieurs utilisateurs.

Planification de tâches avec crontab
------------------------------------

### Tâches planifiées

Crontab est un outil puissant pour planifier l’exécution de tâches à des moments précis sur un système Unix. Il est utilisé pour automatiser des tâches répétitives, telles que la sauvegarde de fichiers, l’envoi de rapports et l’exécution de scripts.

Voici quelques exemples de tâches que vous pouvez planifier avec crontab :

- Sauvegarder des fichiers quotidiennement à minuit.
- Envoyer un rapport hebdomadaire par e-mail le vendredi à 10h.
- Exécuter un script qui analyse les données du serveur toutes les 5 minutes.

### Lister les tâches planifiées

Pour afficher la liste des tâches actuellement planifiées, utilisez la commande suivante :

```bash
crontab -l
```
Cette commande affichera toutes les tâches planifiées pour l’utilisateur actuel.

### Editer une tâche

Pour modifier une tâche planifiée, utilisez la commande suivante :

```bash
crontab -e
```
Cette commande ouvrira un éditeur de texte dans lequel vous pourrez modifier les tâches planifiées.

### Exécuter une commande tous les jours à 22h00

Pour exécuter une commande tous les jours à 22h00 et rediriger les informations dans un fichier journal, utilisez la syntaxe suivante :

```bash
00 22 ***** /root/scripts/sauvegarde.sh >> sauvegarde.log
```
**Explication de la syntaxe :**

- `00 22` : Indique l’heure d’exécution, ici 22h00.
- `*****` : Remplace les astérisques par les valeurs appropriées pour les minutes, les jours du mois, les mois et les jours de la semaine. Dans cet exemple, les astérisques indiquent que la commande doit être exécutée tous les jours à 22h00.
- `/root/scripts/sauvegarde.sh` : Indique le chemin d’accès à la commande à exécuter.
- `>> sauvegarde.log` : Redirige la sortie de la commande vers un fichier journal nommé `sauvegarde.log`.

### Exécuter un script CLI toutes les minutes

Pour exécuter un script CLI toutes les minutes, vous pouvez utiliser la syntaxe suivante :

```bash
* * * * * /usr/bin/php  /path/to/blabla/admin/cli/cron.php >/dev/null
```
**Explication de la syntaxe :**

- `* * * * *` : Indique que la commande doit être exécutée toutes les minutes.
- `/usr/bin/php` : Indique l’interpréteur PHP.
- `/path/to/blabla/admin/cli/cron.php` : Indique le chemin d’accès au script CLI.
- `>/dev/null` : Redirige la sortie de la commande vers le périphérique nul, ce qui la masque.

Conclusion
----------

Crontab est un outil puissant et flexible pour automatiser des tâches sur un système Unix. En utilisant les exemples ci-dessus, vous pouvez commencer à planifier vos propres tâches et à automatiser votre flux de travail.

**N’oubliez pas de tester vos tâches planifiées attentivement avant de les mettre en production.**
