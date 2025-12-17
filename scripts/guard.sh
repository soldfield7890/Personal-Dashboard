#!/usr/bin/env bash
set -euo pipefail

echo "🔎 Guard: scanning /app for terminal paste artifacts..."

# Scan ONLY app/ (so guard scripts don't self-trigger)
if git grep -nE "^[[:space:]]*cat[[:space:]]+>[[:space:]]+|<<[[:space:]]*['\"]?EOF['\"]?|\\bEOF;\\b|@soldfield7890[[:space:]]+➜" -- app; then
  echo ""
  echo "❌ TERMINAL PASTE DETECTED — fix the file(s) above"
  exit 1
fi

echo "✅ Guard passed"
