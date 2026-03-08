---
title: Tout ce que vous devez savoir sur la configuration SSH
description: >-
  La Configuration du Protocole SSH est un processus essentiel pour sécuriser la
  connexion à distance à vos serveurs.
publishDate: '2021-04-24T17:08:05+02:00'
tags:
  - administration système
  - linux
  - ssh
language: fr
draft: false
comment: true
heroImage:
  src: ./Tout-ce-que-vous-devez-savoir-sur-la-configuration-SSH.png
  alt: Tout ce que vous devez savoir sur la configuration SSH
---
Introduction
------------

La Configuration du Protocole SSH est un processus essentiel pour sécuriser la connexion à distance à vos serveurs. SSH, qui signifie Secure Shell, est un protocole de communication sécurisé qui permet aux utilisateurs de se connecter à des serveurs distants de manière sécurisée. Il utilise une connexion cryptée pour protéger les informations sensibles transmises entre l’utilisateur et le serveur.

Dans cet article, nous allons vous guider à travers les étapes de configuration du protocole SSH. Nous vous expliquerons les avantages de l’utilisation de SSH, les étapes pour configurer SSH, les questions fréquemment posées et bien plus encore.

Avantages de l’utilisation de SSH
---------------------------------

Il y a plusieurs avantages à l’utilisation de SSH pour votre connexion à distance à vos serveurs. Voici quelques-uns des avantages les plus importants :

- Sécurité : SSH utilise une connexion cryptée pour protéger les informations transmises entre l’utilisateur et le serveur. Cela rend l’utilisation de SSH beaucoup plus sécurisée que les autres protocoles de connexion à distance, tels que Telnet ou FTP.
- Authentification : SSH utilise une méthode d’authentification forte pour s’assurer que seules les personnes autorisées peuvent accéder aux serveurs. Cette méthode d’authentification utilise généralement des clés publiques et privées pour vérifier l’identité de l’utilisateur.
- Contrôle d’accès : SSH vous permet de contrôler l’accès à votre serveur de manière granulaire. Vous pouvez spécifier les utilisateurs ou les groupes d’utilisateurs qui ont le droit d’accéder à certaines parties du serveur.

Étapes pour Configurer le Protocole SSH
---------------------------------------

Maintenant que nous avons vu les avantages de l’utilisation de SSH, voici les étapes à suivre pour configurer le protocole SSH sur votre serveur :

### Étape 1 : Vérifiez si SSH est déjà installé sur votre serveur

La première étape consiste à vérifier si SSH est déjà installé sur votre serveur. Pour cela, vous pouvez utiliser la commande suivante :

```bash
ssh -V

```
Cette commande affichera la version de SSH installée sur votre serveur. Si SSH n’est pas installé, vous devrez l’installer avant de pouvoir le configurer.

### Étape 2 : Créez des clés publiques et privées

La prochaine étape consiste à créer des clés publiques et privées pour l’authentification de l’utilisateur. Les clés publiques et privées sont utilisées pour vérifier l’identité de l’utilisateur qui tente de se connecter au serveur. Voici comment créer des clés publiques et privées :

1. Ouvrez votre terminal et tapez la commande suivante :

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_nom_de_la_clé -C 
```
- l’option -t défini le type d’algorithme utilisé
- l’option -f spécifie un nom de fichier personnalise ainsi que le chemin de destination de la clef publique et privée.
- l’option -C permet d’ajouter un commentaire sur la paire de clé générer ainsi cela permet de mieux se repérer dans la gestion des clés.

1. Appuyez sur « Entrée » pour accepter le fichier de clé par défaut et entrez un mot de passe pour votre clé si vous le souhaitez.
2. Attendez que la clé soit générée. Une fois la clé générée, vous verrez une sortie similaire à celle-ci :

```bash
Generating public/private rsa key pair.
Enter file in which to save the key (/home/your_user_name/.ssh/id_rsa):

```
1. Appuyez sur « Entrée » pour accepter le fichier par défaut ou entrez un nom de fichier personnalisé si vous le souhaitez.
2. Ensuite, vous devrez copier votre clé publique sur votre serveur en utilisant la commande suivante :

```bash
ssh-copy-id user@server_ip_address

