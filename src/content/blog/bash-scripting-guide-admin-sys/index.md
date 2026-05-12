---
title: "Bash scripting : guide pratique pour les administrateurs système"
description: Maîtrisez les bases du scripting Bash pour automatiser vos tâches d'administration système. Variables, conditions, boucles, fonctions et bonnes pratiques.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
  - scripting
  - automatisation
language: fr
draft: false
comment: true
---

Bash est le shell par défaut sur la plupart des distributions Linux. Savoir écrire des scripts Bash est une compétence fondamentale pour tout administrateur système : automatiser des sauvegardes, surveiller des services, traiter des logs, déployer des applications... Ce guide couvre les bases essentielles avec des exemples concrets.

## Structure d'un script Bash

```bash
#!/bin/bash
# Description : script exemple
# Auteur : brandon
# Date : 2026-03-10

echo "Hello, World !"
```

- **`#!/bin/bash`** (shebang) : indique l'interpréteur à utiliser — toujours en première ligne
- **Commentaires** : commencent par `#`

### Rendre un script exécutable

```bash
chmod +x mon-script.sh
./mon-script.sh
```

## Variables

```bash
# Déclarer une variable
NOM="brandon"
AGE=30
FICHIER="/var/log/app.log"

# Utiliser une variable
echo "Bonjour $NOM"
echo "Age : ${AGE} ans"

# Variable en lecture seule
readonly VERSION="1.0.0"

# Supprimer une variable
unset NOM
```

### Variables spéciales

```bash
$0          # Nom du script
$1, $2...   # Arguments positionnels
$#          # Nombre d'arguments
$@          # Tous les arguments (liste)
$?          # Code de retour de la dernière commande (0 = succès)
$$          # PID du script courant
$USER       # Utilisateur courant
$HOME       # Répertoire home
$PWD        # Répertoire courant
```

```bash
#!/bin/bash
echo "Script : $0"
echo "Premier argument : $1"
echo "Nombre d'arguments : $#"
echo "Tous les arguments : $@"
```

### Substitution de commandes

```bash
# Capturer la sortie d'une commande dans une variable
DATE=$(date +%Y-%m-%d)
NB_FICHIERS=$(ls /var/log | wc -l)
ESPACE=$(df -h / | awk 'NR==2{print $5}')

echo "Date : $DATE"
echo "Fichiers de log : $NB_FICHIERS"
echo "Disque utilisé : $ESPACE"
```

## Entrées et sorties

```bash
# Afficher du texte
echo "Message simple"
printf "%-20s %s\n" "Clé:" "Valeur"  # format aligné

# Lire une entrée utilisateur
read -p "Entrez votre nom : " NOM
read -sp "Mot de passe : " MDP   # -s = silencieux (pas d'affichage)
echo ""  # saut de ligne après le mot de passe

# Redirection
echo "Log" >> /var/log/monscript.log   # ajouter à un fichier
echo "Erreur" >&2                       # vers stderr
commande > /dev/null 2>&1              # ignorer toute la sortie
```

## Conditions

```bash
# Syntaxe
if [ condition ]; then
    # commandes
elif [ autre_condition ]; then
    # commandes
else
    # commandes
fi
```

### Comparaisons numériques

```bash
if [ $AGE -eq 30 ]; then echo "30 ans"; fi   # égal
if [ $AGE -ne 0 ]; then echo "non nul"; fi   # différent
if [ $AGE -gt 18 ]; then echo "majeur"; fi   # supérieur
if [ $AGE -lt 65 ]; then echo "actif"; fi    # inférieur
if [ $AGE -ge 18 ]; then echo ">= 18"; fi    # supérieur ou égal
if [ $AGE -le 65 ]; then echo "<= 65"; fi    # inférieur ou égal
```

### Comparaisons de chaînes

```bash
if [ "$NOM" = "brandon" ]; then echo "C'est moi"; fi    # égal
if [ "$NOM" != "root" ]; then echo "Pas root"; fi        # différent
if [ -z "$NOM" ]; then echo "Variable vide"; fi          # chaîne vide
if [ -n "$NOM" ]; then echo "Variable non vide"; fi      # chaîne non vide
```

### Tests sur les fichiers

```bash
if [ -f "/etc/nginx/nginx.conf" ]; then echo "fichier existe"; fi    # est un fichier
if [ -d "/var/log" ]; then echo "c'est un dossier"; fi               # est un dossier
if [ -e "/tmp/lock" ]; then echo "existe"; fi                        # existe (fichier ou dossier)
if [ -r "/etc/passwd" ]; then echo "lisible"; fi                     # lisible
if [ -w "/tmp/test" ]; then echo "inscriptible"; fi                  # inscriptible
if [ -x "/usr/bin/bash" ]; then echo "exécutable"; fi                # exécutable
if [ -s "/var/log/app.log" ]; then echo "non vide"; fi               # non vide (taille > 0)
```

### Opérateurs logiques

```bash
# ET
if [ -f "$FICHIER" ] && [ -r "$FICHIER" ]; then
    echo "fichier lisible"
fi

# OU
if [ "$USER" = "root" ] || [ "$USER" = "admin" ]; then
    echo "utilisateur privilégié"
fi

# NON
if [ ! -f "/tmp/lock" ]; then
    echo "pas de verrou"
fi
```

## Boucles

### Boucle for

```bash
# Itérer sur une liste
for SERVEUR in web1 web2 web3; do
    echo "Traitement de $SERVEUR"
    ssh $SERVEUR "uptime"
done

# Itérer sur des fichiers
for FICHIER in /var/log/*.log; do
    echo "Taille : $(wc -l < $FICHIER) lignes — $FICHIER"
done

# Boucle numérique
for i in $(seq 1 10); do
    echo "Itération $i"
done

# Syntaxe C
for ((i=0; i<5; i++)); do
    echo $i
done
```

