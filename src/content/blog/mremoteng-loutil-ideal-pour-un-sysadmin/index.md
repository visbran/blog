---
title: mRemoteNG l’outil ideal pour un SysAdmin
description: >-
  mRemoteNG permet de gérer plusieurs connexions à distance à partir d'une seule
  interface utilisateur.
publishDate: '2021-04-24T12:01:06+02:00'
tags:
  - windows
  - réseau
  - ssh
language: fr
draft: false
comment: true
heroImage:
  src: ./mRemoteNG-loutil-ideal-pour-un-SysAdmin.png
  alt: mRemoteNG l’outil ideal pour un SysAdmin
---
![](https://beta.visbran.fr/wp-content/uploads/2024/04/logo_mgremote.png)Introduction
------------

De nos jours, les entreprises se tournent de plus en plus vers les solutions de travail à distance pour gérer leur personnel et rester compétitives. Cependant, avec la diversité des plates-formes et des protocoles de connexion à distance, il devient difficile de gérer efficacement les connexions à distance. C’est là qu’intervient le logiciel mRemoteNG, qui permet de gérer plusieurs connexions à distance à partir d’une seule interface utilisateur. Dans cet article, nous allons examiner en détail la configuration du logiciel mRemoteNG pour gérer les connexions à distance.

Présentation
------------

mRemoteNG est un [fork](https://fr.wikipedia.org/wiki/Fork_%28d%C3%A9veloppement_logiciel%29) de [mRemote](https://www.gladir.com/SOFTWARE/MREMOTE/presentation.jpg), c’est un outil d’administration à distance tout-en-un.

L’outil permet de gérer les protocoles suivants :

- RDP (Remote Desktop/Terminal Server)
- VNC (Virtual Network Computing)
- ICA (Citrix Independent Computing Architecture)
- [SSH (Secure Shell)](https://blog.visbran.fr/configuration-ssh)
- Telnet (TELecommunication NETwork)
- HTTP/HTTPS (Hypertext Transfer Protocol)
- Rlogin
- Raw Socket Connections

L’outil, open source est hébergé sur [github](https://github.com/mRemoteNG/mRemoteNG), grâce à cet programme vous pouvez regrouper par exemple toutes vos connexions [RDP](https://fr.wikipedia.org/wiki/Remote_Desktop_Protocol) de votre parc informatique et vous passé du fameux outil Windows mstsc.exe “Connexion Bureau à Distance”.

Installation
------------

Pour la partie installation, rendez-vous sur la page :

[Téléchargement](https://mremoteng.org/download)Choisir la version stable en package “MSI” ou “ZIP” Lancer l’installation puis exécuter l’application.

Comment ajouter une nouvelle connexion à distance ?
---------------------------------------------------

Une fois que vous avez installé le logiciel mRemoteNG, vous pouvez ajouter une nouvelle connexion à distance en suivant ces étapes :

1. Cliquez sur l’icône « Ajouter une nouvelle connexion » dans la barre d’outils.
2. Sélectionnez le type de connexion que vous souhaitez ajouter (RDP, VNC, SSH, Telnet, etc.).
3. Entrez les informations de connexion, telles que l’adresse IP, le nom d’utilisateur et le mot de passe.
4. Donnez un nom à votre connexion et cliquez sur « Enregistrer ».

Comment organiser vos connexions à distance ?
---------------------------------------------

Lorsque vous avez plusieurs connexions à distance, il est important de les organiser pour les retrouver facilement. mRemoteNG propose plusieurs fonctionnalités pour organiser vos connexions à distance :

1. **Groupes de connexion** : Vous pouvez créer des groupes pour vos connexions à distance, tels que « Serveurs de production » ou « Bureaux à distance ». Pour créer un groupe, cliquez avec le bouton droit de la souris sur « Connexions à distance » dans le panneau de gauche et sélectionnez « Ajouter un groupe ».
2. **Filtres de connexion** : Vous pouvez utiliser des filtres de connexion pour afficher uniquement les connexions qui correspondent à certains critères. Pour créer un filtre de connexion, cliquez sur l’icône « Filtres » dans la barre d’outils et sélectionnez « Ajouter un filtre ».
3. **Favoris** : Vous pouvez marquer vos connexions préférées en tant que favoris pour un accès rapide. Pour ajouter une connexion en tant que favori, cliquez sur l’icône « Favoris » dans la barre d’outils.

**Comment se connecter à une connexion à distance ?**
-----------------------------------------------------

Maintenant que vous avez ajouté une connexion à distance et organisé vos connexions, il est temps de se connecter. Voici comment procéder :

1. Double-cliquez sur la connexion à distance que vous souhaitez ouvrir dans la liste des connexions.
2. Entrez votre nom d’utilisateur et votre mot de passe.
3. Cliquez sur « Connecter ».

Une fois que vous êtes connecté à la connexion à distance, vous pouvez travailler sur l’ordinateur distant comme si vous étiez devant l’ordinateur local.

Comment configurer les paramètres avancés ?
-------------------------------------------

mRemoteNG propose plusieurs paramètres avancés que vous pouvez configurer pour améliorer votre expérience de connexion à distance. Voici quelques exemples :

1. **Personnalisation de l’interface utilisateur** : Vous pouvez personnaliser l’apparence de l’interface utilisateur en modifiant les couleurs, les icônes et les polices.
2. **Enregistrement de session** : Vous pouvez enregistrer les sessions pour faciliter la connexion future. Pour enregistrer une session, cliquez sur l’icône « Enregistrer la session » dans la barre d’outils.
3. **Options de sécurité** : Vous pouvez configurer les options de sécurité pour votre connexion à distance, telles que le niveau d’authentification et le chiffrement.
4. **Paramètres du clavier** : Vous pouvez configurer les paramètres du clavier pour votre connexion à distance, tels que la répétition de la touche et la touche AltGr.

Pour configurer les paramètres avancés, cliquez sur « Outils » dans la barre d’outils et sélectionnez « Options ».

Concurrents
-----------

Le principal concurrent de mRemote est RoyalTS, il possède les mêmes qualités avec une interface similaire mais en version payante. Il est compatible Windows et Mac et aussi disponible sur iOS et Android.

Conclusion
----------

La configuration du logiciel mRemoteNG est un moyen facile et efficace de gérer plusieurs connexions à distance à partir d’une seule interface utilisateur. En suivant les étapes d’installation et en ajoutant vos connexions à distance, vous pouvez gérer vos connexions de manière organisée et efficace. Avec les options de personnalisation avancées, vous pouvez personnaliser l’interface utilisateur pour améliorer votre expérience de connexion à distance. Essayez mRemoteNG aujourd’hui et gérez facilement vos connexions à distance !

F.A.Q
-----

Oui, mRemoteNG utilise des protocoles de connexion sécurisés tels que SSH et TLS pour garantir que les connexions à distance sont sécurisées.

Oui, mRemoteNG prend en charge les connexions à distance vers des ordinateurs Mac et Linux à l’aide du protocole SSH.

Oui, mRemoteNG est facile à utiliser et offre une interface utilisateur intuitive pour gérer vos connexions à distance.
