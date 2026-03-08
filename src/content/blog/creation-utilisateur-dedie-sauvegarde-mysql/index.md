---
title: Création d’un utilisateur dédié MySQL 
description: Création d’un utilisateur dédié à la sauvegarde pour mysql et ajout des droits
publishDate: '2024-07-17T17:30:40+02:00'
tags:
  - administration système
  - mysql
language: fr
draft: false
comment: true
heroImage:
  src: ./y9kosyowyau.jpg
  alt: Création d’un utilisateur dédié à la sauvegarde pour mysql et ajout des droits
---
Introduction
------------

La gestion des bases de données est essentielle pour assurer la sécurité et la disponibilité des données. Une partie cruciale de cette gestion consiste à effectuer des sauvegardes régulières. Dans cet article, nous allons voir comment créer un utilisateur MySQL dédié spécifiquement pour les sauvegardes, et comment lui attribuer les privilèges nécessaires.

![](./image-1.gif)

Pour créer un utilisateur MySQL dédié à la réalisation des sauvegardes de toutes les bases de données, tu peux suivre ces étapes :

**Connexion au serveur MySQL/MariaDB en tant que superutilisateur**
-------------------------------------------------------------------

Assure-toi d’avoir les privilèges de superutilisateur pour créer un nouvel utilisateur.

```bash
mysql -u root -p
```

**Création de l’utilisateur pour la sauvegarde**
------------------------------------------------

Remplace `backupuser` par le nom d’utilisateur souhaité pour la sauvegarde et `password` par un mot de passe sécurisé.

```sql
CREATE USER 'backupuser'@'localhost' IDENTIFIED BY 'password';
```

**Attribution des privilèges nécessaires**
------------------------------------------

Pour effectuer des sauvegardes complètes des bases de données, l’utilisateur doit avoir les permissions suivantes :

- `**SELECT**` sur toutes les bases de données.
- `**SHOW VIEW**` sur toutes les bases de données.
- `**LOCK TABLES**` sur toutes les bases de données.
- `**EVENT**` sur toutes les bases de données (si vous sauvegardez les événements).

```bash
GRANT SELECT, SHOW VIEW, LOCK TABLES, EVENT ON *.* TO 'sauvegarde'@'localhott';
```

```bash
FLUSH PRIVILEGES;
```
Si tu veux autoriser l’accès depuis une adresse IP spécifique (par exemple, `192.168.1.100`), tu peux remplacer `'localhost'` par cette adresse IP.

### **Validation des privilèges**

Pour t’assurer que les privilèges ont été correctement attribués, tu peux exécuter la commande suivante :

```bash
SHOW GRANTS FOR 'backupuser'@'localhost';
```
Cela devrait afficher les privilèges accordés à l’utilisateur.

**Déconnexion du serveur MySQL/MariaDB**
----------------------------------------

Une fois que tu as terminé, tu peux quitter l’interface MySQL/MariaDB en tapant :

```bash
EXIT;
```
Conclusion 
-----------

![](./image-2.gif)

Maintenant, tu as un utilisateur MySQL dédié nommé `backupuser` avec les privilèges nécessaires pour effectuer des sauvegardes de toutes les bases de données. Assure-toi de conserver en sécurité les informations d’identification de cet utilisateur, car elles seront utilisées dans les scripts de sauvegarde.