```
Remplacez « user » par votre nom d’utilisateur et « server\_ip\_address » par l’adresse IP de votre serveur.

### Étape 3 : Configurez le fichier de configuration SSH

La prochaine étape consiste à configurer le fichier de configuration SSH. Ce fichier est situé à /etc/ssh/sshd\_config. Voici les étapes à suivre :

1. Ouvrez le fichier de configuration avec votre éditeur de texte préféré :

```bash
sudo vim /etc/ssh/sshd_config

```
1. Recherchez la ligne « PasswordAuthentication » et assurez-vous qu’elle est définie sur « no ». Cela désactive l’authentification par mot de passe et force l’utilisation des clés publiques et privées que vous venez de générer.
2. Vous pouvez également configurer d’autres options de sécurité dans ce fichier, telles que la limitation des adresses IP autorisées à se connecter à votre serveur.
3. Une fois que vous avez terminé de modifier le fichier de configuration, enregistrez-le et quittez l’éditeur de texte.
4. Enfin, redémarrez le service SSH pour que les modifications prennent effet en utilisant la commande suivante :

```bash
sudo service ssh restart

```
### Étape 4 : Testez votre connexion SSH

La dernière étape consiste à tester votre connexion SSH. Pour cela, ouvrez votre terminal et tapez la commande suivante :

```bash
ssh user@server_ip_address

```
Remplacez « user » par votre nom d’utilisateur et « server\_ip\_address » par l’adresse IP de votre serveur. Si tout fonctionne correctement, vous devriez être en mesure de vous connecter à votre serveur via SSH.

Création d’un fichier known\_hosts pour chaque clés
---------------------------------------------------

la création d’un known\_host pour chaque clé permet séparer les logs en fonction du serveur sur lequel on se connecte

Pour effectuer la création rien de plus simple, il faut créer un fichier dans le dossier caché .ssh

```bash
touch ~/.ssh/known_hosts_id_de_la_clef

```
Modification du fichier sshd.config sur le serveur
--------------------------------------------------

### Modification du port SSH personnalisé

Le port SSH par défaut est le port 22, mais vous pouvez le changer pour un port personnalisé pour éviter les attaques automatisées. Pour cela, vous devez modifier la ligne « Port » dans le fichier sshd\_config. Par exemple, si vous voulez utiliser le port 2222, modifiez la ligne comme suit :

```bash
Port 2222

```
N’oubliez pas de redémarrer le service SSH après avoir effectué des modifications au fichier de configuration.

### Connexions autorisées

Vous pouvez limiter les adresses IP autorisées à se connecter à votre serveur en utilisant la directive « AllowUsers » ou « AllowGroups ». Vous pouvez spécifier des noms d’utilisateurs ou des noms de groupes pour restreindre l’accès. Par exemple, si vous voulez autoriser uniquement l’utilisateur « johndoe » à se connecter à votre serveur, ajoutez cette ligne au fichier sshd\_config :

```bash
AllowUsers johndoe

```
### Limitation de la durée de connexion

Vous pouvez limiter la durée de la connexion SSH en utilisant la directive « ClientAliveInterval ». Cette option définit le temps en secondes entre les messages de requête du client. Si aucun message n’est reçu après cette durée, le serveur déconnecte automatiquement le client. Par exemple, si vous voulez limiter la durée de la connexion à 5 minutes, ajoutez cette ligne au fichier sshd\_config :

```bash
ClientAliveInterval 600
ClientAliveCountMax 0

```
### Utilisation de la vérification en deux étapes

Vous pouvez renforcer la sécurité de votre connexion SSH en utilisant la vérification en deux étapes. Cette option nécessite à l’utilisateur de fournir un code de sécurité unique en plus de son mot de passe pour se connecter au serveur. Vous pouvez utiliser des applications telles que Google Authenticator pour générer ces codes. Pour activer la vérification en deux étapes, vous devez ajouter ces lignes au fichier sshd\_config :

```bash
AuthenticationMethods publickey,keyboard-interactive
ChallengeResponseAuthentication yes
UsePAM yes

```
### Désactiver la connexion en tant que **root**

Il suffit de décrémenter le **“PermitRootLogin no”**

```bash
PermitRootLogin no

