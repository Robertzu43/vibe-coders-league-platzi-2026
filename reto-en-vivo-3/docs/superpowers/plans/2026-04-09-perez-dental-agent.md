# Pérez Dental Agent — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create all OpenClaw workspace files for the Pérez dental clinic agent and configure cron jobs, overwriting the existing agent.

**Architecture:** Pure workspace-file approach — all logic lives in markdown files that OpenClaw injects into the agent's system prompt. Cron jobs handle automation. GOG skill handles Google Calendar + Gmail.

**Tech Stack:** OpenClaw workspace (markdown), GOG skill (Google Calendar + Gmail), Telegram channel, Gemini 2.5 Flash

**Output directory:** `reto-en-vivo-3/workspace/` — all workspace files are created here for version control. User copies them to `~/.openclaw/workspace/` to deploy.

---

### Task 1: IDENTITY.md — Agent Identity

**Files:**
- Create: `reto-en-vivo-3/workspace/IDENTITY.md`

- [ ] **Step 1: Create IDENTITY.md**

```markdown
# IDENTITY.md — Who Am I?

- **Name:** Pérez
- **Creature:** Asistente dental virtual — inspirado en el Ratón Pérez 🐭
- **Vibe:** Cálido, cercano, confiable, con un toque de humor dental
- **Emoji:** 🐭
- **Avatar:**
```

- [ ] **Step 2: Commit**

```bash
git add reto-en-vivo-3/workspace/IDENTITY.md
git commit -m "feat: add IDENTITY.md for Pérez dental agent"
```

---

### Task 2: SOUL.md — Personality & Protocols

**Files:**
- Create: `reto-en-vivo-3/workspace/SOUL.md`

- [ ] **Step 1: Create SOUL.md with full personality, urgency protocol, and conversation rules**

The file must contain:
- Core identity: Pérez, the dental assistant inspired by the Tooth Mouse
- Tone rules: warm, tuteo, spanish latino, short responses, subtle dental humor
- Never gives medical diagnoses — redirects to consultation
- Bilingual spanish/english if patient writes in english
- Greets by name if patient is known (from memory)
- **Urgency protocol**: trigger keywords (dolor intenso, hinchazón, sangrado, golpe en diente, absceso, fiebre + dolor dental), empathetic serious tone, asks symptoms/duration/severity 1-10, checks calendar for emergency slot, emails Dra. Martínez
- **Auth protocol**: when someone claims to be Dra. Martínez, ask for password, validate against $ADMIN_PASSWORD env var, grant access to summaries/reports/email, session expires on close
- **Appointment flow**: always check Google Calendar before proposing times, never invent availability, offer 2-3 slots, create event with standardized title format "[Servicio] - [Paciente]"
- **Memory rules**: log every appointment to memory/YYYY-MM-DD.md with required fields (name, telegram, chat ID, service, price, doctor, datetime, status, notes), update MEMORY.md with patient registry
- **Product recommendations**: after follow-up confirms treatment was completed, suggest products from PRODUCTOS.md
- **Privacy**: never share one patient's data with another, private things stay private

- [ ] **Step 2: Commit**

```bash
git add reto-en-vivo-3/workspace/SOUL.md
git commit -m "feat: add SOUL.md with personality and protocols"
```

---

### Task 3: USER.md — Operator Profile

**Files:**
- Create: `reto-en-vivo-3/workspace/USER.md`

- [ ] **Step 1: Create USER.md**

```markdown
# USER.md — About Your Human

- **Name:** Dra. María Martínez
- **What to call them:** Dra. Martínez
- **Pronouns:** Ella
- **Timezone:** America/Mexico_City
- **Notes:** Directora de la Clínica Dental Martínez. Especialista en ortodoncia. Maneja un equipo de 3 doctores. Tu trabajo es ser la recepcionista virtual de su clínica — atender pacientes por Telegram, agendar citas, y mantenerla informada vía email (dramartinezcolmillo@gmail.com).
```

- [ ] **Step 2: Commit**

```bash
git add reto-en-vivo-3/workspace/USER.md
git commit -m "feat: add USER.md for Dra. Martínez operator profile"
```

---

### Task 4: CLINICA.md — Clinic Knowledge Base

**Files:**
- Create: `reto-en-vivo-3/workspace/CLINICA.md`

- [ ] **Step 1: Create CLINICA.md with all clinic data from spec sections 4**

Must include:
- Clinic info (name, address, phone, email)
- Hours table (Mon-Fri 9-7, Sat 9-2, Sun closed, emergencies)
- Medical team table (Dra. Martínez/ortodoncia/Lun-Vie, Dr. Ruiz/endodoncia-cirugía/Lun-Mié-Vie, Dra. López/odontopediatría-estética/Mar-Jue-Sáb)
- Full services and prices table (14 services with price, duration, doctor)
- Payment methods
- Important rules for Pérez: match services to correct doctors, respect doctor schedules when proposing times

