---
title: Chiffrer ses données avec GPG
description: >-
  GNU Privacy Guard (GPG) a pour objectif de signer et chiffrer pratiquement tous les documents numériques. Disponible nativement sous Linux.
publishDate: '2021-12-04T15:51:42+01:00'
tags:
  - linux
  - sécurité
language: fr
draft: false
comment: true
heroImage:
  src: ./Chiffrer-ses-donnees-GPG.png
  alt: Chiffrer ses données GPG
---

Qu’est ce que GPG ?
===================

GNU privacy guard est un outil multifonction, sous licence GNU, accessible gratuitement et disponible par défaut dans les principales distribution linux. Cet outil à pour objectif de signer et chiffrer quasiment tous documents numériques. GPG est basé sur le standard OpenGPG et a été crée en 1991 par Phil Zimmerman.

La version actuelle est la 2.4.5

[The GNU Privacy Guard](https://gnupg.org)

Générer sa paire de clé
-----------------------

Pour générer une paire de clé, il suffit de lancer un terminal et taper la commande suivante :

```bash
gpg --full-generate-key
# ou 
gpg --full-gen-key
```

Une fois la commande passé, il vous ai demandé de choisir le type de clé, dans la plupart des cas on choisira la première solution. Ensuite il est demandé le niveau de chiffrement de la clé, par défaut c’est 3072 bits, mais vous pouvez choisir la taille maximal 4096 bits.

![](https://beta.visbran.fr/wp-content/uploads/2024/04/gpg_generate_full-1024x514.jpg)Il faudra également choisir la durée de vie de la clé plusieurs solution sont possible, par défaut elle n’expire pas.

![](https://beta.visbran.fr/wp-content/uploads/2024/04/gpg_duree-1024x275.jpg)Il faudra complété quelque informations supplémentaires sur Nom,Prénom,Adresse Mail et un commentaire sur la raison de la clé.

![](https://beta.visbran.fr/wp-content/uploads/2024/04/gpg_information_personnel-1024x237.png)Une fois la clé généré, un récapitulatif vous ai affiché avec toutes les informations nécessaires.

![](https://beta.visbran.fr/wp-content/uploads/2024/04/gpg_recap-1024x219.png)Générer un certificat de révocation
-----------------------------------

Après avoir distribué votre clé privée, elle devient connus et alors, vous avez envie d’en générer une nouvelle. Mais pour cela il faut dissocier votre identité de la clé.

Pour ce faire il faut, utilisé le paramètre —output pour choisir le chemin ou vous souhait conservé la révocation.

```bash
gpg --output ~/revocation.crt --gen-revoke test@test.com
```

Il faudra donner une raison pour valider le certificat de révocation.

![](https://beta.visbran.fr/wp-content/uploads/2024/04/gpg_revocation-1024x375.jpg)### Attention

Vous devez absolument conserver cette clé en dehors de votre système, et lui affecter des droits spécifiques, en effet si une personne malveillante parvient à obtenir ce certificat elle peut révoquer votre clé à tout jamais. Vous allez vous octroyer les droits uniquement à vous même.

```bash
chmod 600 ~/revocation.crt
```
Importer la clé public d’une autre personne
-------------------------------------------

Pour chiffrer un message, un document à destination d’une autre personne, il vous faut importer sa clé publique.

```javascript
gpg --import johndoepk.key
```
Il y a une autre possibilité pour importé la clé public d’une personne, c’est via un serveur de clé public. Le serveur du MIT qui est le plus connus et souvent mis à jour. Il faudra utiliser deux options pour importer sa clé public le `—keyserver` suivi de l’adresse et le `—search-keys` <test@test.com>

```bash
gpg --keyserver pgp.mit.edu --search-keys test@test.com
```
Vérifier et signer une clé
--------------------------

Lorsque vous ajouté une clé public depuis un serveur, il faut vérifier que la clé appartient bien à la personne concerné. Il faut utilisé le paramètre `—fingerprint`

L’empreinte est généré avec 10 séquences de 4 caractères héxadécimal

```bash
gpg --fingerprint test@test.com
```
Une fois la clé public vérifié, il faudra la signer, cela n’est pas obligatoire mais fortement conseillé car, si vous voulez communiquer avec la personne, il vous sera demandé de confirmer l’identité de la personne entre chaque échange. Pour éviter ce problème il faut utiliser le paramètre `—sign-key`.

```bash
gpg --sign-key test@test.com
```
Partager sa clé publique
------------------------

Pour exporter sa clé publique, il faut la générer depuis le magasin gpg locale, il faudra utiliser le paramètre `—export` suivi de l’adresse mail, ainsi que l’`—output` suivi du nom du fichier. Également pour que la clé soit « lisible » il faudra ajouté le paramètre `—armor` pour générer le fichier au format ASCII au lieu du format binaire.

```javascript
gpg --output ~/jhondoe.key --armor --export test@test.com
```
Même principe que pour l’import il est possible d’exporter sa clé publique sur un serveur.

```bash
gpg --send-keys --keyserver pgp.mit.edu 177361CED1EF21C10A6BB4F6D9940C1EEBA9D972
```
Chiffrer ses données
--------------------

Après avoir effectué les prè-requis cité plus haut, nous pouvons commencer à chiffrer nos données soit pour nous même en utilisant notre clé publique ou alors à destination d’une personne en utilisant sa clé publique qui à déjà été importé. Quatre paramètres sont nécessaires, `—encrypt` pour chiffrer les données, `—sign` pour le signer avec sa propre cle ou celle à qui on veut l’envoyer , `—armor` pour le format de fichier et enfin `—recipient` c’est pour ajouter le fichier que vous voulez chiffrer.

```bash
gpg --encrypt --sign --armor -r test@test.com fichier.txt
```
Déchiffrer ses données
----------------------

Pour le déchiffrement des données c’est sensiblement le même principe que le chiffrement, on utilise le paramètre `—decrypt`

```bash
gpg --decrypt nomDuFichier.asc
```
