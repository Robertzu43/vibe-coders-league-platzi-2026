#!/usr/bin/env bash
set -euo pipefail

# ─── Configuración ────────────────────────────────────────────────────────────
SKILL_NAME="date-planner"
SKILL_SRC="$(cd "$(dirname "$0")/skills/date-planner" && pwd)"
SKILL_DEST="$HOME/.openclaw/skills/$SKILL_NAME"
CRON_NAME="Planificador de Citas Semanal"

# ─── 1. Instalar el skill ─────────────────────────────────────────────────────
echo "📦 Instalando skill '$SKILL_NAME'..."

if [ -d "$SKILL_DEST" ]; then
  echo "   ⚠️  El skill ya existe en $SKILL_DEST — sobreescribiendo..."
  rm -rf "$SKILL_DEST"
fi

cp -r "$SKILL_SRC" "$SKILL_DEST"
echo "   ✅ Skill copiado a $SKILL_DEST"

# ─── 2. Registrar el cron job (idempotente) ───────────────────────────────────
echo ""
echo "⏰ Registrando cron job '$CRON_NAME'..."

if openclaw cron list 2>/dev/null | grep -q "$CRON_NAME"; then
  echo "   ⚠️  Ya existe un cron con ese nombre — eliminando el anterior..."
  openclaw cron list --json 2>/dev/null \
    | python3 -c "
import sys, json
jobs = json.load(sys.stdin)
for j in jobs:
    if j.get('name') == '$CRON_NAME':
        print(j['id'])
" | xargs -I{} openclaw cron remove {} 2>/dev/null || true
fi

openclaw cron add \
  --name "$CRON_NAME" \
  --cron "0 8 * * 1" \
  --tz "America/Bogota" \
  --session isolated \
  --message "Genera el plan de citas de esta semana. Inventa calendarios realistas con variedad para ambas personas, encuentra los mejores huecos libres en común y sugiere planes de cita específicos y concretos para cada uno." \
  --announce \
  --channel telegram

echo "   ✅ Cron job registrado"
echo ""
echo "─────────────────────────────────────────────────"
echo "✅ Instalación completa."
echo ""
echo "Próximos pasos:"
echo "  1. Verifica que el skill cargó:  openclaw skills list"
echo "  2. Prueba ahora:                 openclaw cron list"
echo "  3. Ejecuta manualmente:          openclaw cron run <jobId>"
echo "─────────────────────────────────────────────────"
