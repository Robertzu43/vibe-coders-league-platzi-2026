# Date Planner Agent Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear un agente OpenClaw con un skill `date-planner` y un cron job que cada lunes a las 8am genera calendarios ficticios para dos personas, encuentra huecos libres en común y envía sugerencias de citas específicas por Telegram.

**Architecture:** El skill `SKILL.md` contiene las instrucciones completas del agente (generación de calendarios, detección de huecos, sugerencia de planes). El cron job lo activa cada lunes en sesión aislada con delivery directo a Telegram. No hay código de servidor ni APIs externas — todo corre dentro del Gateway de OpenClaw.

**Tech Stack:** OpenClaw (gateway self-hosted), SKILL.md (AgentSkills format), bash (setup script), Claude via OpenClaw model config, Telegram (delivery nativo)

---

## File Map

| Archivo | Responsabilidad |
|---------|----------------|
| `reto-03/skills/date-planner/SKILL.md` | Instrucciones completas del agente: generar calendarios, encontrar huecos, sugerir planes, formatear Telegram |
| `reto-03/setup.sh` | Script idempotente que instala el skill y registra el cron job en OpenClaw |
| `reto-03/README.md` | Documentación del reto: qué hace, cómo instalar, cómo probar |

---

## Chunk 1: Skill y Setup Script

### Task 1: Crear el skill `date-planner`

**Files:**
- Create: `reto-03/skills/date-planner/SKILL.md`

- [ ] **Step 1: Crear el directorio del skill**

```bash
mkdir -p reto-03/skills/date-planner
```

- [ ] **Step 2: Crear `reto-03/skills/date-planner/SKILL.md`** con el contenido exacto del spec

```markdown
---
name: date-planner
description: Planificador de citas para parejas. Genera calendarios ficticios semanales para dos personas, encuentra huecos libres en común y sugiere planes de cita específicos por Telegram.
---

Eres un planificador de citas para parejas ocupadas. Cada vez que te activen, debes seguir estos pasos exactos:

## Paso 1 — Generar calendarios de la semana

Inventa eventos ficticios pero realistas para dos personas ("Persona A" y "Persona B") para la semana actual (lunes a domingo). Usa la fecha de hoy para calcular los días exactos.

Tipos de eventos a incluir (con variedad en cada ejecución):
- Reuniones de trabajo: "Standup diario 9:00–9:30", "Revisión de proyecto 14:00–16:00"
- Gym o deporte: "Gym 7:00–8:30", "Yoga 6:30–7:30"
- Compromisos sociales: "Cena familiar 7:00pm–10:00pm", "Cumpleaños de amigo 8:00pm–11:00pm"
- Citas o trámites: "Médico 11:00–12:00", "Banco 10:00–11:00"

Genera entre 3 y 5 eventos por persona por día laboral, y 1 a 2 eventos por día de fin de semana. Los eventos deben ser distintos cada semana.

## Paso 2 — Encontrar huecos libres en común

Compara los dos calendarios y encuentra momentos donde ambos están libres simultáneamente por al menos 2 horas consecutivas. Solo considera el rango 11:00am–11:00pm.

Prioriza en este orden:
1. Tardes de semana entre 4:00pm y 8:00pm
2. Noches de viernes o sábado desde las 7:00pm
3. Mañanas/tardes de fin de semana entre 11:00am y 6:00pm

Selecciona máximo 3 huecos, los más atractivos para una cita.

**Si encuentras menos de 3 huecos:** reporta los que haya con normalidad. Si solo hay 1 o 2, menciona brevemente al final: "Esta semana las agendas están muy cargadas — ¡aprovecha estos momentos!". Si no hay ningún hueco, envía: "💑 Esta semana no encontré ningún momento libre para los dos. ¡La semana que viene seguro hay más espacio!"

## Paso 3 — Sugerir planes específicos por horario

Para cada hueco libre, sugiere un plan de cita con estos tres elementos:

**Si el hueco es de tarde (antes de las 6:00pm):**
- Plan principal: visita cultural (museo, galería, exposición) o actividad (taller, clase, parque)
- Complemento: café o merienda en lugar específico con ambiente descrito
- Alternativa: actividad diferente al plan principal

**Si el hueco es de noche (6:00pm en adelante):**
- Plan principal: entretenimiento (película ficticia con título y género, obra de teatro, concierto)
- Complemento: cena o copa en restaurante/bar con tipo de cocina y ambiente descritos
- Alternativa: plan diferente (escape room, bolos, karaoke, etc.)

Los nombres de películas, restaurantes y lugares deben ser inventados pero sonar reales y específicos. No uses nombres genéricos como "un restaurante italiano" — di "Trattoria Nonna (pasta fresca, luz de velas, ambiente íntimo)".

## Paso 4 — Formato del mensaje Telegram

Responde ÚNICAMENTE con el mensaje formateado para Telegram, sin texto adicional antes ni después:

```
💑 Plan de Citas — Semana del [fecha inicio] al [fecha fin]

