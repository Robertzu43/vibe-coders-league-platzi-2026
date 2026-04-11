# Vibe Coders League - Platzi 2026

> 13 retos + 3 retos en vivo. 16 proyectos. Un camino completo por el mundo de la IA aplicada al desarrollo.

## Para la Comunidad Platzi

Este repositorio queda abierto como **evidencia, referencia y punto de partida** para toda la comunidad de Platzi. La **Vibe Coders League 2026** es la liga donde los developers aprenden a construir con IA como herramienta central de su flujo de trabajo — y este repo documenta ese proceso completo.

**Si eres participante de la Vibe Coders League:**
- Explora los retos para ver enfoques distintos al tuyo
- Cada README documenta las decisiones de diseno y las herramientas usadas
- Usa lo que te sirva como inspiracion para tus propios proyectos

**Si quieres colaborar:**
- Haz fork del repo y mejora cualquier reto
- Abre un issue si encuentras algo que se pueda mejorar
- Comparte tu propia version de los retos

**Si estas aprendiendo sobre IA aplicada al desarrollo:**
- Los retos van de lo simple a lo complejo — son un buen recorrido de aprendizaje
- Cada proyecto muestra un caso de uso real de IA distinto
- La documentacion de los retos 12 y 13 es especialmente util para entender prompt engineering y system prompt design

La liga de vibecoders de Platzi 2026 es de todos. Construyamos juntos.

---

## Y asi fue como hice los retos

Cada reto explora una dimension distinta de la IA aplicada: desde landing pages con animaciones hasta agentes conversacionales, desde automatizaciones empresariales hasta generacion de video e imagen con IA, desde prompt engineering hasta diseno de system prompts para chatbots personalizados. Los **retos en vivo** extienden el recorrido con desafios resueltos en tiempo real durante sesiones de la liga.

