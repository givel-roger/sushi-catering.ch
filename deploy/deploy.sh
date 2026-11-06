#!/bin/bash
set -e

SERVER="root@157.90.153.103"
REMOTE_DIR="/opt/gutschein-schenken"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Deploy gutschein-schenken.ch ==="
echo "Server: $SERVER"
echo "Remote: $REMOTE_DIR"
echo ""

# 1. Sync files (ohne data/ und .env.local zu überschreiben)
echo ">> rsync..."
rsync -avz --progress \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='data/' \
  --exclude='.env.local' \
  --exclude='.DS_Store' \
  "$PROJECT_DIR/" "$SERVER:$REMOTE_DIR/"

# 2. .env.local erstellen falls nicht vorhanden
echo ""
echo ">> Checking .env.local on server..."
ssh "$SERVER" "cd $REMOTE_DIR && [ -f .env.local ] || cp .env.example .env.local && echo 'Created .env.local — bitte ADMIN_SECRET setzen!'"

# 3. Docker build & start
echo ""
echo ">> Docker build & up..."
ssh "$SERVER" "cd $REMOTE_DIR && docker compose up -d --build"

# 4. Health check
echo ""
echo ">> Health check..."
sleep 3
if ssh "$SERVER" "curl -sf http://localhost:3010/ > /dev/null"; then
  echo "OK — gutschein-schenken.ch läuft auf Port 3010"
else
  echo "WARNUNG: Health check fehlgeschlagen!"
  ssh "$SERVER" "docker logs gutschein-schenken --tail 20"
fi

# 5. Log
DATE=$(date '+%Y-%m-%d %H:%M:%S')
VERSION=$(grep '"version"' "$PROJECT_DIR/package.json" | head -1 | sed 's/.*: "//;s/".*//')
echo "$DATE | v$VERSION | deployed to $SERVER:$REMOTE_DIR" >> "$PROJECT_DIR/deploy/deploy.log"

echo ""
echo "=== Deploy complete ==="