Encontré [N] momento(s) libre(s) esta semana:

📅 [Día] [número] · [hora]
[emoji plan] "[Nombre del plan]" — [descripción breve]
[emoji comida/bebida] [Lugar con descripción]
🎯 Alternativa: [plan alternativo]

[repetir para cada hueco]
```
```

- [ ] **Step 3: Verificar que el frontmatter es válido**

El archivo debe comenzar exactamente con `---` en la línea 1. Verifica que no haya espacios o líneas en blanco antes del bloque frontmatter.

```bash
head -3 reto-03/skills/date-planner/SKILL.md
```

Expected output:
```
---
name: date-planner
description: Planificador de citas para parejas...
```

- [ ] **Step 4: Commit**

```bash
git add reto-03/skills/date-planner/SKILL.md
git commit -m "feat(reto-03): add date-planner skill"
```

---

### Task 2: Crear el script de instalación `setup.sh`

**Files:**
- Create: `reto-03/setup.sh`

- [ ] **Step 1: Crear `reto-03/setup.sh`**

```bash
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

# Verificar si ya existe un job con ese nombre y eliminarlo
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
```

- [ ] **Step 2: Hacer el script ejecutable**

```bash
chmod +x reto-03/setup.sh
```

- [ ] **Step 3: Verificar sintaxis bash**

```bash
bash -n reto-03/setup.sh
```

Expected: sin output (sin errores de sintaxis)

- [ ] **Step 4: Commit**

```bash
git add reto-03/setup.sh
git commit -m "feat(reto-03): add idempotent setup script for skill and cron job"
```

---

### Task 3: Actualizar el README del reto

**Files:**
- Modify: `reto-03/README.md`

- [ ] **Step 1: Reemplazar el contenido de `reto-03/README.md`**

```markdown
# Reto 3 — Planificador de Citas para Parejas

> Vibe Coders League Platzi 2026

Un agente OpenClaw que cada lunes a las 8am genera calendarios ficticios para dos personas ocupadas, detecta los huecos libres en común durante la semana y envía sugerencias de citas específicas (película, restaurante, actividad alternativa) directamente por Telegram.

## ¿Qué automatiza?

Sin que nadie se lo pida, cada lunes el agente:

1. Inventa una semana típica de compromisos para dos personas (trabajo, gym, compromisos sociales)
2. Encuentra los momentos donde los dos están libres por al menos 2 horas
3. Sugiere hasta 3 planes concretos adaptados al horario (tarde → museo/café, noche → cine/cena)
4. Envía el resumen formateado a Telegram

## Stack

- **OpenClaw** — gateway self-hosted, cron scheduler, delivery Telegram nativo
- **Skill `date-planner`** — instrucciones del agente en formato AgentSkills
- **Modelo** — Claude (Anthropic) vía configuración de OpenClaw

## Instalación

### Prerrequisitos

- OpenClaw instalado y gateway corriendo (`openclaw start`)
- Claude configurado como modelo (`openclaw onboard` o `openclaw models set`)
- Canal Telegram conectado en `~/.openclaw/openclaw.json`

### Instalar

```bash
cd reto-03
bash setup.sh
```

El script:
1. Copia `skills/date-planner/` a `~/.openclaw/skills/`
2. Registra el cron job en OpenClaw (idempotente — si ya existe, lo reemplaza)

### Verificar la instalación

```bash
# El skill debe aparecer en la lista
openclaw skills list

# El cron job debe aparecer en la lista
openclaw cron list
```

### Probar ahora (sin esperar al lunes)

```bash
# Obtener el ID del job
openclaw cron list

