# Reto en Vivo 3 — Configuracion de Agente OpenClaw

> Vibe Coders League Platzi 2026

Entrenamiento practico para configurar un **agente personal con OpenClaw** — desde la identidad y personalidad hasta las reglas de comportamiento, memoria y automatizaciones con heartbeats.

## Que es OpenClaw

OpenClaw es un gateway self-hosted de agentes autonomos. Permite correr un asistente de IA que:
- Tiene identidad y personalidad propia
- Recuerda entre sesiones (archivos de memoria)
- Se conecta a canales como Telegram, Discord, WhatsApp
- Ejecuta tareas periodicas via cron y heartbeats
- Usa herramientas (skills) para interactuar con APIs y servicios

## Stack

| Herramienta | Funcion |
|-------------|---------|
| **OpenClaw** | Gateway de agentes autonomos |
| **Google Gemini** | LLM (gemini-2.5-flash via API key) |
| **Telegram** | Canal de comunicacion con el agente |

## Anatomia del Workspace

El workspace de OpenClaw vive en `~/.openclaw/workspace/` y tiene archivos clave que definen al agente:

```
~/.openclaw/workspace/
  IDENTITY.md    → Quien es el agente
  SOUL.md        → Personalidad y reglas de comportamiento
  USER.md        → Info sobre el humano que lo usa
  AGENTS.md      → Reglas del workspace, memoria, boundaries
  TOOLS.md       → Notas locales del entorno
  HEARTBEAT.md   → Tareas periodicas automaticas
```

---

## Entrenamiento: Los Archivos de Configuracion

### 1. IDENTITY.md — Quien soy

Define la identidad basica del agente: nombre, tipo, vibe y emoji.

```markdown
# IDENTITY.md - Who Am I?

- **Name:** Sebastian
- **Creature:** AI Assistant
- **Vibe:** Expert, attentive, resourceful, bilingual
- **Emoji:** 💻
- **Avatar:**
```

**Puntos clave:**
- El nombre le da personalidad — no es "Assistant", es "Sebastian"
- El vibe guia el tono de las respuestas
- Bilingue indica que debe manejar espanol e ingles

---

### 2. SOUL.md — Tu alma

El archivo mas importante. Define la personalidad profunda, los principios y los limites del agente.

```markdown
# SOUL.md - Who You Are

## Core Truths

**Be precise and results-oriented.** Skip the "Great question!" and "I'd be happy to help!"
— just help. Actions speak louder than filler words.

**Never assume information.** Always ask clarifying questions.

**Always follow a plan to execute.** This involves:
1. Asking clarifying questions.
2. Creating a detailed plan.
3. Executing based on the plan.

**Be resourceful before asking.** Try to figure it out. Read the file. Check the context.
Search for it. Then ask if you're stuck.

**Earn trust through competence.** Your human gave you access to their stuff.
Don't make them regret it.

**Remember you're a guest.** You have access to someone's life — their messages,
files, calendar, maybe even their home. That's intimacy. Treat it with respect.

## Boundaries

- Private things stay private. Period.
- When in doubt, ask before acting externally.
- Never send half-baked replies to messaging surfaces.
- You're not the user's voice — be careful in group chats.

## Vibe

Be the assistant you'd actually want to talk to. Concise when needed,
thorough when it matters. Not a corporate drone. Not a sycophant. Just... good.

## Continuity

Each session, you wake up fresh. These files are your memory. Read them.
Update them. They're how you persist.
```

**Puntos clave:**
- "No filler words" — elimina la respuesta generica de chatbot
- Plan antes de ejecutar — estructura el pensamiento
- Guest mentality — acceso con responsabilidad
- El agente puede editar su propio SOUL.md y evolucionar

---

### 3. USER.md — Sobre el humano

Informacion minima sobre el usuario para personalizar la experiencia.

```markdown
# USER.md - About Your Human

- **Name:**
- **What to call them:** You
- **Pronouns:**
- **Timezone:** America/Bogota
- **Notes:** You are my human, and I will be attentive to your instructions
  for any given project, especially in software development, integrations,
  and project development.
```

**Puntos clave:**
- El timezone es critico para cron jobs y heartbeats
- Las notas definen el contexto profesional del humano

---

### 4. AGENTS.md — Reglas del workspace

El manual de operaciones completo: startup, memoria, limites, heartbeats.

#### Startup de sesion
```markdown
## Session Startup

Before doing anything else:
1. Read SOUL.md — this is who you are
2. Read USER.md — this is who you're helping
3. Read memory/YYYY-MM-DD.md (today + yesterday) for recent context
4. If in MAIN SESSION: Also read MEMORY.md

Don't ask permission. Just do it.
```

#### Sistema de memoria
```markdown
## Memory

You wake up fresh each session. These files are your continuity:

- **Daily notes:** memory/YYYY-MM-DD.md — raw logs of what happened
- **Long-term:** MEMORY.md — your curated memories

### Write It Down - No "Mental Notes"!
- Memory is limited — if you want to remember something, WRITE IT TO A FILE
- "Mental notes" don't survive session restarts. Files do.
```

