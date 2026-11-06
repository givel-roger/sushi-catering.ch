#!/bin/bash
set -e

echo "=== Setup Server für gutschein-schenken.ch ==="
echo ""

# 1. Docker installieren
echo ">> Docker installieren..."
apt-get update -qq
apt-get install -y -qq ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list

apt-get update -qq
apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin

systemctl enable docker
systemctl start docker
echo "Docker: $(docker --version)"
echo "Compose: $(docker compose version)"

# 2. Certbot installieren
echo ""
echo ">> Certbot installieren..."
apt-get install -y -qq certbot python3-certbot-nginx

# 3. Projektverzeichnis erstellen
echo ""
echo ">> Projektverzeichnis erstellen..."
mkdir -p /opt/gutschein-schenken/data

echo ""
echo "=== Setup fertig ==="
echo "Docker: $(systemctl is-active docker)"
echo "Nginx:  $(systemctl is-active nginx)"
echo "Certbot: $(certbot --version 2>&1)"
