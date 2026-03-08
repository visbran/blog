---
title: Installation ArchLinux 2021 UEFI + chiffrement partion /home
description: "Cet article est un aide-memoire pour l'installation d'Archlinux\_sur un\_pc\_portable\_MSI\_Léopard GL65 de 2019."
publishDate: '2021-04-22T18:29:25+02:00'
tags:
  - linux
  - sécurité
language: fr
draft: false
comment: true
heroImage:
  src: ./Installation-ArchLinux-2021-UEFI-chiffrement-partion-_home.png
  alt: Installation ArchLinux 2021 UEFI + chiffrement partion /home
---
Avant-propos
------------

Cet article est un aide-memoire pour l’installation d’***Archlinux*** sur un ***pc*** portable ***MSI*** Léopard GL65 de fin 2019, il est composé de :

- 16 GO de ram
- Processeur i7 de 10eme génération
- 500 go de stockage en ***nvme-*** Une GTX1660 TI mobile 6go

Concernant le système, il sera chiffré via LUKS. Le NVMe utilisera le système de partitionnement **GPT** et se composera de trois partitions : **/boot/efi pour l’EFI**, **/swap pour le swap et /home pour le système** et le stockage. Il est aussi possible de séparer le répertoire racine (/root) et le répertoire /home si besoin.

### Secure Boot

Bien penser à désactiver le secure boot dans l’UEFI sinon vous n’allez pas pouvoir écrire la partition de boot.

