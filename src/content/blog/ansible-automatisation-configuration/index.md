---
title: "Ansible : automatiser la configuration de ses serveurs Linux"
description: Ansible automatise la configuration et le déploiement sur plusieurs serveurs sans agent. Inventaires, playbooks et modules essentiels pour les admins sys.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
  - automatisation
  - devops
language: fr
draft: false
comment: true
---

Configurer manuellement un serveur, c'est faisable. En configurer dix de façon identique et reproductible, c'est une autre histoire. **Ansible** est l'outil d'automatisation de référence pour la configuration, le déploiement et la gestion de parc de serveurs. Sans agent à installer sur les machines cibles, il ne nécessite qu'un accès SSH.

## Qu'est-ce qu'Ansible ?

Ansible est un outil d'automatisation **agentless** (sans agent) : il se connecte aux serveurs via SSH et exécute des modules Python temporaires. Aucun démon ne tourne sur les machines gérées.

**Ce qu'Ansible permet de faire :**
- Installer des paquets sur plusieurs serveurs simultanément
- Déployer des fichiers de configuration
- Gérer les services systemd
- Créer des utilisateurs, gérer les droits
- Déployer des applications
- Assurer un état cohérent sur tout un parc

**Concepts clés :**
- **Inventaire** : liste des machines à gérer
- **Playbook** : fichier YAML décrivant les tâches à exécuter
- **Task** : une action à réaliser (installer un paquet, copier un fichier...)
- **Module** : brique fonctionnelle (apt, copy, service, user...)
- **Role** : ensemble de tâches réutilisables et organisées

## Installation

Ansible s'installe uniquement sur la **machine de contrôle** (votre poste ou un serveur dédié).

```bash
# Debian / Ubuntu
sudo apt update && sudo apt install ansible -y

# RHEL / AlmaLinux
sudo dnf install epel-release -y && sudo dnf install ansible -y

# pip (dernière version)
pip install ansible

# Vérifier
ansible --version
```

## L'inventaire

L'inventaire liste les machines à gérer. Format INI simple :

```ini
# inventory.ini

[webservers]
web1.domaine.fr
web2.domaine.fr ansible_port=2222

[databases]
db1.domaine.fr

[homelab]
192.168.1.10 ansible_user=admin
192.168.1.11 ansible_user=admin

# Variables pour un groupe
[webservers:vars]
ansible_user=deployer
ansible_ssh_private_key_file=~/.ssh/id_deploy
```

Format YAML (plus expressif) :

```yaml
# inventory.yml
all:
  children:
    webservers:
      hosts:
        web1.domaine.fr:
        web2.domaine.fr:
          ansible_port: 2222
    databases:
      hosts:
        db1.domaine.fr:
      vars:
        ansible_user: dbadmin
```

### Tester la connectivité

```bash
# Ping de tous les hôtes
ansible -i inventory.ini all -m ping

# Ping d'un groupe
ansible -i inventory.ini webservers -m ping
```

Sortie attendue :
```json
web1.domaine.fr | SUCCESS => {"ping": "pong"}
web2.domaine.fr | SUCCESS => {"ping": "pong"}
```

## Premier playbook

Un playbook est un fichier YAML décrivant les tâches à exécuter sur les hôtes cibles.

```yaml
# setup-webserver.yml

---
- name: Configurer un serveur web
  hosts: webservers
  become: true  # équivalent sudo

  tasks:
    - name: Mettre à jour les paquets
      ansible.builtin.apt:
        update_cache: true
        upgrade: dist

    - name: Installer Nginx
      ansible.builtin.apt:
        name: nginx
        state: present

    - name: S'assurer que Nginx est démarré
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true

    - name: Déployer la configuration Nginx
      ansible.builtin.copy:
        src: files/nginx.conf
        dest: /etc/nginx/nginx.conf
        owner: root
        group: root
        mode: '0644'
      notify: Recharger Nginx

  handlers:
    - name: Recharger Nginx
      ansible.builtin.service:
        name: nginx
        state: reloaded
```

Exécuter le playbook :

```bash
ansible-playbook -i inventory.ini setup-webserver.yml
```

### Options utiles

```bash
# Dry-run (simuler sans appliquer)
ansible-playbook -i inventory.ini playbook.yml --check

# Afficher les changements détaillés
ansible-playbook -i inventory.ini playbook.yml --diff

# Limiter à un hôte précis
ansible-playbook -i inventory.ini playbook.yml --limit web1.domaine.fr

# Demander le mot de passe sudo
ansible-playbook -i inventory.ini playbook.yml --ask-become-pass
```

## Les modules essentiels

### Gestion des paquets

```yaml
# apt (Debian/Ubuntu)
- name: Installer des paquets
  ansible.builtin.apt:
    name:
      - nginx
      - curl
      - htop
    state: present
    update_cache: true

# dnf (RHEL/AlmaLinux)
- name: Installer via dnf
  ansible.builtin.dnf:
    name: nginx
    state: present
```

### Gestion des fichiers

```yaml
# Copier un fichier
- name: Copier la config
  ansible.builtin.copy:
    src: files/monapp.conf
    dest: /etc/monapp/monapp.conf
    owner: root
    mode: '0644'

# Créer un répertoire
- name: Créer le répertoire de logs
  ansible.builtin.file:
    path: /var/log/monapp
    state: directory
    owner: www-data
    mode: '0755'

# Déployer depuis un template Jinja2
- name: Déployer la config depuis un template
  ansible.builtin.template:
    src: templates/config.j2
    dest: /etc/monapp/config.conf
```

