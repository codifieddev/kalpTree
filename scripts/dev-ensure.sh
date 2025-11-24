#!/usr/bin/env bash
set -euo pipefail
PORT=55803
URL="http://localhost:${PORT}/"
LOG_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG="${LOG_DIR}/dev-${PORT}.log"
PIDFILE="/workspace/dev-${PORT}.pid"

check() {
  curl -sS --max-time 2 -I "$URL" >/dev/null 2>&1
}

if check; then
  echo "Dev server is responding on ${PORT}. Nothing to do."
  exit 0
fi

echo "Starting dev server on ${PORT}..."
cd "$LOG_DIR"
nohup npm run dev > "$LOG" 2>&1 &
PID=$!
echo $PID > "$PIDFILE"
echo "Started (pid $PID). Logs: $LOG"