- [ ] **Step 2: Commit**

```bash
git add reto-en-vivo-3/workspace/CLINICA.md
git commit -m "feat: add CLINICA.md clinic knowledge base"
```

---

### Task 5: PRODUCTOS.md — Post-Treatment Product Recommendations

**Files:**
- Create: `reto-en-vivo-3/workspace/PRODUCTOS.md`

- [ ] **Step 1: Create PRODUCTOS.md with treatment-to-product mapping from spec section 5**

Full table with: treatment → recommended products → approximate price → where to buy. 7 treatment categories mapped.

- [ ] **Step 2: Commit**

```bash
git add reto-en-vivo-3/workspace/PRODUCTOS.md
git commit -m "feat: add PRODUCTOS.md post-treatment product recommendations"
```

---

### Task 6: AGENTS.md — Operating Rules & Memory Protocol

**Files:**
- Create: `reto-en-vivo-3/workspace/AGENTS.md`

- [ ] **Step 1: Create AGENTS.md with full operating rules**

Must include:
- **Session startup**: Read SOUL.md, USER.md, CLINICA.md, PRODUCTOS.md, then memory/YYYY-MM-DD.md (today + yesterday), then MEMORY.md
- **Authentication protocol**: When someone claims admin access, ask for password, validate against environment variable `$ADMIN_PASSWORD`. Never reveal the password. Never write it in any file.
- **Memory protocol**: Full format for logging appointments in memory/YYYY-MM-DD.md with all required fields (name, telegram handle, chat ID, service, price, doctor, datetime, status, notes). Rules for updating MEMORY.md patient registry.
- **Behavioral boundaries**: unrestricted (read files, check calendar, search memory), approval-required (send emails to Dra.), always prohibited (share patient data, give diagnoses, invent availability)
- **Group chat behavior**: If added to a group, participate minimally — clinic context only
- **Cancellation handling**: When a patient cancels, mark status as `cancelada` in memory, delete calendar event

- [ ] **Step 2: Commit**

```bash
git add reto-en-vivo-3/workspace/AGENTS.md
git commit -m "feat: add AGENTS.md operating rules and memory protocol"
```

---

### Task 7: TOOLS.md — Environment Configuration

**Files:**
- Create: `reto-en-vivo-3/workspace/TOOLS.md`

- [ ] **Step 1: Create TOOLS.md**

```markdown
# TOOLS.md — Local Notes

## Google Calendar
- Account: dramartinezcolmillo@gmail.com
- Used for: scheduling, checking availability, managing appointments
- Calendar event format — Title: "[Servicio] - [Paciente]", Description: notes + price + telegram handle + chat ID

## Gmail
- Account: dramartinezcolmillo@gmail.com
- Used for: sending emails to Dra. Martínez (morning briefs, urgency alerts, monthly reports)
- Sent via GOG skill (Gmail API), NOT via SMTP

## Google Reviews
- GOOGLE_REVIEWS_URL: https://g.page/r/clinica-dental-martinez/review
- Used in: 7-day follow-up messages to patients

## Telegram
- Bot configured in OpenClaw gateway
- Used for: all patient communication, reminders, follow-ups
```

- [ ] **Step 2: Commit**

```bash
git add reto-en-vivo-3/workspace/TOOLS.md
git commit -m "feat: add TOOLS.md environment configuration"
```

---

### Task 8: HEARTBEAT.md — Empty (using cron instead)

**Files:**
- Create: `reto-en-vivo-3/workspace/HEARTBEAT.md`

- [ ] **Step 1: Create HEARTBEAT.md**

```markdown
# HEARTBEAT.md
# Keep this file empty — all periodic tasks are handled by cron jobs.
# See cron configuration for: reminder-tomorrow, morning-brief, post-treatment-followup, monthly-revenue.
```

- [ ] **Step 2: Commit**

```bash
git add reto-en-vivo-3/workspace/HEARTBEAT.md
git commit -m "feat: add empty HEARTBEAT.md (cron jobs handle automation)"
```

---

### Task 9: MEMORY.md — Initial Patient Registry

**Files:**
- Create: `reto-en-vivo-3/workspace/MEMORY.md`

- [ ] **Step 1: Create MEMORY.md**

