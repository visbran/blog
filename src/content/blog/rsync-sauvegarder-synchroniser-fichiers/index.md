---
title: "rsync : sauvegarder et synchroniser ses fichiers efficacement"
description: rsync est l'outil de référence pour la sauvegarde et la synchronisation sous Linux. Maîtrisez ses options essentielles et automatisez vos sauvegardes.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
  - automatisation
  - scripting
language: fr
draft: false
comment: true
---

Quand on administre un serveur ou un homelab, la question des sauvegardes est incontournable. **rsync** est l'outil de référence sous Linux pour synchroniser et sauvegarder des fichiers, localement ou à distance. Rapide, fiable et incrémental, il n'envoie que les différences — pas les fichiers entiers à chaque fois.

## Pourquoi rsync ?

- **Incrémental** : seules les modifications sont transférées, pas l'intégralité des fichiers
- **Réseau** : fonctionne en local et via SSH pour les transferts distants
- **Préservation** : conserve les permissions, dates, liens symboliques
- **Reprise** : reprend automatiquement un transfert interrompu
- **Universel** : disponible sur toutes les distributions Linux et macOS

## Installation

rsync est généralement préinstallé. Si ce n'est pas le cas :

```bash
# Debian / Ubuntu
sudo apt install rsync -y

# RHEL / AlmaLinux
sudo dnf install rsync -y
```

## Syntaxe de base

```bash
rsync [options] source/ destination/
```

> **Attention au slash final** : `source/` (avec slash) copie le *contenu* du dossier. `source` (sans slash) copie le *dossier lui-même*.

```bash
# Copie le contenu de documents/ dans backup/
rsync -a ~/documents/ ~/backup/

# Copie le dossier documents/ entier dans backup/ (crée backup/documents/)
rsync -a ~/documents ~/backup/
```

## Les options essentielles

| Option | Description |
|---|---|
| `-a` | Mode archive (récursif + préserve permissions, dates, liens) |
| `-v` | Verbose : affiche les fichiers traités |
| `-z` | Compression pendant le transfert (utile via réseau) |
| `-P` | Affiche la progression + reprend les transferts interrompus |
| `-n` | Dry-run : simule sans modifier (à combiner avec -v) |
| `--delete` | Supprime dans la destination les fichiers absents de la source |
| `--exclude` | Exclut des fichiers ou dossiers |
| `-e ssh` | Utilise SSH pour le transport |

La combinaison la plus courante :

```bash
rsync -avzP source/ destination/
```

## Sauvegarde locale

### Synchroniser deux dossiers

```bash
rsync -av ~/documents/ /media/disque-externe/backup-documents/
```

### Avec simulation préalable (recommandé)

Toujours tester avec `--dry-run` avant d'utiliser `--delete` :

```bash
# Simulation
rsync -av --dry-run --delete ~/documents/ /media/disque-externe/backup-documents/

# Si le résultat est correct, exécuter vraiment
rsync -av --delete ~/documents/ /media/disque-externe/backup-documents/
```

> **`--delete` est irréversible** : les fichiers supprimés de la source seront supprimés de la destination.

## Sauvegarde distante via SSH

### De local vers serveur distant

```bash
rsync -avzP ~/documents/ user@192.168.1.10:/home/user/backup/
```

### De serveur distant vers local

```bash
rsync -avzP user@192.168.1.10:/var/www/html/ ~/backup-site/
```

### Avec un port SSH personnalisé

```bash
rsync -avzP -e "ssh -p 2222" ~/documents/ user@serveur.fr:/backup/
```

### Avec une clé SSH spécifique

```bash
rsync -avzP -e "ssh -i ~/.ssh/id_backup" ~/documents/ user@serveur.fr:/backup/
```

## Exclure des fichiers et dossiers

### Exclure un dossier

```bash
rsync -av --exclude='node_modules/' ~/projets/ /backup/projets/
```

### Exclure plusieurs éléments

```bash
rsync -av \
  --exclude='node_modules/' \
  --exclude='.git/' \
  --exclude='*.log' \
  --exclude='.env' \
  ~/projets/ /backup/projets/
```

