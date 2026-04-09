#!/bin/bash
# Deploy Pérez Dental Agent to OpenClaw
# This overwrites the existing workspace!

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKSPACE="$HOME/.openclaw/workspace"

echo "🐭 ═══════════════════════════════════════"
echo "   Deploying Pérez Dental Agent"
echo "═══════════════════════════════════════════"
echo ""
echo "⚠️  This will overwrite files in: $WORKSPACE"
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 1
fi

echo ""
echo "📁 Step 1: Copying workspace files..."
cp "$SCRIPT_DIR/workspace/IDENTITY.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/workspace/SOUL.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/workspace/USER.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/workspace/AGENTS.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/workspace/TOOLS.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/workspace/HEARTBEAT.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/workspace/CLINICA.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/workspace/PRODUCTOS.md" "$WORKSPACE/"
cp "$SCRIPT_DIR/workspace/MEMORY.md" "$WORKSPACE/"
mkdir -p "$WORKSPACE/memory"
echo "✅ Workspace files deployed."

echo ""
echo "🔐 Step 2: Setting up environment variables..."
bash "$SCRIPT_DIR/env-setup.sh"

echo ""
echo "📦 Step 3: Checking GOG skill..."
if ! openclaw skills list 2>/dev/null | grep -qi "gog"; then
  echo "Installing GOG skill (Google Workspace)..."
  openclaw skills install gog
  echo "✅ GOG skill installed."
else
  echo "✅ GOG skill already installed."
fi

echo ""
echo "⏰ Step 4: Registering cron jobs..."
bash "$SCRIPT_DIR/cron-setup.sh"

echo ""
echo "🔄 Step 5: Restarting gateway..."
openclaw gateway restart

echo ""
echo "🐭 ═══════════════════════════════════════"
echo "   ¡Pérez está listo!"
echo "═══════════════════════════════════════════"
echo ""
echo "📋 Verificación:"
echo "   openclaw status          — estado del gateway"
echo "   openclaw cron list       — cron jobs registrados"
echo "   openclaw skills list     — skills instaladas"
echo ""
echo "🧪 Test: Envía un mensaje a tu bot de Telegram:"
echo '   "Hola"                   → Saludo de Pérez'
echo '   "Cuánto cuesta una limpieza?" → FAQ'
echo '   "Me duele mucho una muela"    → Urgencia'
echo '   "Soy la Dra. Martínez"       → Auth admin'
