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