### Gestion des services

```yaml
- name: Gérer un service
  ansible.builtin.service:
    name: nginx
    state: started    # started | stopped | restarted | reloaded
    enabled: true     # démarrage automatique
```

### Exécuter des commandes

```yaml
# Commande simple (préférer les modules dédiés quand disponibles)
- name: Vider le cache APT
  ansible.builtin.command: apt-get clean

# Shell (pour les redirections, pipes...)
- name: Vérifier l'espace disque
  ansible.builtin.shell: df -h / | awk 'NR==2{print $5}'
  register: disk_usage

- name: Afficher l'usage disque
  ansible.builtin.debug:
    msg: "Disque utilisé : {{ disk_usage.stdout }}"
```

### Gestion des utilisateurs

```yaml
- name: Créer un utilisateur
  ansible.builtin.user:
    name: deployer
    groups: sudo
    shell: /bin/bash
    create_home: true

- name: Ajouter une clé SSH autorisée
  ansible.posix.authorized_key:
    user: deployer
    key: "{{ lookup('file', '~/.ssh/id_ed25519.pub') }}"
```

## Variables et templates

### Définir des variables

```yaml
# Dans le playbook
vars:
  app_port: 8080
  app_name: monapp
  db_host: localhost

# Utiliser une variable
- name: Déployer la config
  ansible.builtin.template:
    src: templates/config.j2
    dest: /etc/{{ app_name }}/config.conf
```

### Template Jinja2

```jinja2
{# templates/config.j2 #}
[server]
host = 0.0.0.0
port = {{ app_port }}
name = {{ app_name }}

[database]
host = {{ db_host }}
name = {{ app_name }}_db
```

### Fichiers de variables

```yaml
# group_vars/webservers.yml — variables pour le groupe webservers
nginx_worker_processes: 4
nginx_worker_connections: 1024

# host_vars/web1.domaine.fr.yml — variables spécifiques à un hôte
server_ip: 203.0.113.10
```

## Conditions et boucles

### Conditions

```yaml
- name: Installer Apache uniquement sur Ubuntu
  ansible.builtin.apt:
    name: apache2
    state: present
  when: ansible_distribution == "Ubuntu"

- name: Tâche selon la version
  ansible.builtin.debug:
    msg: "Debian 12 détecté"
  when: ansible_distribution == "Debian" and ansible_distribution_major_version == "12"
```

### Boucles

```yaml
- name: Créer plusieurs utilisateurs
  ansible.builtin.user:
    name: "{{ item }}"
    state: present
  loop:
    - alice
    - bob
    - charlie

- name: Installer plusieurs paquets
  ansible.builtin.apt:
    name: "{{ item }}"
    state: present
  loop: "{{ packages }}"
  vars:
    packages:
      - nginx
      - curl
      - vim
      - htop
```

## Playbook complet : sécuriser un nouveau serveur

```yaml
# harden-server.yml
---
- name: Sécurisation initiale d'un serveur
  hosts: all
  become: true

  vars:
    admin_user: brandon
    ssh_port: 2222

  tasks:
    - name: Mettre à jour tous les paquets
      ansible.builtin.apt:
        upgrade: dist
        update_cache: true

    - name: Installer les outils essentiels
      ansible.builtin.apt:
        name: [ufw, fail2ban, curl, vim, htop]
        state: present

    - name: Créer l'utilisateur admin
      ansible.builtin.user:
        name: "{{ admin_user }}"
        groups: sudo
        shell: /bin/bash

    - name: Déployer la clé SSH
      ansible.posix.authorized_key:
        user: "{{ admin_user }}"
        key: "{{ lookup('file', '~/.ssh/id_ed25519.pub') }}"

    - name: Configurer SSH
      ansible.builtin.lineinfile:
        path: /etc/ssh/sshd_config
        regexp: "{{ item.regexp }}"
        line: "{{ item.line }}"
      loop:
        - { regexp: '^#?Port', line: "Port {{ ssh_port }}" }
        - { regexp: '^#?PermitRootLogin', line: 'PermitRootLogin no' }
        - { regexp: '^#?PasswordAuthentication', line: 'PasswordAuthentication no' }
      notify: Recharger SSH

    - name: Configurer UFW
      community.general.ufw:
        rule: allow
        port: "{{ ssh_port }}"
        proto: tcp

    - name: Activer UFW
      community.general.ufw:
        state: enabled
        policy: deny

  handlers:
    - name: Recharger SSH
      ansible.builtin.service:
        name: sshd
        state: reloaded
```

```bash
ansible-playbook -i inventory.ini harden-server.yml
```

## Récapitulatif

| Commande | Description |
|---|---|
| `ansible all -m ping` | Tester la connectivité |
| `ansible-playbook playbook.yml` | Exécuter un playbook |
| `ansible-playbook playbook.yml --check` | Dry-run |
| `ansible-playbook playbook.yml --diff` | Afficher les changements |
| `ansible-doc module_name` | Documentation d'un module |
| `ansible-inventory --list` | Afficher l'inventaire |

Ansible est un outil qui change profondément la façon d'administrer des serveurs. Associé à [systemd](/blog/systemd-creer-gerer-services) pour la gestion des services et à [SSH hardening](/blog/ssh-hardening-securiser-serveur) pour la sécurité, il constitue le socle d'une infrastructure reproductible et maintenable.
