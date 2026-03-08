---
title: "Mise à jour de Nginx : Comment adresser la dépréciation de la directive «\_listen http2\_»"
description: >-
  Lors de la dernière mise à jour de Nginx à la version 1.25.1, une modification majeure a été apportée au module HTTP.
publishDate: '2024-06-21T11:20:04+02:00'
tags:
  - administration système
  - linux
  - nginx
language: fr
draft: false
comment: true
heroImage:
  src: ./11035538.jpg
  alt: "Mise à jour de Nginx : Comment adresser la dépréciation de la directive «\_listen http2\_»"
---
Lors de la dernière mise à jour de Nginx à la version 1.25.1, une modification majeure a été apportée au module HTTP. Un changement notable est la dépréciation de la directive « listen http2 ».

Ainsi, il est recommandé d’utiliser la nouvelle directive « http2 ». Si vous utilisez HTTP2, cette dépréciation vous affecte certainement.

Lorsque votre configuration Nginx inclut toujours l’ancienne directive, vous recevez un message d’avertissement comme celui-ci :

***nginx:\[warn\] the “listen … http2” directive is deprecated, use the “http2” directive instead in /etc/nginx/sites-available/yourconfigurationfile.***

Ce message d’avertissement en lui-même ne perturbera pas votre site Web. Il vous indique simplement de vous préparer pour l’avenir.

Étant donné que cette directive est maintenant obsolète, une future mise à jour de Nginx pourrait supprimer totalement la directive « listen », ce qui pourrait potentiellement briser votre site.

Comment adapter votre configuration à la nouvelle directive ?
-------------------------------------------------------------

Pour éviter tout problème à l’avenir, vous devez vous adapter à la nouvelle directive. Voici un guide simple montrant les changements avant et après pour une référence facile :

Avant :

```bash
listen 443 ssl http2;
listen [::]:443 ssl http2;
```
Après :

```bash
listen 443 ssl;
listen [::]:443 ssl;

http2 on;

```
C’est tout ce qu’il y a à faire ! Vous devez simplement déclarer « http2 » et l’activer.

F.A.Q
-----

**Qu’est-ce qui a changé avec la mise à jour de Nginx à la version 1.25.1 ?**
La mise à jour a entraîné la dépréciation de la directive « listen http2 ». Au lieu de cela, il est recommandé d’utiliser la nouvelle directive « http2 ».

 **Que signifie le message d’avertissement concernant la dépréciation de la directive « listen http2 » ?**
 Ce message indique simplement que la directive « listen http2 » est désormais obsolète et qu’une future mise à jour de Nginx pourrait la supprimer complètement.

 **Comment adapter ma configuration Nginx à la nouvelle directive ?**
 Il suffit de remplacer l’ancienne directive par la nouvelle. Vous devez simplement déclarer « http2 » et l’activer.
