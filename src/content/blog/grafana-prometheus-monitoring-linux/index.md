---
title: "Grafana + Prometheus : stack de monitoring pour Linux et Docker"
description: Prometheus collecte les métriques Linux et Docker, Grafana les visualise. Installation complète avec Docker Compose, node_exporter, cAdvisor et alertes.
publishDate: '2026-03-10T10:00:00+01:00'
tags:
  - administration système
  - linux
  - docker
  - devops
language: fr
draft: false
comment: true
---

Surveiller ses serveurs avec `top` ou `btop` est utile en temps réel, mais insuffisant pour détecter des tendances, configurer des alertes ou analyser des incidents a posteriori. **Prometheus** collecte et stocke les métriques dans le temps, **Grafana** les visualise avec des dashboards interactifs. Ensemble, ils constituent la stack de monitoring open source de référence.

## Architecture de la stack

```
[Serveurs Linux]          [Conteneurs Docker]
      │                          │
[node_exporter]         [cAdvisor]
      │                          │
      └────────────┬─────────────┘
                   ▼
            [Prometheus]
            (collecte et stockage)
                   │
                   ▼
             [Grafana]
             (visualisation)
```

**Composants :**
- **Prometheus** : base de données de métriques (séries temporelles)
- **node_exporter** : agent qui expose les métriques Linux (CPU, RAM, disque, réseau)
- **cAdvisor** : expose les métriques des conteneurs Docker
- **Grafana** : interface de visualisation avec dashboards

## Installation avec Docker Compose

Toute la stack tourne en conteneurs, ce qui simplifie l'installation et la mise à jour.

### Structure des fichiers

```
monitoring/
├── compose.yml
├── prometheus/
│   └── prometheus.yml
└── grafana/
    └── provisioning/  (optionnel)
```

### `compose.yml`

```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=30d'
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: motdepasse_fort
      GF_SERVER_DOMAIN: grafana.votredomaine.fr
    networks:
      - monitoring

  node-exporter:
    image: prom/node-exporter:latest
    restart: unless-stopped
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - monitoring

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro
    privileged: true
    devices:
      - /dev/kmsg
    networks:
      - monitoring

networks:
  monitoring:

volumes:
  prometheus_data:
  grafana_data:
```

### Configuration Prometheus (`prometheus/prometheus.yml`)

```yaml
global:
  scrape_interval: 15s       # Fréquence de collecte
  evaluation_interval: 15s   # Fréquence d'évaluation des alertes

scrape_configs:
  # Prometheus lui-même
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Métriques du serveur Linux (node_exporter)
  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']

  # Métriques Docker (cAdvisor)
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
```

### Démarrer la stack

```bash
docker compose up -d
```

Vérifier que tous les services tournent :

```bash
docker compose ps
```

## Accéder aux interfaces

| Service | URL | Identifiants |
|---|---|---|
| Prometheus | `http://ip:9090` | (aucun par défaut) |
| Grafana | `http://ip:3000` | admin / motdepasse_fort |
| node-exporter | `http://ip:9100/metrics` | (métriques brutes) |
| cAdvisor | `http://ip:8080` | (aucun) |

## Vérifier que Prometheus collecte les métriques

Dans l'interface Prometheus (`http://ip:9090`) :

**Status > Targets** : tous les targets doivent être en `UP`.

Tester une requête PromQL simple :

```promql
# Utilisation CPU en pourcentage
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Mémoire disponible en Go
node_memory_MemAvailable_bytes / 1024 / 1024 / 1024

# Espace disque utilisé
(node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes * 100
```

## Configurer Grafana

### Ajouter Prometheus comme source de données

1. Aller dans **Connections > Data sources > Add data source**
2. Choisir **Prometheus**
3. URL : `http://prometheus:9090`
4. Cliquer **Save & Test**

### Importer des dashboards prêts à l'emploi

Grafana dispose d'une bibliothèque de milliers de dashboards communautaires.

**Dashboards > Import > ID du dashboard**

