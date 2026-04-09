# Reto 04 — Commute Buddy v3: Multi-usuario con Google Forms + SMS

**Goal:** Servicio automatizado donde cualquier persona llena un Google Form y recibe un SMS personalizado antes de salir al trabajo con el clima en Bogotá y alertas de TransMilenio en sus estaciones.

**Tech Stack:** Make (no-code), Google Forms, Google Sheets, OpenWeatherMap API (free), MacroDroid (Android, gratis), Twilio SMS.

---

## Arquitectura completa

### Escenario 1: "TransMilenio — Receptor de alertas"

```
[Android: Canal WhatsApp TransMilenio publica alerta]
    → [MacroDroid: captura notificación, extrae texto]
    → [HTTP POST al webhook de Make: {"text": "..."}]
    → [Make Webhook: recibe el JSON]
    → [Google Sheets Add Row → hoja "Alertas_TM": timestamp + mensaje]
```

**Siempre activo** — cada vez que TransMilenio publica en su canal de WhatsApp, MacroDroid lo captura y lo guarda en Google Sheets automáticamente.

### Escenario 2: "Commute Buddy v3 — Multi-usuario" (8 módulos)

```
[Módulo 3: Google Sheets Search Rows — hoja "Usuarios"]
    Lee todos los usuarios registrados via Google Forms.
    Emite 1 bundle por usuario.

→ [Módulo 4: Google Sheets Search Rows — hoja "Log"]
    Busca si ya se envió SMS a este usuario hoy.
    Filtro: nombre = nombre del usuario AND timestamp contiene fecha de hoy.
    Si encuentra filas = ya se envió, el flujo se detiene para este usuario.

→ [Módulo 9: HTTP Request — OpenWeatherMap]
    GET https://api.openweathermap.org/data/2.5/forecast
    Parámetros: lat=4.6534, lon=-74.0836 (Bogotá), units=metric, lang=es, cnt=3
    Retorna pronóstico de las próximas horas: temperatura, probabilidad de lluvia, descripción.

→ [Módulo 11: Tools Set Multiple Variables — Variables de clima]
    clima_temp = round(temperatura del próximo periodo de 3h)
    clima_pop = round(probabilidad de precipitación × 100)
    clima_desc = descripción del clima en español

→ [Módulo 16: Google Sheets Search Rows — hoja "Alertas_TM"]
    Busca alertas de TransMilenio de hoy.
    Filtro: timestamp contiene fecha de hoy.
    Retorna los mensajes del canal de WhatsApp de TransMilenio capturados por MacroDroid.

→ [Módulo 18: Tools Set Multiple Variables — Variables de TransMilenio]
    tm_alertas_texto = texto de la primera alerta encontrada (columna B)
    tm_count = cantidad total de alertas de hoy

→ [Módulo 19: Tools Set Variable — Componer SMS]
    sms_body = "Hola {nombre}! Temp: {clima_temp}C, lluvia: {clima_pop}%.
               {si tm_count > 0: 'Alerta TM: ' + alerta; si no: 'Estaciones Ok.'}"

→ [Módulo 23: Twilio Create a Message — Enviar SMS]
    From: +16812812728 (número Twilio)
    To: celular del usuario (columna C de hoja Usuarios)
    Body: variable sms_body
```

---

## Google Sheets: "Commute Buddy — Datos"

### Hoja: Usuarios (llenada por Google Forms)
| Col | Campo | Ejemplo |
|-----|-------|---------|
| A | timestamp | 4/2/2026 10:51:12 |
| B | nombre | Roberto |
| C | celular | +573015370828 |
| D | hora_salida | 7:00:00 AM |
| E | estaciones | Calle 170, Calle 127, Pepe Sierra |
| F | estacion_otra | |

### Hoja: Alertas_TM (llenada por escenario receptor)
| Col | Campo | Ejemplo |
|-----|-------|---------|
| A | timestamp | 2026-04-02 06:25:00 |
| B | mensaje | ⏰ #TMAhora (6:25 a.m.) 📍 Estación Pepe Sierra 🚨 Persona en situación médica... |

### Hoja: Log (llenada por escenario principal)
| Col | Campo |
|-----|-------|
| A | timestamp |
| B | nombre |
| C | celular |
| D | clima_temp |
| E | clima_pop |
| F | clima_desc |
| G | tm_alertas |
| H | mensaje_enviado |

---

## Google Form: "🚍 Commute Buddy — Registro"

Campos:
1. **¿Cuál es tu nombre?** — Respuesta corta, obligatorio
2. **¿Cuál es tu número de celular?** — Respuesta corta, validación regex `^\+[0-9]{10,15}$`, obligatorio
3. **¿A qué hora sales al trabajo?** — Hora, obligatorio
4. **¿Qué estaciones de TransMilenio frecuentas?** — Checkboxes con todas las estaciones de la red troncal (37 opciones), obligatorio
5. **Si seleccionaste "Otra"** — Respuesta corta, opcional

---

## MacroDroid (Android)

**Macro:** "TransMilenio → Make"

- **Trigger:** Notification Received → App: WhatsApp → Text Contains: "TransMilenio"
- **Action:** HTTP Request
  - Method: POST
  - URL: `https://hook.us2.make.com/ftych4ou5mrwn7pv6961txj4d2r71b64`
  - Content-Type: `application/json`
  - Body: `{"text": "{notification_text}"}`

Cada vez que el canal de WhatsApp de TransMilenio (`https://whatsapp.com/channel/0029VaRe8rACRs1htLOKee21`) publica un mensaje, MacroDroid lo intercepta y lo envía al webhook de Make.

---

## Bugs conocidos en el blueprint actual

1. **Módulo 4 (Log):** Filtro usa `{{3.`1`}}` (timestamp) para comparar nombre — debería usar `{{3.`2`}}` (nombre/columna B)
2. **Módulo 18 (TM vars):** `tm_alertas_texto` usa `{{16.`1`}}` (timestamp) — debería usar `{{16.`2`}}` (mensaje/columna B)
3. **Módulo 19 (sms_body):** `{{3.`1`}}` mapea timestamp — debería usar `{{3.`2`}}` (nombre)
4. **Filtro de estaciones:** No implementado en el blueprint — el módulo 16 trae todas las alertas del día sin filtrar por las estaciones del usuario
5. **Filtro de ventana de tiempo:** Removido para testing — sin él, el SMS se envía a cualquier hora
6. **Log de envíos:** No implementado — no hay módulo Add Row después de Twilio

---

## Pendientes para producción

- [ ] Corregir mapeos de columnas (bugs 1-3 arriba)
- [ ] Agregar filtro entre módulo 16 y 18: "Alerta menciona estaciones del usuario" — Matches pattern con `{{replace(3.`5`; ", "; "|")}}`
- [ ] Reactivar módulo 8 (Set Variables hora) y filtro de ventana de tiempo
- [ ] Agregar módulo Google Sheets Add Row después de Twilio para log
- [ ] Agregar error handlers (Resume) en módulos 9, 16 y 23
- [ ] Configurar Schedule: cada 10 min, L-V, 5:00-9:00am, America/Bogota
- [ ] Upgradear Twilio para quitar prefijo trial y habilitar emojis

---

## Costos

| Servicio | Costo |
|----------|-------|
| Google Forms + Sheets | Gratis |
| Make (2 escenarios) | Gratis (1,000 ops/mes) |
| OpenWeatherMap | Gratis |
| MacroDroid | Gratis |
| Canal WhatsApp TransMilenio | Gratis |
| Twilio SMS | Trial gratis ($8 crédito) |
| **Total** | **$0/mes** |