### Boucle while

```bash
# Tant que la condition est vraie
COMPTEUR=0
while [ $COMPTEUR -lt 5 ]; do
    echo "Compteur : $COMPTEUR"
    ((COMPTEUR++))
done

# Lire un fichier ligne par ligne
while IFS= read -r LIGNE; do
    echo "Ligne : $LIGNE"
done < /etc/hosts

# Boucle infinie avec sortie
while true; do
    if [ condition_de_sortie ]; then
        break
    fi
    sleep 5
done
```

### Boucle until

```bash
# Jusqu'à ce que la condition soit vraie
until ping -c 1 -W 1 google.com &>/dev/null; do
    echo "Réseau indisponible, attente..."
    sleep 5
done
echo "Réseau disponible !"
```

## Fonctions

```bash
# Définir une fonction
verifier_service() {
    local SERVICE=$1  # variable locale
    if systemctl is-active --quiet "$SERVICE"; then
        echo "✓ $SERVICE est actif"
        return 0
    else
        echo "✗ $SERVICE est inactif"
        return 1
    fi
}

# Appeler la fonction
verifier_service nginx
verifier_service mysql

# Utiliser le code de retour
if verifier_service nginx; then
    echo "Nginx fonctionne"
fi
```

## Gestion des erreurs

### Arrêter le script en cas d'erreur

```bash
#!/bin/bash
set -e          # Arrêter si une commande échoue
set -u          # Arrêter si une variable non définie est utilisée
set -o pipefail # Propager les erreurs dans les pipes
set -euo pipefail  # Les trois ensemble (recommandé)
```

### Trap : nettoyer à la sortie

```bash
#!/bin/bash

FICHIER_TEMP=$(mktemp)

# Nettoyage automatique à la sortie (succès ou erreur)
cleanup() {
    rm -f "$FICHIER_TEMP"
    echo "Nettoyage effectué"
}
trap cleanup EXIT

# Gérer CTRL+C
trap 'echo "Interruption détectée"; exit 1' INT

# Utiliser le fichier temporaire
echo "données" > "$FICHIER_TEMP"
# ... traitement ...
```

### Vérification des arguments

```bash
#!/bin/bash
set -euo pipefail

# Vérifier qu'un argument est passé
if [ $# -ne 1 ]; then
    echo "Usage : $0 <nom-du-serveur>"
    exit 1
fi

SERVEUR="$1"
```

## Script d'exemple complet : surveillance des services

```bash
#!/bin/bash
# surveillance-services.sh — Vérifier et redémarrer les services si nécessaire

set -euo pipefail

LOG="/var/log/surveillance.log"
SERVICES=("nginx" "mysql" "fail2ban")
EMAIL="admin@mondomaine.fr"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG"
}

envoyer_alerte() {
    local MESSAGE="$1"
    echo "$MESSAGE" | mail -s "[ALERTE] Service arrêté sur $(hostname)" "$EMAIL"
}

verifier_et_redemarrer() {
    local SERVICE="$1"

    if ! systemctl is-active --quiet "$SERVICE"; then
        log "ALERTE : $SERVICE est arrêté. Tentative de redémarrage..."

        if systemctl restart "$SERVICE"; then
            log "OK : $SERVICE redémarré avec succès"
            envoyer_alerte "$SERVICE a été redémarré automatiquement sur $(hostname)"
        else
            log "ERREUR : impossible de redémarrer $SERVICE"
            envoyer_alerte "CRITIQUE : $SERVICE ne peut pas être redémarré sur $(hostname)"
        fi
    else
        log "OK : $SERVICE est actif"
    fi
}

# Vérification de tous les services
log "=== Début de la vérification ==="
for SERVICE in "${SERVICES[@]}"; do
    verifier_et_redemarrer "$SERVICE"
done
log "=== Fin de la vérification ==="
```

Planifier avec [crontab](/blog/planification-de-taches-avec-crontab) :

```cron
*/5 * * * * /usr/local/bin/surveillance-services.sh
```

## Bonnes pratiques

```bash
# 1. Toujours commencer par le shebang et set -euo pipefail
#!/bin/bash
set -euo pipefail

# 2. Déclarer les variables en majuscules pour les constantes
readonly BACKUP_DIR="/backup"

# 3. Utiliser des guillemets autour des variables
cp "$SOURCE" "$DEST"  # et non cp $SOURCE $DEST

# 4. Vérifier les dépendances au démarrage
command -v rsync &>/dev/null || { echo "rsync requis"; exit 1; }

# 5. Ajouter un usage/aide
usage() {
    cat <<EOF
Usage: $(basename "$0") [options]
  -h    Afficher cette aide
  -v    Mode verbeux
EOF
}
```

## Récapitulatif des tests de fichiers

| Test | Signification |
|---|---|
| `-f fichier` | Est un fichier régulier |
| `-d chemin` | Est un répertoire |
| `-e chemin` | Existe |
| `-r fichier` | Est lisible |
| `-w fichier` | Est inscriptible |
| `-x fichier` | Est exécutable |
| `-s fichier` | Taille > 0 |
| `-z "$var"` | Chaîne vide |
| `-n "$var"` | Chaîne non vide |

Le scripting Bash est indispensable pour automatiser les tâches d'administration. Combinez-le avec [crontab](/blog/planification-de-taches-avec-crontab) pour la planification, [rsync](/blog/rsync-sauvegarder-synchroniser-fichiers) pour les sauvegardes et [systemd](/blog/systemd-creer-gerer-services) pour créer des services à partir de vos scripts.