**Todo fue construido principalmente con [Claude Code](https://claude.ai/claude-code)** como copiloto de desarrollo — planeacion, arquitectura, implementacion, revision y documentacion. Este repo demuestra que el vibe coding no es solo escribir codigo con IA: es pensar, disenar y construir con ella.

---

## Los 13 Retos

| # | Reto | Categoria |
|---|------|-----------|
| 01 | [Vibecode Summit Colombia](./reto-01) | Web App / Landing Page |
| 02 | [Music DNA Dashboard](./reto-02) | Web App / Data Visualization |
| 03 | [Date Planner](./reto-03) | AI Agent / Automation |
| 04 | [Commute Buddy](./reto-04) | Automation / Notification Bot |
| 05 | [Restaurant Inventory Automation](./reto-05) | Business Automation / AI Workflow |
| 06 | [AI Video Generation con HeyGen](./reto-06) | AI Video Generation |
| 07 | [AI Image Generation con Nano Banana](./reto-07) | AI Image Generation |
| 08 | [AI Product Photography con Nano Banana](./reto-08) | AI Product Photography |
| 09 | [AI Video Generation: Trailer Cinematografico con HeyGen](./reto-09) | AI Video Generation |
| 10 | [ByteNest Chat Agent](./reto-10) | AI Chatbot / Web App |
| 11 | [Agente Interno Sierra Dorada Coffee](./reto-11) | AI Chatbot / Telegram Bot |
| 12 | [Prompt Engineering: De generico a preciso](./reto-12) | Documentacion / Prompt Engineering |
| 13 | [System Prompt Design: Professor AI](./reto-13) | Documentacion / System Prompt Design |

---

## Retos en Vivo

| # | Reto | Categoria |
|---|------|-----------|
| 01 | [LicitaPro](./reto-en-vivo-1) | Landing Page / Lovable |
| 02 | [Commute Buddy v3 Multi-usuario](./reto-en-vivo-2) | Automation / Make.com |
| 03 | [Perez: Agente Dental con OpenClaw](./reto-en-vivo-3) | AI Agent / OpenClaw |

---

## Stack de Herramientas

### Modelos de IA y LLMs

| Herramienta | Que hace | Retos |
|---|---|---|
| **Claude (Anthropic)** | LLM principal para desarrollo, generacion de contenido y agentes conversacionales | 05, 10, 12 |
| **Claude Code** | Copiloto de desarrollo — planeacion, codigo, revision, documentacion | Todos |
| **Google Gemini** | LLM para agentes autonomos y Gemas personalizadas | 03, 13, En Vivo 3 |
| **Cloudflare Workers AI (Llama 3)** | LLM on-platform para chatbot interno | 11 |

### Generacion de Contenido con IA

| Herramienta | Que hace | Retos |
|---|---|---|
| **HeyGen** | Video Agent, avatares personalizados, clonacion de voz | 06, 09 |
| **Nano Banana** | Generacion de imagenes, fotografia de producto, storytelling visual | 07, 08 |

### Frameworks y Plataformas Web

| Herramienta | Que hace | Retos |
|---|---|---|
| **Astro** | Framework web para landing pages y apps con SSR | 01, 02, 10 |
| **React** | Componentes interactivos (chat) | 10 |
| **Cloudflare Workers / Pages** | Hosting, SSR, deployment | 02, 10, 11 |
| **GSAP + ScrollTrigger** | Animaciones scroll-driven | 01, 02 |
| **TypeScript** | Tipado estatico | 02, 11 |

### Automatizacion y Bots

| Herramienta | Que hace | Retos |
|---|---|---|
| **Make.com** | Orquestacion de automatizaciones no-code | 04, 05, En Vivo 2 |
| **OpenClaw** | Gateway de agentes autonomos con cron, heartbeat y skills | 03, En Vivo 3 |
| **grammY** | Framework para bots de Telegram | 11 |
| **Telegram Bot API** | Entrega de mensajes y webhooks | 03, 11, En Vivo 3 |
| **Twilio / WhatsApp Business** | Notificaciones por WhatsApp y SMS | 04, 05, En Vivo 2 |

### APIs y Servicios Externos

| Herramienta | Que hace | Retos |
|---|---|---|
| **Square POS** | Webhooks de ordenes de venta | 05 |
| **Google Sheets** | Almacenamiento de inventario y datos | 05, En Vivo 2 |
| **Google Forms** | Registro de usuarios | En Vivo 2 |
| **OpenWeatherMap** | Pronostico de lluvia | 04, En Vivo 2 |
| **X / Twitter API** | Monitoreo de tweets de TransMilenio | 04 |
| **Google Calendar** | Gestion de citas y disponibilidad | En Vivo 3 |
| **Gmail API** | Envio de emails automaticos (resumenes, alertas, reportes) | En Vivo 3 |
| **Lovable** | Generacion de landing pages con IA | En Vivo 1 |

---

## Estructura del Repositorio

```
Vibe-Coders-League-Platzi-2026/
  reto-01/     Vibecode Summit Colombia (Astro, GSAP)
  reto-02/     Music DNA Dashboard (Astro, Cloudflare Pages)
  reto-03/     Date Planner (OpenClaw, Gemini, Telegram)
  reto-04/     Commute Buddy (Make.com, Twilio, WhatsApp)
  reto-05/     Restaurant Inventory (Make.com, Claude, Square)
  reto-06/     AI Video Generation (HeyGen)
  reto-07/     AI Image Generation (Nano Banana)
  reto-08/     AI Product Photography (Nano Banana)
  reto-09/     AI Trailer Cinematografico (HeyGen)
  reto-10/     ByteNest Chat Agent (Astro, React, Claude API)
  reto-11/     Sierra Dorada Coffee Bot (grammY, Cloudflare Workers AI)
  reto-12/     Prompt Engineering (Documentacion)
  reto-13/     System Prompt Design (Documentacion, Gemini Gem)
  reto-en-vivo-1/  LicitaPro (Lovable, Landing Page, Conversation Log)
  reto-en-vivo-2/  Commute Buddy v3 Multi-usuario (Make.com, Twilio SMS)
  reto-en-vivo-3/  Perez: Agente Dental (OpenClaw, Gemini, Telegram, Google Calendar, Gmail)
```

Cada carpeta es un proyecto independiente con su propio README, stack y documentacion.

---

## Autor

Desarrollado por **Roberto Zuniga** con **Claude Code** como copiloto principal de desarrollo.

Platzi Vibe Coders League 2026.