```
Création d’un fichier de config
-------------------------------

La création d’un fichier de configuration permet de manager plusieurs clés sur le poste utilisateur

Voici un exemple de fichier config, il doit se situer dans le dossier cacher .ssh/

```bash
# Personal github account
Host github.com
   HostName github.com
   User xxxx@gmail.com
   AddKeysToAgent yes
   IdentityFile ~/.ssh/id_rsa
   UserKnownHostsFile ~/.ssh/known_hosts_id_rsa_github
   IdentitiesOnly yes

# Personal gitlab account
Host gitlab.com
   HostName gitlab.com
   User wwwww
   AddKeysToAgent yes
   IdentityFile ~/.ssh/id_rsa
   UserKnownHostsFile ~/.ssh/known_hosts_id_rsa_gitlab
   IdentitiesOnly yes

```
- **Host** est un outil de correspondance de modèles qui est utilisé pour différencier ces ensembles de configurations. Gardez-le identique à HostName afin qu’il corresponde aux hôtes dans les connexions correctement sans spécification supplémentaire.

L’URL sur la ligne **HostName** est l’URL de base où se trouve le dépôt. Par exemple, si vous avez un compte personnel sur GitHub avec des projets personnels, l’URL sera [github.com](http://github.com).

- **User** pour les systèmes basés sur Git sera git. La valeur de User sera différente si vous vous connectez à autre chose (par exemple, ec2-user pour se connecter à une instance Amazon AWS EC2).
- **IdentityFile** demande l’emplacement de la clé d’identité que nous avons créée. Tapez le chemin respectif ici.
- **AddKeysToAgent** permet d’ajouter à ssh-agent une clé privée utilisée lors de l’authentification si elle est en cours d’exécution.
- **UseKeychain** (uniquement pour macOS) permet à l’ordinateur de se souvenir du mot de passe à chaque redémarrage.
- **UserKnownHostsFile** spécifie un emplacement exact pour stocker tous les hôtes auxquels vous vous connectez lorsque vous utilisez ce profil. Fournissez les chemins respectifs ici et choisissez un nom de fichier hosts connus unique (voir étape 2 ci-dessus) afin que le dépannage et la maintenance des clés soient plus faciles avec le temps.
- **IdentitiesOnly** spécifie que seules les clés fournies doivent être utilisées pour se connecter à un hôte, même si un autre service comme ssh-agent offre une clé à utiliser.

### Ajout de la clé pour le ssh-agent

le service ssh-agent permet de garder en mémoire la paraphrase

```bash
eval 
```
ajout de la clé privé dans l’agent

```bash
ssh-add ~/.ssh/id_key

```
### Ajout de la clé public sur les services

une fois la paire de clé généré, il suffit d’ajouter la clé public sur le service auquel on souhaite se connecter, plusieurs méthodes sont disponibles

- avec xclip

```bash
xclip -sel < ~/.ssh/id_key.pub

```
- avec cat

```bash
cat ~/.ssh/id_key.pub

```

```bash
# Copier sa clé publique sur un équipement
ssh-copy-id -i .ssh/id_rsa.pub nomduserveur
ssh-copy-id -i .ssh/id_ed25519.pub nomduserveur

ssh-copy-id -i .ssh./config.pub -p 22 user@ip

```
Conclusion
----------

La configuration du protocole SSH est une étape importante pour renforcer la sécurité de votre serveur. En suivant les étapes décrites dans cet article, vous pouvez configurer votre serveur pour n’autoriser que les connexions SSH chiffrées avec des clés publiques et privées, ce qui rend pratiquement impossible pour les pirates de se connecter à votre serveur en utilisant des méthodes d’authentification faibles telles que les mots de passe. N’oubliez pas de prendre des mesures supplémentaires pour renforcer la sécurité de votre serveur en utilisant les options de sécurité disponibles dans le fichier de configuration sshd\_config. Bonne configuration !

F.A.Q
-----

Non, vous devez avoir les droits d’accès au serveur pour pouvoir vous connecter via SSH.

Oui, vous pouvez utiliser une adresse IP dynamique ou un nom de domaine pour vous connecter à un serveur distant via SSH.

Vous pouvez exécuter la commande suivante pour vérifier si le service SSH est en cours d’exécution :   
sudo systemctl status sshd