### Utiliser un fichier d'exclusions

```bash
# Créer le fichier
cat > ~/.rsync-exclude << EOF
node_modules/
.git/
*.log
.env
__pycache__/
*.pyc
.DS_Store
EOF

# Utiliser ce fichier
rsync -av --exclude-from='~/.rsync-exclude' ~/projets/ /backup/projets/
```

## Automatiser avec crontab

Combiner rsync avec [crontab](/blog/planification-de-taches-avec-crontab) pour des sauvegardes automatiques :

```bash
crontab -e
```

```cron
# Sauvegarde locale chaque nuit à 2h00
0 2 * * * rsync -az --delete ~/documents/ /media/disque/backup/ >> /var/log/rsync-backup.log 2>&1

# Sauvegarde distante chaque dimanche à 3h00
0 3 * * 0 rsync -az -e "ssh -i ~/.ssh/id_backup" ~/documents/ user@serveur.fr:/backup/ >> /var/log/rsync-remote.log 2>&1
```

## Script de sauvegarde complet

Voici un script de sauvegarde avec horodatage et rotation :

```bash
#!/bin/bash
# /usr/local/bin/backup.sh

SOURCE="/home/user/documents/"
DEST="/media/disque-externe/backups"
DATE=$(date +%Y-%m-%d)
LOG="/var/log/backup-$DATE.log"

echo "=== Début sauvegarde $DATE ===" | tee -a "$LOG"

rsync -avz --delete \
  --exclude='*.tmp' \
  --exclude='.cache/' \
  "$SOURCE" "$DEST/latest/" \
  >> "$LOG" 2>&1

if [ $? -eq 0 ]; then
  echo "✓ Sauvegarde réussie" | tee -a "$LOG"
else
  echo "✗ Erreur lors de la sauvegarde" | tee -a "$LOG"
  exit 1
fi

# Supprimer les logs de plus de 30 jours
find /var/log/ -name "backup-*.log" -mtime +30 -delete

echo "=== Fin sauvegarde ===" | tee -a "$LOG"
```

Rendre le script exécutable :

```bash
chmod +x /usr/local/bin/backup.sh
```

## Sauvegardes avec historique (snapshots)

Pour conserver des sauvegardes à plusieurs dates sans dupliquer les fichiers inchangés, utilisez `--link-dest` :

```bash
#!/bin/bash
SOURCE="/home/user/documents/"
DEST="/backup"
DATE=$(date +%Y-%m-%d_%H-%M)
LATEST="$DEST/latest"

rsync -az --delete \
  --link-dest="$LATEST" \
  "$SOURCE" "$DEST/$DATE/"

# Mettre à jour le lien symbolique vers la dernière sauvegarde
rm -f "$LATEST"
ln -s "$DEST/$DATE" "$LATEST"
```

Résultat : chaque dossier daté ne contient que les nouveaux fichiers, les fichiers inchangés sont des liens durs vers la sauvegarde précédente — zéro duplication.

## Vérifier la progression d'un transfert

```bash
# Afficher la progression globale (rsync 3.1+)
rsync -avP --info=progress2 ~/documents/ /backup/
```

## Récapitulatif

| Cas d'usage | Commande |
|---|---|
| Sauvegarde locale simple | `rsync -av source/ dest/` |
| Synchronisation miroir | `rsync -av --delete source/ dest/` |
| Transfert vers serveur SSH | `rsync -avzP source/ user@serveur:/dest/` |
| Simulation avant exécution | `rsync -av --dry-run source/ dest/` |
| Exclure des dossiers | `rsync -av --exclude='node_modules/' source/ dest/` |
| Reprendre un transfert | `rsync -avP source/ dest/` |

rsync est un outil fondamental qu'il vaut la peine de maîtriser. Associé à [crontab](/blog/planification-de-taches-avec-crontab) pour l'automatisation et à [Fail2ban](/blog/fail2ban-proteger-services-brute-force) pour la sécurité, il constitue une brique essentielle d'une infrastructure bien administrée.
