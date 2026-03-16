# Reto 3 — Date Planner con OpenClaw

> Vibe Coders League Platzi 2026

---

## El problema

Tú y tu pareja están usualmente muy ocupados. Entre reuniones, el gym, compromisos sociales y el agotamiento del día a día, coordinar una cita se convierte en otra tarea más en la lista. Y cuando finalmente encuentran un hueco, ya no queda energía para pensar qué hacer.

**Date Planner** es un agente OpenClaw que resuelve exactamente eso. Cada lunes a las 8am, sin que nadie se lo pida, analiza las agendas de ambos, encuentra los momentos libres en común durante la semana y envía por Telegram sugerencias concretas: una película específica, un restaurante con ambiente, una alternativa si no hay ganas de salir. Todo listo. Solo tienen que elegir.

---

## Objetivo

Eliminar la fricción de planear citas cuando las dos personas están ocupadas, usando automatización inteligente para que la relación no quede en segundo plano por falta de tiempo o energía para organizarse.

---

## Cómo funciona

Cada lunes a las 8am el agente:

1. **Genera las agendas de la semana** — eventos de trabajo, gym y compromisos sociales para ambas personas
2. **Encuentra los huecos libres** — busca momentos donde los dos están disponibles por al menos 2 horas (11am–11pm)
3. **Sugiere planes específicos por horario** — si es tarde: museo, café, actividad cultural. Si es noche: película con título real, restaurante con tipo de cocina y ambiente
4. **Envía el resumen a Telegram** — directo al chat, formateado, listo para usar

---

## Ejemplo de output

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

---

## Especificaciones técnicas

| Componente | Tecnología |
|------------|------------|
| Gateway | OpenClaw (self-hosted, Node.js) |
| Scheduler | OpenClaw Cron — `0 8 * * 1` (lunes 8am, America/Bogota) |
| Skill | AgentSkills format (`SKILL.md`) |
| Modelo | Google Gemini 2.5 Flash |
| Delivery | Telegram bot nativo via OpenClaw |
| Sesión | Isolated (sin contexto previo, resultados frescos cada semana) |
| Datos | Generados dinámicamente por el agente en cada ejecución |

**Sin APIs de calendario.** El agente inventa agendas realistas con variedad cada semana, lo que garantiza sugerencias siempre diferentes.

---

## Instalación

```bash
# Prerrequisitos: OpenClaw instalado, Gemini API key configurada, bot de Telegram conectado
cd reto-03
bash setup.sh
```

El script instala el skill y registra el cron job en un solo paso. Para probar sin esperar al lunes:

```bash
openclaw cron run <jobId>
```

---

## Estructura

```
reto-03/
├── skills/
│   └── date-planner/
│       └── SKILL.md      ← Instrucciones del agente
├── setup.sh              ← Instalación en un comando
└── README.md
```

---

## Por qué esto importa

La productividad personal ha sido el caso de uso dominante de la automatización: tareas, recordatorios, resúmenes de trabajo, reportes. Pero hay algo que también necesita atención y que dejamos para después: **las personas que más queremos**.

No todo lo importante es urgente. Una cita no tiene deadline. No genera notificaciones. No aparece en el backlog. Y precisamente por eso se va postergando hasta que el tiempo libre existe pero ya no hay energía ni ideas para aprovecharlo.

Este proyecto parte de una pregunta simple: **¿qué pasaría si aplicamos la misma lógica de automatización a algo tan humano como una cita?**

No para reemplazar la conexión — sino para quitarle la fricción. Para que cuando llegue el lunes, la pregunta no sea "¿cuándo podemos vernos?" sino "¿a cuál de estas opciones vamos?".

Automatizar no es deshumanizar. A veces es exactamente lo contrario: es crear las condiciones para que lo humano suceda.

---

## Estado

- [x] En progreso
- [x] Completado