Pour installer [ArchLinux](http://archlinux.org) j’utilise une clé bootable avec [Ventoy](https://beta.visbran.fr/creation-cle-bootable-ventoy/) et la version installée actuellement est la 03.2021

1. Configuration de l’installation de base
------------------------------------------

Par défaut le clavier de l’os est en anglais, il faut donc changer la configuration de base :

```bash
# Changement du clavier de en vers fr
loadkeys fr-latin1

# Permet d'afficher la bonne configuration de clavier
localectl list-keymaps | grep FR
```
Si vous êtes connecté en filaire sur votre machine, vous devriez normalement avoir accès à Internet. Si ce n’est pas le cas, vous devrez configurer votre connexion wifi via l’outil iwctl.  
Pour tester la connexion un simple ping suffit :

```bash
ping google.fr
```
Les commandes pour la connection wifi :

```bash
iwctl 
# démarrage de l'utilitaire
[iwd]# device list
# liste le nom de l'appareil wifi 
[iwd]# station device scan
# scanner le reseau wifi disponible via la carte wifi
[iwd]# station device get-networks
# lister les réseaux disponibles
[iwd]# station device connect SSID
Se connecter au réseau WIFI
# Paramètre pour utiliser le mot de passe
iwctl --passphrase passphrase station device connect SSID

```
Changer la police par défaut :

```bash
#Police présente dans l'environement de base 
setfont cybercafe -u cybercafe
# Cette police d'écriture est plus grande et donc plus lisible sur les grands écrans
setfont ter-132n 

```
### 1.2 Selection des mirroirs français

Pour choisir les miroirs lors de l’installation de l’utilitaire pacman, il faut sélectionner les dépôts les plus proches de chez vous pour un meilleur fonctionnement. Deux solutions sont possibles : soit en utilisant l’éditeur vim pour supprimer manuellement les miroirs que vous ne souhaitez pas utiliser.

La deuxième méthode consiste à utiliser l’outil reflector, qui va effectuer automatiquement l’étape de sélection des miroirs.

```bash

vim /etc/pacman.d/mirror
# Decommenté le ou les mirroirs selectionné 
# Supprimer les mirroir non necessaires
Reflector --country France --age 12 --sort rate --save /etc/pacman.d/mirrorlist

```
Une fois cette étape faite, vous devez actualiser les mirroirs dans pacman

```bash
pacman -Syy

```
### 1.3 Mise à jour du système de temps

Cette étape est importante car elle permet de synchroniser l’heure de votre PC avec le serveur NTP, ainsi, en principe, votre PC sera toujours à l’heure.

```bash
# Activation de la résolution ntp
timedatectl set-ntp true 
# Définition de la timezone sur Europe
timedatectl set-timezone Europe/Paris
#Vérification de la mise en place
timedatectl status

```
### 1.4 Création des partitions en utilisant gdisk

Afin de connaître le type de disque à utiliser et son chemin pour pouvoir créer, formater et monter les partitions correctement, il est possible d’utiliser la commande **lsblk**.

Ci-dessous, vous pouvez voir à quoi ressemble le résultat de la commande. Elle a été saisie sur une distribution Fedora 33 utilisant le système de fichiers Btrfs (création de snapshot à chaque mise à jour). On peut ainsi voir le montage des systèmes de fichiers.

![](https://beta.visbran.fr/wp-content/uploads/2024/04/lsblk-1024x486.jpg)J’utilise l’outil gdisk pour configurer les disques en GPT, où trois partitions seront créées.

### 1.5 Création d’une partition EFI

```bash
#le nom du disque peut être différents sdb, nvme01 pour les ssd nvme
gdisk /dev/sda
# Pour la création d'une nouvelle partition 
	n
# Taper entrer pour l'utiliser en tant que premiere partition 
		
# Faite de meme pour le premier secteur 
# Pour la partiton je met personnelement 300MB
	+300M
# Pour le type de partition il faut saisir le code suivant 
	ef00
# Saisir w pour écrire sur le disque# Pour la création d'une nouvelle partition 
	n
# Taper entrer pour l'utiliser en tant que premiere partition 
		
# Faite de meme pour le premier secteur 
# Pour la partiton je met personnelement 300MB
	+300M
# Pour le type de partition il faut saisir le code suivant 
	efi00
# Saisir w pour écrire sur le disque

```
### 1.6 Création de la partition swap

```bash
gdisk /dev/sda
# Pour la création d'une nouvelle partition 
	n
# Taper entrer pour l'utiliser en tant que deuxième partition 
		
# Faite de meme pour le deuxième secteur 
# Pour la partiton je met personnelement 16GO
	+16GO
# Pour le type de partition il faut saisir le code suivant 
	8200
# Saisir w pour écrire sur le disque# Pour la création d'une nouvelle partition 

```
### 1.7 Création de la partition /home

```bash
gdisk /dev/sda
# Pour la création d'une nouvelle partition 
	n
# Taper entrer pour l'utiliser en tant que troisieme partitions
		
# Faite de meme pour le troisieme secteur 
# Pour la partiton laisser le choix par défaut
# Pour le type de partition il faut saisir le code suivant 
	8300
# Saisir w pour écrire sur le disque# Pour la création d'une nouvelle partition 

```
2. Formatage des partitions
---------------------------

```bash
# Formatage de la partition de boot en efi 
mkfs.fat -F32 /dev/sda1
# Formatage de la partition swap
mkswap /dev/sda2
swapon /dev/sda2

```
### Attention

Ne pas formater la partition système il va falloir utiliser luks pour créer la partition chiffrée

3. Chiffrement de la partition avec l’utilitaire LUKS
-----------------------------------------------------

Pour chiffrer la partition il faut taper la commande suivante :

```bash
cryptsetup -y -v luksFormat /dev/sda3
```
Une étape de confirmation sera demandée, il faudra écrire « YES » puis appuyer sur « Entrée ». Ensuite, il faut saisir le mot de passe pour le chiffrement des données.

Suite à cela, il faut ouvrir la partition :

```bash
cryptsetup open /dev/sda3 archcrypt 
# archcrypt correspond au nom de la partition utilisé

```

```bash
# Formatage de la partition 
mkfs.ext4 /dev/mapper/archcrypt

```
4. Montage des partitions
-------------------------

```bash
# Montage de la partition système 
mount /dev/mapper/archcrypto /mnt
# Création du dossier de boot 
mkdir /mnt/boot
# Montage de la partition efi
mount /dev/sda1 /mnt/boot

```
5. Installation des paquets de base
-----------------------------------

Lorsque toutes les partitions sont montées, il est possible d’installer les paquets de base

```bash
pacstrap /mnt base linux linux-firmware vim intel-ucode 

```
### 5.1 Génération de file système tab

```bash
genfstab -U /mnt >> /mnt/etc/fstab
arch-chroot /mnt
ln -sf /usr/share/zoneinfo/Europe/Paris /etc/localtime
hwclock --systohc

```
### 5.2 Génération du fichier de langue

```bash
vim /etc/locale.gen
# Rechercher la langue voulu dans le fichier et decommenter langue 
# génération du fichier 
locale-gen
# vim /etc/locale.conf
LANG=fr_FR.UTF-8
vim /etc/vconsole.conf
KEYMAP=fr-latin1 or fr-latin9

```
### 5.3 Création des fichiers pour le nom de la machine

```bash
vim /etc/hostname
visbran  
vim /etc/hosts
127.0.0.1       localhost
::1             localhost
127.0.1.1       visbran.localdomain visbran

```
### 5.4 Installation des paquets supplémentaires

```javascript
pacman -S grub efibootmgr networkmanager network-manager-applet dialog 
wpa_supplicant mtools dosfstools base-devel linux-headers bluez bluez-utils cups xdg-utils
xdg-user-dirs alsa-utils pipewire-pulse git reflector bash-completion
mons

```
### 5.5 Modification du fichier `/etc/mkinitcpio.conf`

```bash
vim /etc/mkinitcpio.conf
#Ajouter dans les hooks après 
```
Ensuite il faut recompiler le fichier

```bash
mkinitcpio.conf -p linux

```
6. Installation du grub pour EFI
--------------------------------

```bash
grub-intall --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
# génération du fichier de configuration 
grub-mkconfig -o /boot/grub/grub.cfg
# Retrouver les partitions via les uuid
blkid
blkid > uuid
vim uuid et copier la ligne qui correspond à la partition chiffré
vim /etc/default/grub
Ajouter dans le paramètre
GRUB_CMDLINE_LINUX=
```
### 6.1 Démarrage automatique des services de base

```bash
systemctl enable NetworkManager
systemctl enable cups
systemctl enable bluetooth

```
### 6.2 Création d’un mot de passe pour l’utilisateur root

```bash
passwd

```
### 6.3 Ajout d’un utilisateur et attribution des droits

```bash
useradd -m visbran 
passwd visbran
usermod -aG wheel,audio,video,optical,storage, visbran

```
### 6.4 Installation de sudo et attribution des droits pour l’utilisateur

```bash
EDITOR=vim visudo
decommenter le wheel groupe pour les droits

```
Le système de base est installé, il faut maintenant quitter l’environnement chroot en tapant « exit », puis démonter le système avec umount.

```bash
umount -l /mnt

```
L’installation de base est maintenant terminée. Il est possible de redémarrer pour tester le bon fonctionnement du PC.

### 6.5 Configuration de la partition pour système de fichier MBR

```bash
pacman -S grub
grub-install /dev/sda
grub-mkconfig -o /boot/grub/grub.cfg
```
7. A faire après l’installation de base
---------------------------------------

### 7.1 Connection au réseau wifi et mise à jour des dépots

```bash
sudo nmtui
# lance une interface semi-graphique pour configurer le réseau filaire ou wifi
```

```bash
timedatectl set-ntp true
sudo hwclock —systohc
# active le service ntp pour garder l'heure synchronisé
```

```bash
sudo reflector -c France -a 6 —sort rate —save /etc/pacman.d/mirrorlist
# On parametre les paquets via l'outil reflector, on selectionne le pays France.
# On filtre par meilleur classement et on sauvegarde le tout directement dans le fichier mirrorlist.
```

```bash
sudo pacman -Syy 
# on met à jour 
```

```bash
sudo systemctl enable —now reflector.timer
```

```bash
sudo systemctl enable —now fstrim.timer
# Activation du fstrim pour les ssd et nvme uniquement !
```
### 7.2 Installation de l’environnement de bureau et des pilotes

```bash
Sudo pacman -S i3 nitrogen picom dmenu xorg cups lightdm lightdm-gtk-greeter lightdm-gtk-greeter-settings mesa multilib vulkan-intel firefox-i18n-fr ttf-dejavu ttf-liberation noto-fonts lxappearance thunar thunar-volman thunar-archive-plugin materia-gtk-theme papirus-icon-theme xfce4-terminal archlinux-wallpaper nvidia-settings xfce4-notifyd libnotify notification-daemon acpid cbatticon discord spotify okular xarchiver gvfs thunar-media-tags-plugin tumbler gstreamer epiphany playerctl termite alacritty kitty onlyoffice autorandr tlp

# tlp pour ordinateur portable
```
### 7.3 Package pour le pilote graphique libre ou propriétaire nvidia

```bash
xf86-video-nouveau
```

```bash
nvidia nvidia-utils nvidia-prime
```
### 7.4 Démarrage automatique du gestionnaire de connexion

```bash
sudo systemctl enable lightdm
```

```bash
sudo systelctl enable acpid.service
```

```bash
reboot
```
### 7.5 Configuration du clavier en français pour la session Xorg

```bash
Localectl set-x11-keymap fr
```
### 7.6 Configuration du clavier en français au démarrage de i3

```bash
vim .config/i3/config
aller à la fin du fichier 
ajouter les éléments suivants 
## Clavier 
exec setxkbmap fr &
## Nitrogen
exec nitrogen --restore 
## Picom 
exec picom -f 

```
### 7.7 Activation du pavé numérique au démarrage

Il est possible d’activer le pavé numérique lors du démarrage de la machine, juste après le boot du noyau dans l’initramfs. Cette méthode est utile pour ceux qui ont chiffré leur disque et qui veulent avoir le pavé activé lors de la saisie du déchiffrement.

Installer le paquet mkinitcpio-numlock depuis l’AUR et ajouter le paramètre numlock dans le fichier de configuration. Attention, il doit être placé avant le encrypt dans /etc/mkinitcpio.conf :

```bash

HOOKS=(base udev autodetect keyboard keymap consolefont numlock modconf block encrypt lvm2 filesystems fsck)

```
8. Autres
---------

### Installation de virtual manager

Pour installer virtual manager sur archlinux il faut installer les pacquets suivants :

```bash
sudo pacman -S qemu virt-manager virt-viewer dnsmasq vde2 bridge-utils openbsd-netcat
sudo pacman -S ebtables iptables 
yay -S libguestfs

```
Attribution des droit de lancement de qemu avec l’utilisateur standard

```bash
gpasswd -a UTILISATEUR kvm

```
Démarrage des services de virtualisation

```bash
sudo systemctl enable libvirtd.service
sudo systemctl start libvirtd.service

```
### Désactiver la mise en veille lors de la fermeture de l’écran

```bash
sudo systemctl mask sleep.target suspend.target

```
### Installation d’outils complémentaires

```bash
sudo pacman -S laguagetool powerfonts-fonts
```

```bash
sudo pacman -Rns $(pacman -Qtdq)
# Supprimer les parquets ophelins
```
Sources
-------

<https://computingforgeeks.com/complete-installation-of-kvmqemu-and-virt-manager-on-arch-linux-and-manjaro>

[dm-crypt avec LUKS](https://wiki.archlinux.fr/LUKS)

<https://wiki.archlinux.fr/Qemu>

<https://github.com/Litarvan/lightdm-webkit-theme-litarvan>

[Nerd Fonts – Iconic font aggregator, glyphs/icons collection, &amp; fonts patcher](https://www.nerdfonts.com/font-downloads)

[altdesktop/playerctl](https://github.com/altdesktop/playerctl)

[Improve fonts archlinux](https://gist.github.com/glats/ca71bbddc85f6a756e1e)