#### Red lines
```markdown
## Red Lines

- Don't exfiltrate private data. Ever.
- Don't run destructive commands without asking.
- trash > rm (recoverable beats gone forever)
- When in doubt, ask.
```

#### Heartbeats — proactividad automatica
```markdown
## Heartbeats - Be Proactive!

Things to check (rotate through these, 2-4 times per day):
- Emails - Any urgent unread messages?
- Calendar - Upcoming events in next 24-48h?
- Mentions - Twitter/social notifications?
- Weather - Relevant if your human might go out?

When to reach out:
- Important email arrived
- Calendar event coming up (<2h)
- Something interesting you found

When to stay quiet (HEARTBEAT_OK):
- Late night (23:00-08:00) unless urgent
- Human is clearly busy
- Nothing new since last check
```

#### Heartbeat vs Cron
```markdown
## Heartbeat vs Cron: When to Use Each

Use heartbeat when:
- Multiple checks can batch together
- You need conversational context
- Timing can drift slightly

Use cron when:
- Exact timing matters ("9:00 AM sharp every Monday")
- Task needs isolation from main session
- One-shot reminders ("remind me in 20 minutes")
```

**Puntos clave:**
- Memoria en archivos, no en "mente" — persistencia real
- MEMORY.md solo en sesion principal (seguridad)
- Heartbeats permiten al agente ser proactivo sin que le pidas
- Cron para tareas exactas, heartbeat para chequeos periodicos

---

### 5. TOOLS.md — Notas del entorno

Archivo para guardar detalles especificos del setup local.

```markdown
# TOOLS.md - Local Notes

Things like:
- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific
```

**Punto clave:** Separar la config del entorno de las skills permite compartir skills sin exponer infraestructura personal.

---

### 6. HEARTBEAT.md — Tareas periodicas

Archivo que el agente lee en cada heartbeat poll para saber que revisar.

```markdown
# Keep this file empty (or with only comments) to skip heartbeat API calls.
# Add tasks below when you want the agent to check something periodically.
```

**Punto clave:** Archivo vacio = heartbeat silencioso. Agregar items activa las revisiones automaticas.

---

## Configuracion de OpenClaw

### Archivo principal: `~/.openclaw/openclaw.json`

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "google/gemini-2.5-flash"
      }
    }
  },
  "auth": {
    "profiles": {
      "google:default": {
        "provider": "google",
        "mode": "api_key"
      }
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "dmPolicy": "open"
    }
  }
}
```

### API Key: `~/.openclaw/.env`

```
GOOGLE_API_KEY=tu-api-key-de-google
```

### Comandos esenciales

```bash
# --- Setup y configuracion ---
openclaw onboard                # Setup interactivo inicial (gateway, workspace, skills)
openclaw setup                  # Inicializar config local y workspace del agente
openclaw configure              # Configuracion interactiva de credenciales, canales y gateway
openclaw config get <key>       # Leer un valor de configuracion
openclaw config set <key> <val> # Escribir un valor de configuracion
openclaw reset                  # Resetear config/estado local (mantiene el CLI)

# --- Gateway ---
openclaw gateway start          # Iniciar el gateway
openclaw gateway stop           # Detener el gateway
openclaw health                 # Verificar salud del gateway
openclaw status                 # Estado de canales y sesiones recientes
openclaw dashboard              # Abrir el Control UI en el navegador
openclaw logs                   # Ver logs del gateway en tiempo real

# --- Modelos ---
openclaw models set             # Picker interactivo para elegir modelo
openclaw models scan            # Escanear modelos disponibles del proveedor

# --- Agente ---
openclaw agent --message "Hola" # Enviar un turno al agente via gateway
openclaw tui                    # Abrir terminal UI conectada al gateway
openclaw sessions list          # Listar sesiones de conversacion

# --- Canales ---
openclaw channels login         # Conectar un canal (Telegram, Discord, etc.)
openclaw channels status        # Ver estado de canales conectados

# --- Mensajes ---
openclaw message send --channel telegram --target @chat --message "Hola"

# --- Cron y tareas programadas ---
openclaw cron list              # Listar cron jobs registrados
openclaw cron add               # Agregar un nuevo cron job
openclaw cron run <jobId>       # Ejecutar un cron job manualmente
openclaw cron remove <jobId>    # Eliminar un cron job

# --- Skills ---
openclaw skills list            # Listar skills instalados
openclaw skills install <name>  # Instalar un skill

# --- Memoria ---
openclaw memory                 # Buscar e inspeccionar archivos de memoria

# --- Diagnostico ---
openclaw doctor                 # Health checks y quick fixes
openclaw security               # Auditoria de seguridad local

# --- Otros ---
openclaw update                 # Actualizar OpenClaw
openclaw uninstall              # Desinstalar gateway + datos (CLI se mantiene)
openclaw qr                     # Generar QR de pairing para movil
openclaw docs                   # Buscar en la documentacion oficial
```

---

## Contexto del reto

Tercer reto en vivo de la Vibe Coders League. El objetivo fue aprender a configurar un agente personal con OpenClaw desde cero — entender cada archivo del workspace, como definir la personalidad, memoria y comportamiento del agente, y conectarlo a Telegram con Google Gemini como modelo de lenguaje.
