# Reto en Vivo 3 — Pérez: Agente Dental con OpenClaw 🐭

> Vibe Coders League Platzi 2026

Agente de OpenClaw que funciona como **recepcionista virtual** para la Clínica Dental Martínez. Atiende pacientes por Telegram, agenda citas con Google Calendar, detecta urgencias dentales, y genera reportes automáticos para la doctora.

## El Problema

La Dra. Martínez tiene una clínica dental con 3 doctores. Los pacientes llaman y escriben para agendar citas, preguntar precios, cancelar y saber si atienden urgencias. Su recepcionista no da abasto y están perdiendo pacientes porque no contestan a tiempo.

## La Solución: Pérez 🐭

Un agente de OpenClaw llamado **Pérez** (guiño al Ratón Pérez) con personalidad cálida y cercana que:

- Responde preguntas frecuentes (servicios, precios, horarios)
- Agenda citas revisando disponibilidad en Google Calendar
- Detecta urgencias dentales y responde con protocolo especial
- Envía recordatorio al paciente 24h antes de su cita
- Envía resumen matutino a la Dra. por email cada mañana
- Hace follow-up 7 días post-tratamiento y pide reseña en Google
- Recomienda productos de cuidado dental según el tratamiento
- Genera reporte mensual de ingresos estimados por email
- Permite a la Dra. autenticarse con contraseña para acceder a reportes

## Stack

| Herramienta | Función |
|-------------|---------|
| **OpenClaw** | Gateway de agentes autónomos |
| **Google Gemini 2.5 Flash** | LLM (via API key) |
| **Telegram** | Canal de comunicación con pacientes |
| **Google Calendar** | Gestión de citas (via skill GOG) |
| **Gmail** | Emails a la Dra. Martínez (via skill GOG) |

## Estructura del Proyecto

```
reto-en-vivo-3/
  workspace/              → Archivos del workspace de OpenClaw
    IDENTITY.md           → Identidad de Pérez (nombre, vibe, emoji)
    SOUL.md               → Personalidad, protocolos, flujos de conversación
    USER.md               → Perfil de la Dra. Martínez
    AGENTS.md             → Reglas operativas, memoria, autenticación
    TOOLS.md              → Configuración de entorno
    HEARTBEAT.md          → Vacío (usamos cron jobs)
    CLINICA.md            → Catálogo de servicios, precios, doctores, horarios
    PRODUCTOS.md          → Recomendaciones post-tratamiento
    MEMORY.md             → Registro de pacientes conocidos
    memory/               → Logs diarios de operaciones
  deploy.sh               → Script de despliegue completo
  cron-setup.sh           → Registro de 4 cron jobs automáticos
  env-setup.sh            → Configuración de variables de entorno
  docs/superpowers/
    specs/                → Documento de diseño (spec)
    plans/                → Plan de implementación
```

## Despliegue Rápido

```bash
cd reto-en-vivo-3
bash deploy.sh
```

El script:
1. Copia los archivos del workspace a `~/.openclaw/workspace/`
2. Configura la variable de entorno `ADMIN_PASSWORD`
3. Instala la skill GOG (Google Workspace) si no está
4. Registra los 4 cron jobs
5. Reinicia el gateway

## Cron Jobs Automáticos

| Job | Horario | Función |
|-----|---------|---------|
| `reminder-tomorrow` | 8:00 PM diario | Recordatorio 24h antes al paciente |
| `morning-brief` | 7:30 AM Lun-Sáb | Resumen del día por email a la Dra. |
| `post-treatment-followup` | 11:00 AM diario | Follow-up 7 días + reseña Google + productos |
| `monthly-revenue` | 9:00 AM día 1/mes | Reporte de ingresos por email |

## Probar el Bot

Envía estos mensajes al bot de Telegram:

| Mensaje | Respuesta esperada |
|---------|-------------------|
| "Hola" | Saludo cálido de Pérez |
| "Cuánto cuesta una limpieza?" | $800 MXN, 45 min + oferta de agendar |
| "Quiero agendar una cita" | Pide nombre, servicio, ofrece horarios |
| "Me duele mucho una muela" | Protocolo de urgencia activado |
| "Soy la Dra. Martínez" | Pide contraseña de autenticación |

## Features Creativos

### 1. Follow-up Post-Tratamiento + Reseña Google
7 días después de cada cita, Pérez contacta al paciente para preguntar cómo se siente y le pide una reseña en Google si todo está bien.

### 2. Recomendación de Productos
Después del follow-up, Pérez sugiere productos de cuidado dental específicos para el tratamiento que se realizó, con precios y dónde comprarlos.

### 3. Reporte Mensual de Ingresos
El día 1 de cada mes, Pérez calcula los ingresos estimados del mes anterior basado en las citas registradas y envía un reporte desglosado por doctor a la Dra. por email.