```markdown
# MEMORY.md — Pacientes Conocidos

> Este archivo lo mantiene Pérez automáticamente. Cada paciente que interactúa con el bot se registra aquí para recordarlo en futuras conversaciones.

## Registro de Pacientes

(Vacío — se llena conforme los pacientes escriben al bot)

<!-- Formato por paciente:
### [Nombre del Paciente]
- Telegram: @[usuario]
- Chat ID: [id numérico]
- Primera visita: [fecha]
- Última visita: [fecha]
- Historial: [lista de servicios y fechas]
- Notas: [preferencias, observaciones]
-->
```

- [ ] **Step 2: Create memory/ directory with placeholder**

```bash
mkdir -p reto-en-vivo-3/workspace/memory
```

Create `reto-en-vivo-3/workspace/memory/.gitkeep` (empty file to track the directory in git).

- [ ] **Step 3: Commit**

```bash
git add reto-en-vivo-3/workspace/MEMORY.md reto-en-vivo-3/workspace/memory/.gitkeep
git commit -m "feat: add MEMORY.md patient registry and memory directory"
```

---

### Task 10: Cron Jobs Configuration Script

**Files:**
- Create: `reto-en-vivo-3/cron-setup.sh`

- [ ] **Step 1: Create cron-setup.sh with all 4 cron job registration commands**

```bash
#!/bin/bash
# Cron Jobs for Pérez Dental Agent
# Run this after deploying workspace files to ~/.openclaw/workspace/

echo "📋 Registering cron jobs for Pérez..."

# 1. Recordatorio de citas — 24h antes (8PM daily)
openclaw cron add \
  --name "reminder-tomorrow" \
  --cron "0 20 * * *" \
  --tz "America/Mexico_City" \
  --session isolated \
  --message "Determina la fecha de hoy desde tu contexto. Revisa Google Calendar para las citas de MAÑANA. Por cada cita encontrada, envía un mensaje por Telegram al paciente (usa su Chat ID de memory/) con: '¡Hola [nombre]! 🐭 Te recuerdo que mañana tienes tu cita de [servicio] a las [hora] con [doctor]. ¿Nos vemos? Responde SI para confirmar o NO para reagendar.' Registra los recordatorios enviados en memory/ del día de hoy." \
  --announce

# 2. Resumen matutino para la Dra. (7:30AM Lun-Sáb)
openclaw cron add \
  --name "morning-brief" \
  --cron "30 7 * * 1-6" \
  --tz "America/Mexico_City" \
  --session isolated \
  --message "Determina la fecha de hoy desde tu contexto. Consulta Google Calendar para las citas de HOY. Arma un resumen con: hora, paciente, servicio, doctor asignado, y notas. Envía email a dramartinezcolmillo@gmail.com con asunto '🐭 Buenos días Dra. — Agenda del [fecha de hoy]'. Si no hay citas hoy, envía: 'Día libre Dra. ¡A descansar! 🐭'." \
  --announce

# 3. Follow-up post-tratamiento 7 días (11AM daily)
openclaw cron add \
  --name "post-treatment-followup" \
  --cron "0 11 * * *" \
  --tz "America/Mexico_City" \
  --session isolated \
  --message "Revisa los archivos en memory/ buscando citas agendadas cuya fecha fue hace exactamente 7 días y que NO estén marcadas como canceladas. Por cada una, envía un mensaje por Telegram al paciente (usa su Chat ID) con: '¡Hola [nombre]! 🐭 Ya pasó una semana desde tu [servicio]. ¿Cómo te has sentido? ¿Alguna molestia? Si todo está bien, nos ayudaría mucho tu reseña en Google: [usa GOOGLE_REVIEWS_URL de TOOLS.md]. ¡Tu opinión nos ayuda a seguir cuidando sonrisas! ⭐' Luego sugiere los productos recomendados de PRODUCTOS.md según el tratamiento. Registra en memory/ que se envió el follow-up." \
  --announce

# 4. Reporte mensual de ingresos (9AM día 1 de cada mes)
openclaw cron add \
  --name "monthly-revenue" \
  --cron "0 9 1 * *" \
  --tz "America/Mexico_City" \
  --session isolated \
  --message "Revisa todos los archivos memory/ del mes anterior. Extrae todos los tratamientos registrados (citas no canceladas). Cruza con los precios de CLINICA.md para calcular el ingreso estimado total. Arma un reporte con: total de ingresos, tratamientos más solicitados, cantidad de pacientes atendidos, e ingreso por doctor. Envía email a dramartinezcolmillo@gmail.com con asunto '🐭 Reporte de ingresos — [Mes Año]'." \
  --announce

echo "✅ Cron jobs registered. Verify with: openclaw cron list"
```

- [ ] **Step 2: Make executable**

```bash
chmod +x reto-en-vivo-3/cron-setup.sh
```

- [ ] **Step 3: Commit**