**IDs recommandés :**
- **1860** — Node Exporter Full (métriques Linux complètes)
- **893** — Docker and system monitoring
- **11600** — Docker Containers (cAdvisor)
- **14282** — Proxmox summary

Copier l'ID, cliquer **Load**, sélectionner la source Prometheus, **Import**.

En quelques secondes, vous avez un dashboard professionnel.

## Surveiller plusieurs serveurs

Pour surveiller plusieurs serveurs, installer `node_exporter` sur chaque machine cible et l'ajouter dans `prometheus.yml` :

### Installer node_exporter sur un serveur Linux

```bash
# Télécharger et installer
wget https://github.com/prometheus/node_exporter/releases/latest/download/node_exporter-1.8.2.linux-amd64.tar.gz
tar xzf node_exporter-*.tar.gz
sudo cp node_exporter-*/node_exporter /usr/local/bin/
```

Créer un service systemd :

```bash
sudo tee /etc/systemd/system/node_exporter.service << EOF
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=nobody
ExecStart=/usr/local/bin/node_exporter
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable --now node_exporter
```

Ajouter dans `prometheus.yml` :

```yaml
scrape_configs:
  - job_name: 'serveurs'
    static_configs:
      - targets:
          - 'serveur1.domaine.fr:9100'
          - 'serveur2.domaine.fr:9100'
          - '192.168.1.10:9100'
```

Recharger Prometheus :

```bash
docker compose exec prometheus kill -HUP 1
# ou
curl -X POST http://localhost:9090/-/reload
```

## Alertes avec Alertmanager

Pour recevoir des notifications (email, Slack...) quand une métrique dépasse un seuil :

### Ajouter Alertmanager

```yaml
# Dans compose.yml
  alertmanager:
    image: prom/alertmanager:latest
    restart: unless-stopped
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml
    networks:
      - monitoring
```

### Configuration des alertes (`alertmanager/alertmanager.yml`)

```yaml
route:
  receiver: 'email'

receivers:
  - name: 'email'
    email_configs:
      - to: 'admin@mondomaine.fr'
        from: 'alertmanager@monserveur.fr'
        smarthost: 'smtp.mondomaine.fr:587'
        auth_username: 'user@mondomaine.fr'
        auth_password: 'motdepasse'
```

### Définir des règles d'alerte

```yaml
# prometheus/alerts.yml
groups:
  - name: serveur
    rules:
      - alert: InstanceDown
        expr: up == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Instance {{ $labels.instance }} hors ligne"

      - alert: DiskSpaceLow
        expr: (node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes > 0.85
        for: 10m
        annotations:
          summary: "Espace disque > 85% sur {{ $labels.instance }}"

      - alert: HighCPU
        expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 15m
        annotations:
          summary: "CPU > 80% pendant 15 minutes sur {{ $labels.instance }}"
```

## Sécuriser l'accès

Par défaut, les interfaces sont accessibles sans authentification. Mettre derrière [Nginx](/blog/nginx-reverse-proxy-certbot-ssl) ou [Traefik](/blog/traefik-reverse-proxy-docker) avec HTTPS et authentification basique.

Restricter node-exporter et cAdvisor au réseau interne uniquement :

```yaml
# Écouter uniquement sur l'interface interne
ports:
  - "127.0.0.1:9100:9100"  # accessible uniquement localement
```

## Récapitulatif

| Composant | Rôle | Port |
|---|---|---|
| Prometheus | Collecte et stockage des métriques | 9090 |
| Grafana | Visualisation et dashboards | 3000 |
| node_exporter | Métriques Linux (CPU, RAM, disque...) | 9100 |
| cAdvisor | Métriques conteneurs Docker | 8080 |
| Alertmanager | Gestion et envoi des alertes | 9093 |

Grafana + Prometheus est la stack de monitoring de référence. Associée à [Portainer](/blog/portainer-interface-docker) pour la gestion Docker et [btop](/blog/btop-monitoring-systeme-linux) pour le monitoring temps réel, vous avez une visibilité complète sur votre infrastructure.
