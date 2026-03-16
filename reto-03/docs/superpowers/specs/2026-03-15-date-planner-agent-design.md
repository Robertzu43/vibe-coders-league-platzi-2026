# Planificador de Citas para Parejas — Design Spec

## Resumen

Un agente OpenClaw que cada lunes a las 8am analiza los calendarios ficticios de dos personas, encuentra los huecos libres en común durante la semana y envía por Telegram sugerencias de citas específicas (película, restaurante, actividad alternativa) para cada hueco disponible.

El objetivo es demostrar el uso de cron jobs, skills y delivery nativo de Telegram en OpenClaw para automatizar una tarea repetitiva con valor real.

## Stack Técnico

- **OpenClaw** — gateway self-hosted con cron scheduler y delivery nativo a Telegram
- **Skill `date-planner`** — instrucciones del agente para generar calendarios, encontrar huecos y sugerir planes
- **Cron job** — expresión `0 8 * * 1`, timezone `America/Bogota`, sesión aislada
- **Modelo** — Claude (Anthropic) vía configuración de OpenClaw
- **Datos** — calendarios ficticios generados dinámicamente por el agente en cada ejecución

No se usan APIs externas de calendario. Toda la data es inventada por el agente con variedad aleatoria en cada ejecución.

## Arquitectura

```
[Cron Job — Lunes 8:00am]
  schedule: "0 8 * * 1"
  tz: "America/Bogota"
  sessionTarget: isolated
        ↓
[Agente con skill: date-planner]
  Paso 1 — Generar calendarios ficticios
    → Crea eventos aleatorios para "Persona A" y "Persona B"
    → Tipos: reuniones de trabajo, gym, compromisos sociales, citas médicas
    → Cubre lunes a domingo de la semana actual
  Paso 2 — Encontrar huecos libres
    → Compara ambos calendarios
    → Filtra huecos de 2+ horas donde los dos están disponibles
    → Rango horario válido: 11:00am – 11:00pm
    → Máximo 3 huecos por semana (los más atractivos)
  Paso 3 — Sugerir planes específicos
    → Por cada hueco: película ficticia + restaurante con tipo de cocina + actividad alternativa
    → Tono: cálido, específico, accionable
    → Considera el horario para el tipo de plan (tarde vs. noche)
  Paso 4 — Formatear mensaje para Telegram
    → Emojis, estructura clara, fácil de leer en móvil
        ↓
[Delivery: Telegram]
  mode: announce
  channel: telegram
```

## Skill: `date-planner`

### Ubicación

```
~/.openclaw/skills/date-planner/
└── SKILL.md
```

### Contenido del SKILL.md

El skill contiene:

- **Instrucciones de generación de calendarios**: Cómo inventar eventos realistas con nombres, horarios y duraciones típicas. Variedad en cada ejecución para que las sugerencias sean distintas cada semana.
- **Criterios de selección de huecos**: Priorizar tardes de semana (4pm–8pm) y mañanas/tardes de fin de semana (11am–6pm). Mínimo 2 horas de duración.
- **Formato de sugerencias**: Cada plan incluye nombre específico (película con género, restaurante con tipo de cocina y ambiente), no categorías genéricas.
- **Formato de output Telegram**: Estructura con emojis, fecha y hora del hueco, las tres opciones (cine/teatro/plan, cena/café, alternativa).

### Ejemplo de output

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

## Cron Job

### Comando de instalación

```bash
openclaw cron add \
  --name "Planificador de Citas Semanal" \
  --cron "0 8 * * 1" \
  --tz "America/Bogota" \
  --session isolated \
  --message "Genera el plan de citas de esta semana. Inventa calendarios realistas con variedad para ambas personas, encuentra los mejores huecos libres en común y sugiere planes de cita específicos y concretos para cada uno." \
  --announce \
  --channel telegram
```

### JSON Schema equivalente

```json
{
  "name": "Planificador de Citas Semanal",
  "schedule": {
    "kind": "cron",
    "expr": "0 8 * * 1",
    "tz": "America/Bogota"
  },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "Genera el plan de citas de esta semana. Inventa calendarios realistas con variedad para ambas personas, encuentra los mejores huecos libres en común y sugiere planes de cita específicos y concretos para cada uno.",
    "lightContext": true
  },
  "delivery": {
    "mode": "announce",
    "channel": "telegram"
  }
}
```

## Estructura de Archivos del Proyecto

```
reto-03/
├── skills/
│   └── date-planner/
│       └── SKILL.md          ← Instrucciones del agente
├── setup.sh                  ← Script con el comando openclaw cron add
├── README.md                 ← Documentación del reto
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-03-15-date-planner-agent-design.md
```

## Configuración de OpenClaw requerida

1. **OpenClaw instalado** y gateway corriendo localmente
2. **Modelo configurado**: Anthropic Claude vía `openclaw onboard` o `openclaw models set`
3. **Canal Telegram conectado**: Canal configurado en `~/.openclaw/openclaw.json` bajo `channels.telegram`
4. **Skill instalado**: Directorio `date-planner/` copiado a `~/.openclaw/skills/`
5. **Cron registrado**: Ejecutar `setup.sh` para registrar el job

## Criterios de Éxito

1. El cron job se registra correctamente y aparece en `openclaw cron list`
2. Al ejecutar manualmente (`openclaw cron run <jobId>`), el agente genera calendarios ficticios distintos a los de la semana anterior
3. El mensaje llega a Telegram con el formato correcto (emojis, estructura, 3 sugerencias)
4. Las sugerencias son específicas (nombre de película, tipo de restaurante, actividad concreta) — no genéricas
5. El agente considera el horario para el tipo de plan (tarde → cine/museo, noche → cena/concierto)
6. El cron se dispara automáticamente cada lunes sin intervención manual