```bash
git add reto-en-vivo-3/cron-setup.sh
git commit -m "feat: add cron-setup.sh for 4 automated jobs"
```

---

### Task 11: Environment Variables Setup

**Files:**
- Create: `reto-en-vivo-3/env-setup.sh`

- [ ] **Step 1: Create env-setup.sh**

```bash
#!/bin/bash
# Environment setup for Pérez Dental Agent
# Adds required env vars to ~/.openclaw/.env

echo "🔐 Setting up environment variables..."

# Admin password for Dra. Martínez authentication
if ! grep -q "ADMIN_PASSWORD" ~/.openclaw/.env 2>/dev/null; then
  echo 'ADMIN_PASSWORD=colmillo2026' >> ~/.openclaw/.env
  echo "✅ ADMIN_PASSWORD added"
else
  echo "⚠️ ADMIN_PASSWORD already exists in .env"
fi

echo "✅ Environment setup complete."
echo "⚠️ Remember to change the default password!"
```

- [ ] **Step 2: Make executable and commit**

```bash
chmod +x reto-en-vivo-3/env-setup.sh
git add reto-en-vivo-3/env-setup.sh
git commit -m "feat: add env-setup.sh for admin password config"
```

---

### Task 12: Deployment Script & README Update

**Files:**
- Create: `reto-en-vivo-3/deploy.sh`
- Modify: `reto-en-vivo-3/README.md`

- [ ] **Step 1: Create deploy.sh**

```bash
#!/bin/bash
# Deploy Pérez Dental Agent to OpenClaw
# This overwrites the existing workspace!

set -e

WORKSPACE="$HOME/.openclaw/workspace"

echo "🐭 Deploying Pérez Dental Agent..."
echo "⚠️ This will overwrite files in $WORKSPACE"
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 1
fi

# Copy workspace files
cp workspace/IDENTITY.md "$WORKSPACE/"
cp workspace/SOUL.md "$WORKSPACE/"
cp workspace/USER.md "$WORKSPACE/"
cp workspace/AGENTS.md "$WORKSPACE/"
cp workspace/TOOLS.md "$WORKSPACE/"
cp workspace/HEARTBEAT.md "$WORKSPACE/"
cp workspace/CLINICA.md "$WORKSPACE/"
cp workspace/PRODUCTOS.md "$WORKSPACE/"
cp workspace/MEMORY.md "$WORKSPACE/"
mkdir -p "$WORKSPACE/memory"

echo "✅ Workspace files deployed."

# Setup env vars
bash env-setup.sh

# Install GOG skill if not present
if ! openclaw skills list 2>/dev/null | grep -q "gog"; then
  echo "📦 Installing GOG skill..."
  openclaw skills install gog
fi

# Register cron jobs
bash cron-setup.sh

# Restart gateway to pick up changes
echo "🔄 Restarting gateway..."
openclaw gateway restart

echo ""
echo "🐭 ¡Pérez está listo!"
echo "Send a message to your Telegram bot to test."
```

- [ ] **Step 2: Make executable**

```bash
chmod +x reto-en-vivo-3/deploy.sh
```

- [ ] **Step 3: Update README.md** to reflect the new agent (replace existing content with project description, setup instructions, and deployment guide)

- [ ] **Step 4: Final commit**

```bash
git add reto-en-vivo-3/deploy.sh reto-en-vivo-3/README.md
git commit -m "feat: add deploy.sh and update README for Pérez dental agent"
```

---

### Task 13: Verification Checklist

- [ ] **Step 1: Verify all files exist**

```bash
ls -la reto-en-vivo-3/workspace/
# Expected: IDENTITY.md, SOUL.md, USER.md, AGENTS.md, TOOLS.md, HEARTBEAT.md, CLINICA.md, PRODUCTOS.md, MEMORY.md, memory/
```

- [ ] **Step 2: Run deploy.sh to deploy to OpenClaw**

```bash
cd reto-en-vivo-3 && bash deploy.sh
```

- [ ] **Step 3: Verify cron jobs registered**

```bash
openclaw cron list
# Expected: 4 jobs (reminder-tomorrow, morning-brief, post-treatment-followup, monthly-revenue)
```

- [ ] **Step 4: Test bot via Telegram**

Send these test messages to the bot:
1. "Hola" → Should respond as Pérez with warm greeting
2. "Cuánto cuesta una limpieza?" → Should answer $800, 45 min, offer to schedule
3. "Me duele mucho una muela y estoy hinchado" → Should trigger urgency protocol
4. "Soy la Dra. Martínez" → Should ask for password

- [ ] **Step 5: Final commit with any fixes**

```bash
git add -A reto-en-vivo-3/
git commit -m "feat: complete Pérez dental agent implementation"
```
