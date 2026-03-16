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

Este es el contenido exacto del archivo `SKILL.md`:

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
    "message": "Genera el plan de citas de esta semana. Inventa calendarios realistas con variedad para ambas personas, encuentra los mejores huecos libres en común y sugiere planes de cita específicos y concretos para cada uno."
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
3. El mensaje llega a Telegram con el formato correcto (emojis, estructura, hasta 3 sugerencias)
4. Las sugerencias son específicas (nombre de película, tipo de restaurante, actividad concreta) — no genéricas
5. El agente considera el horario para el tipo de plan (tarde → cine/museo, noche → cena/concierto)
6. El cron se dispara automáticamente cada lunes sin intervención manual