# Ejecutar manualmente
openclaw cron run <jobId>
```

El mensaje debe llegar a Telegram en segundos.

## Ejemplo de output en Telegram

```
💑 Plan de Citas — Semana del 16 al 22 Mar

Encontré 3 momentos libres esta semana:

📅 Miércoles 18 · 7:00pm
🎬 "Neon Drift" — thriller sci-fi en Cinemark
🍜 Cena previa en Masa Madre (pasta artesanal, ambiente íntimo)
🎯 Alternativa: escape room en Mindgames Colombia

📅 Viernes 20 · 8:00pm
🎭 "La Última Función" — comedia en Teatro Mayor
🍷 Copa de vino después en Vintrella (rooftop, vistas)
🎯 Alternativa: concierto en Teatros El Parque

📅 Sábado 21 · 2:00pm
☕ Tarde de café en Amor Perfecto
🎨 Visita al MAMBO (museo de arte moderno)
🎯 Alternativa: clases de cerámica en La Arcilla
```

## Estructura

```
reto-03/
├── skills/
│   └── date-planner/
│       └── SKILL.md      ← Instrucciones del agente
├── setup.sh              ← Instalación en un comando
└── README.md
```

## Estado

- [x] En progreso
- [ ] Completado
```

- [ ] **Step 2: Commit**

```bash
git add reto-03/README.md
git commit -m "docs(reto-03): complete README with installation and usage instructions"
```

---

## Chunk 2: Instalación y Verificación

### Task 4: Instalar el skill en OpenClaw y verificar

> Este task requiere que el Gateway de OpenClaw esté corriendo localmente.

**Files:** ninguno — solo verificación en OpenClaw

- [ ] **Step 1: Asegurarse de que el Gateway está corriendo**

```bash
openclaw status
```

Expected: output indicando que el gateway está activo. Si no está corriendo: `openclaw start`

- [ ] **Step 2: Ejecutar el script de instalación**

```bash
cd reto-03
bash setup.sh
```

Expected output:
```
📦 Instalando skill 'date-planner'...
   ✅ Skill copiado a ~/.openclaw/skills/date-planner
⏰ Registrando cron job 'Planificador de Citas Semanal'...
   ✅ Cron job registrado
✅ Instalación completa.
```

- [ ] **Step 3: Verificar que el skill cargó**

```bash
openclaw skills list
```

Expected: `date-planner` aparece en la lista con su descripción.

- [ ] **Step 4: Verificar que el cron job existe**

```bash
openclaw cron list
```

Expected: aparece "Planificador de Citas Semanal" con schedule `0 8 * * 1` y tz `America/Bogota`.

- [ ] **Step 5: Obtener el jobId para el test manual**

```bash
openclaw cron list
```

Anota el `jobId` del job "Planificador de Citas Semanal" para el siguiente step.

- [ ] **Step 6: Ejecutar el cron manualmente y verificar Telegram**

```bash
openclaw cron run <jobId>
```

Expected:
- El comando confirma que el job se ejecutó
- En Telegram llega un mensaje con el formato `💑 Plan de Citas — Semana del...`
- El mensaje contiene al menos 1 hueco con plan, restaurante y alternativa
- Los nombres de lugares y películas son específicos (no genéricos)

- [ ] **Step 7: Ejecutar una segunda vez para verificar variedad**

```bash
openclaw cron run <jobId>
```

Expected: el mensaje en Telegram es diferente al anterior (distintos días, eventos, y sugerencias). Confirma que el agente genera calendarios con variedad.

- [ ] **Step 8: Verificar historial de ejecuciones**

```bash
openclaw cron runs --id <jobId>
```

Expected: aparecen al menos 2 ejecuciones con status `success`.

---

### Task 5: Marcar el reto como completado

**Files:**
- Modify: `reto-03/README.md`

- [ ] **Step 1: Actualizar el estado en el README**

Cambiar en `reto-03/README.md`:
```markdown
## Estado

- [x] En progreso
- [ ] Completado
```
por:
```markdown
## Estado

- [x] En progreso
- [x] Completado
```

- [ ] **Step 2: Commit final**

```bash
git add reto-03/README.md
git commit -m "docs(reto-03): mark reto as completed"
```
