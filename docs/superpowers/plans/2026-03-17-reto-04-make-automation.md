# Reto 04 — Commute Buddy: Make Automation

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatización en Make que cada mañana revisa clima y estado de estaciones de TransMilenio, y envía un WhatsApp por Twilio solo si hay lluvia o alertas activas en las estaciones configuradas.

**Architecture:** Flujo secuencial: Schedule → Google Sheets (leer config) → HTTP Weather → Set Variable (guardar pop/descripción) → HTTP Twitter → Set Variable (guardar result_count) → Router → Ruta 1 con Filter (lluvia >60% OR tweets >0): componer mensaje + Twilio + log "Sí" / Ruta 2 fallback (sin filtro): log "No". Las llamadas de Weather y Twitter son secuenciales, no ramas del Router. El Router solo bifurca el sí/no del filtro. El blueprint exportado más archivos de soporte se commitean al repo.

**Tech Stack:** Make (no-code), Google Sheets, OpenWeatherMap API (free), X API v2 (Basic $200/mes — ver alternativa gratuita en Notas), Twilio WhatsApp Sandbox.

---

## File Map

| Archivo | Propósito |
|---------|-----------|
| `reto-04/blueprint.json` | Escenario Make exportado — importar para replicar |
| `reto-04/sheets/config-template.csv` | Template de la hoja "Configuración" con datos de ejemplo |
| `reto-04/sheets/log-template.csv` | Template de la hoja "Log" (cabeceras) |
| `reto-04/.env.example` | Documentación de credenciales requeridas (Make las gestiona internamente) |
| `reto-04/README.md` | Setup completo end-to-end para alguien sin contexto |

---

## Task 1: Crear archivos base del repo

**Files:**
- Create: `reto-04/.env.example`
- Create: `reto-04/sheets/config-template.csv`
- Create: `reto-04/sheets/log-template.csv`

- [ ] **Step 1.1: Crear `.env.example`**

  > ⚠️ Este archivo es solo documentación — Make gestiona las credenciales internamente en sus Connections. No se importa ni se usa directamente.

  ```
  # OpenWeatherMap — https://openweathermap.org/api (plan Free)
  OWM_API_KEY=tu_api_key_aqui

  # X / Twitter — https://developer.x.com/ (plan Basic $200/mes — ver alternativa gratuita en README)
  X_BEARER_TOKEN=tu_bearer_token_aqui

  # Twilio — https://www.twilio.com/ (free trial ~$15 USD)
  TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  TWILIO_AUTH_TOKEN=tu_auth_token_aqui
  TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
  # Número del destinatario — incluir código de país sin el prefijo whatsapp:
  # Make lo construye así: whatsapp: + este número
  TWILIO_WHATSAPP_TO=+573001234567
  ```

- [ ] **Step 1.2: Crear `sheets/config-template.csv`**

  ```csv
  nombre,whatsapp,hora_salida,latitud,longitud,estaciones,alternativa_1,alternativa_2,alternativa_3
  Juan Pérez,+573001234567,07:00,4.6534,-74.0836,"Calle72, Heroes, Calle100",Si Calle72 bloqueada → Tomar SITP C26 desde Calle 68,Si Heroes bloqueada → Caminar a Calle 63,Si Calle100 bloqueada → Tomar SITP por Autopista
  ```

- [ ] **Step 1.3: Crear `sheets/log-template.csv`**

  ```csv
  timestamp,clima_status,estaciones_status,mensaje_enviado,contenido_mensaje
  ```

- [ ] **Step 1.4: Commit**

  ```bash
  git add reto-04/.env.example reto-04/sheets/
  git commit -m "feat(reto-04): add env example and Google Sheets templates"
  ```

---

## Task 2: Configurar servicios externos

- [ ] **Step 2.1: OpenWeatherMap — obtener API key**

  1. Registrarse en https://openweathermap.org/api → plan **Free**
  2. Ir a **API keys** → copiar la key generada
  3. Verificar que esté activa (puede tardar hasta 10 min):
     ```
     https://api.openweathermap.org/data/2.5/forecast?lat=4.6534&lon=-74.0836&appid=TU_KEY&units=metric&lang=es&cnt=3
     ```
     Esperado: JSON con `list[0].pop` (0–1, probabilidad lluvia) y `list[0].weather[0].description`

- [ ] **Step 2.2: Twilio — activar WhatsApp Sandbox**

  1. Crear cuenta en https://www.twilio.com/ (free trial)
  2. Console → **Messaging → Try it Out → Send a WhatsApp message**
  3. Seguir instrucciones: enviar el código al número de sandbox desde tu WhatsApp
  4. Verificar: enviar un mensaje de prueba desde la consola → debe llegar a tu WhatsApp
  5. Anotar:
     - Account SID (dashboard principal)
     - Auth Token (dashboard principal)
     - Número Twilio: `whatsapp:+14155238886`

- [ ] **Step 2.3: X/Twitter — crear app y obtener Bearer Token**

  1. Ir a https://developer.x.com/ → **Developer Portal**
  2. Crear un **Project + App**
  3. En la app: **Keys and tokens → Bearer Token → Generate**
  4. Verificar acceso al endpoint de búsqueda:
     ```bash
     curl -H "Authorization: Bearer TU_TOKEN" \
       "https://api.twitter.com/2/tweets/search/recent?query=from:TransMilenio%20%23TMAhora&max_results=10"
     ```
     Esperado: JSON con `meta.result_count` (número de tweets encontrados)

  > ⚠️ Requiere plan **Basic ($200/mes)**. Si no tienes acceso, ver la **Alternativa RSS** en las Notas al final de este plan.

- [ ] **Step 2.4: Google Sheets — crear el spreadsheet**

  1. Crear un nuevo Google Sheet en https://sheets.google.com
  2. Renombrar la hoja por defecto a `Configuración`
  3. Agregar las columnas de `config-template.csv` y llenar fila 2 con tus datos reales
  4. Crear una segunda hoja llamada `Log`
  5. Agregar las cabeceras del `log-template.csv` en fila 1
  6. Anotar el **Spreadsheet ID** (en la URL: `docs.google.com/spreadsheets/d/**SPREADSHEET_ID**/edit`)

---

## Task 3: Construir el escenario en Make — Trigger y Config

- [ ] **Step 3.1: Crear el escenario**

  1. Ir a https://make.com → **Create a new scenario**
  2. Nombre: `Commute Buddy`
  3. Zona horaria del escenario: Settings → **America/Bogota**

- [ ] **Step 3.2: Agregar Schedule trigger**

  Módulo: **Schedule**
  - **Run scenario:** At regular intervals
  - **Every:** 1 day
  - **Start at:** `06:15`
    > ⚠️ El Schedule trigger no puede leer la hora desde Google Sheets — debe ser hardcodeada aquí. Ajustar a `tu_hora_de_salida - 45 min`. Ejemplo: sales a las 7:00am → poner 06:15.
  - **Days:** Mon, Tue, Wed, Thu, Fri
  - **Time zone:** America/Bogota

- [ ] **Step 3.3: Agregar Google Sheets — Get Row**

  Módulo: **Google Sheets → Get a Row**
  - Conectar cuenta de Google
  - **Spreadsheet ID:** el ID anotado en 2.4
  - **Sheet name:** `Configuración`
  - **Row number:** `2`

  - [ ] **Verificar:** Run once hasta aquí → debe devolver los datos de la fila 2 (nombre, estaciones, lat, lon, etc.)

---

## Task 4: Llamada a Weather API (secuencial, después de Google Sheets)

- [ ] **Step 4.1: Agregar HTTP Request — Weather**

  Módulo: **HTTP → Make a Request** (conectado directamente al módulo Google Sheets)

  - **Method:** GET
  - **URL:** construir usando el selector de variables de Make (no tipear el número de módulo a mano):
    ```
    https://api.openweathermap.org/data/2.5/forecast
    ```
  - **Query String:**
    | Key | Value |
    |-----|-------|
    | `lat` | Hacer click en el campo → seleccionar `latitud` del output de Google Sheets |
    | `lon` | Hacer click en el campo → seleccionar `longitud` del output de Google Sheets |
    | `appid` | `TU_OWM_API_KEY` (pegar directamente) |
    | `units` | `metric` |
    | `lang` | `es` |
    | `cnt` | `3` |
  - **Parse response:** Yes

  > ℹ️ Siempre usar el selector de variables de Make (el pequeño picker que aparece al hacer click en un campo) para mapear datos de módulos anteriores. Nunca tipear `{{N.campo}}` con números a mano — esos números cambian si se añaden o reordenan módulos.

- [ ] **Step 4.2: Verificar respuesta del clima**

  Run once hasta este módulo.
  Esperado:
  ```json
  {
    "list": [{
      "pop": 0.78,
      "weather": [{"description": "lluvia moderada"}],
      "main": {"temp": 12.3}
    }]
  }
  ```

- [ ] **Step 4.3: Guardar valores del clima en variables**

  Módulo: **Tools → Set Variable** (conectado al HTTP Weather)
  - **Variable name:** `weather_pop`
  - **Variable value:** Seleccionar `data > list[] > pop` del output del HTTP Weather (primer elemento)

  Agregar un segundo **Tools → Set Variable** (o usar **Set Multiple Variables**):
  - `weather_description` → `data > list[] > weather[] > description`
  - `weather_temp` → `data > list[] > main > temp`

---

## Task 5: Llamada a X/Twitter API (secuencial, después de Weather)

- [ ] **Step 5.1: Construir query de búsqueda**

  Módulo: **Tools → Set Variable** (conectado al último Set Variable del clima)
  - **Variable name:** `twitter_query`
  - **Variable value:**
    ```
    from:TransMilenio #TMAhora ({{replace(googleSheets.estaciones; ", "; " OR ")}})
    ```
    Usar el selector para mapear `estaciones` desde el módulo Google Sheets.

  Resultado esperado: `from:TransMilenio #TMAhora (Calle72 OR Heroes OR Calle100)`

- [ ] **Step 5.2: Agregar HTTP Request — Twitter**

  Módulo: **HTTP → Make a Request**
  - **Method:** GET
  - **URL:** `https://api.twitter.com/2/tweets/search/recent`
  - **Query String:**
    | Key | Value |
    |-----|-------|
    | `query` | Seleccionar variable `twitter_query` |
    | `max_results` | `10` |
    | `tweet.fields` | `created_at,text` |
    | `start_time` | `{{formatDate(addMinutes(now; -120); "YYYY-MM-DDTHH:mm:ssZ")}}` |
  - **Headers:**
    | Key | Value |
    |-----|-------|
    | `Authorization` | `Bearer TU_X_BEARER_TOKEN` |
  - **Parse response:** Yes

- [ ] **Step 5.3: Verificar respuesta de Twitter**

  Run once hasta este módulo.
  Esperado:
  ```json
  { "meta": { "result_count": 0 } }
  ```
  O con tweets:
  ```json
  {
    "meta": { "result_count": 2 },
    "data": [{ "text": "Demoras en Calle 72...", "created_at": "..." }]
  }
  ```

- [ ] **Step 5.4: Guardar result_count en variable**

  Módulo: **Tools → Set Variable**
  - **Variable name:** `twitter_count`
  - **Variable value:** Seleccionar `data > meta > result_count` del output del HTTP Twitter

  Módulo: **Tools → Set Variable** adicional:
  - **Variable name:** `twitter_first_tweet`
  - **Variable value:** Seleccionar `data > data[] > text` (primer elemento, puede ser vacío)

---

## Task 6: Router + Filtro principal

El Router crea dos caminos: Ruta 1 con filtro (alerta → enviar) y Ruta 2 fallback (sin alerta → solo log).

- [ ] **Step 6.1: Agregar Router**

  Módulo: **Router** (conectado al último Set Variable de Twitter)
  - Crea automáticamente dos rutas. Ruta 1 tendrá el filtro. Ruta 2 es el fallback.

- [ ] **Step 6.2: Configurar el filtro en Ruta 1**

  Hacer click en el ícono de filtro (embudo) sobre la línea de Ruta 1 → **Set up a filter**:

  - **Label:** `Hay alerta de clima o estaciones`
  - Condiciones:

  ```
  Condición 1:
    Variable: weather_pop
    Operator: Greater than
    Value: 0.6

  OR

  Condición 2:
    Variable: weather_description
    Operator: Contains (case insensitive)
    Value: lluvia

  OR

  Condición 3:
    Variable: weather_description
    Operator: Contains (case insensitive)
    Value: tormenta

  OR

  Condición 4:
    Variable: twitter_count
    Operator: Greater than
    Value: 0
  ```

- [ ] **Step 6.3: Verificar que el filtro BLOQUEA (condición lluvia)**

  Temporalmente cambiar la condición 1 a `weather_pop > 0.99` (imposible de alcanzar con días secos).
  Run once → el flujo debe detenerse en el filtro (Ruta 1 no ejecuta nada más).
  Confirmar en el log de ejecución: "0 bundles passed" en Ruta 1.
  **Restaurar el umbral a `> 0.6`** antes de continuar.

- [ ] **Step 6.4: Verificar que el filtro PASA (condición Twitter)**

  Agregar temporalmente una condición adicional:
  ```
  OR Variable: twitter_count >= 0  (siempre verdadero)
  ```
  Run once → Ruta 1 debe ejecutar los módulos siguientes.
  Confirmar en el log de ejecución: "1 bundle passed" en Ruta 1.
  **Eliminar la condición temporal** antes de continuar.

---

## Task 7: Componer y enviar mensaje (Ruta 1)

- [ ] **Step 7.1: Agregar Tools → Set Variable para el mensaje**

  Módulo: **Tools → Set Variable** (en Ruta 1, después del filtro)
  - **Variable name:** `mensaje`
  - **Variable value:** (usar el editor de fórmulas de Make)

  ```
  🚍 *Commute Buddy — Buenos días, {{googleSheets.nombre}}*

  🕐 Sales en 45 minutos

  {{if(weather_pop > 0.6; "🌧️ *CLIMA:*
  " & weather_description & " (" & round(weather_pop * 100; 0) & "%)
  🌡️ " & round(weather_temp; 0) & "°C — Lleva paraguas"; "✅ Clima despejado")}}

  {{if(twitter_count > 0; "⚠️ *TRANSMILENIO:*
  " & twitter_first_tweet & "
  🔄 Revisa las alternativas en tu Sheet"; "✅ Tus estaciones operando normal")}}

  ¡Buen viaje! 💪
  ```

  Mapear `{{googleSheets.nombre}}` usando el selector (no tipear a mano).

- [ ] **Step 7.2: Agregar Twilio → Send a Message**

  Módulo: **Twilio → Send a Message**
  - Conectar cuenta (Account SID + Auth Token)
  - **From:** `whatsapp:+14155238886`
  - **To:** Construir como `whatsapp:` + seleccionar `whatsapp` del Google Sheets output
    > Resultado final: `whatsapp:+573001234567` — el prefijo es solo `whatsapp:`, no `whatsapp:+57`. El número en Google Sheets ya incluye el código de país (`+57...`).
  - **Body:** Seleccionar variable `mensaje`

- [ ] **Step 7.3: Test de envío real**

  Temporalmente agregar la condición `twitter_count >= 0` al filtro (fuerza que siempre pase).
  Run once → WhatsApp debe llegar a tu teléfono.
  Verificar: nombre correcto, temperatura, sección clima, sección estaciones.
  **Eliminar la condición temporal** del filtro después del test.

---

## Task 8: Log en Google Sheets (ambas rutas)

- [ ] **Step 8.1: Log cuando SÍ envía (Ruta 1, después de Twilio)**

  Módulo: **Google Sheets → Add a Row**
  - **Spreadsheet ID:** el mismo de la config
  - **Sheet name:** `Log`
  - **Row values** (mapear con el selector):
    | Columna | Valor |
    |---------|-------|
    | timestamp | `{{formatDate(now; "YYYY-MM-DD HH:mm:ss")}}` |
    | clima_status | Variable `weather_pop` + `" - "` + variable `weather_description` |
    | estaciones_status | `{{if(twitter_count > 0; "Alertas encontradas"; "OK")}}` |
    | mensaje_enviado | `Sí` |
    | contenido_mensaje | Variable `mensaje` |

- [ ] **Step 8.2: Log cuando NO envía (Ruta 2 — fallback del Router)**

  La Ruta 2 del Router no tiene filtro → recibe los bundles que NO pasaron el filtro de Ruta 1.

  En Ruta 2, agregar:
  Módulo: **Google Sheets → Add a Row**
  - **Sheet name:** `Log`
  - **Row values:**
    | Columna | Valor |
    |---------|-------|
    | timestamp | `{{formatDate(now; "YYYY-MM-DD HH:mm:ss")}}` |
    | clima_status | Variable `weather_pop` + `" - "` + variable `weather_description` |
    | estaciones_status | `OK` |
    | mensaje_enviado | `No` |
    | contenido_mensaje | `N/A` |

- [ ] **Step 8.3: Verificar el log**

  Ejecutar dos veces:
  1. Con `twitter_count >= 0` en el filtro (fuerza envío) → debe aparecer fila con "Sí"
  2. Con `weather_pop > 0.99` en el filtro (bloquea) → debe aparecer fila con "No"

  Abrir Google Sheet → hoja `Log` → confirmar ambas filas.
  **Restaurar el filtro** a sus valores normales.

---

## Task 9: Activar y exportar blueprint

- [ ] **Step 9.1: Activar el escenario**

  Toggle **Active** (botón inferior izquierdo del canvas).
  Verificar que la próxima ejecución programada aparece en el panel de control.

- [ ] **Step 9.2: Exportar blueprint**

  Menú ⋯ (top right) → **Export Blueprint** → guardar como `blueprint.json`.

- [ ] **Step 9.3: Verificar que el blueprint es importable**

  En una pestaña nueva (o cuenta de prueba): **Create a new scenario** → Menú ⋯ → **Import Blueprint** → seleccionar el archivo exportado.
  Esperado: todos los módulos cargan sin errores (aparecerán en rojo pidiendo reconectar credenciales, pero la estructura debe verse completa).

- [ ] **Step 9.4: Commitear blueprint**

  ```bash
  cp ~/Downloads/blueprint.json reto-04/blueprint.json
  git add reto-04/blueprint.json
  git commit -m "feat(reto-04): add Make scenario blueprint (Commute Buddy)"
  ```

---

## Task 10: Escribir README

**Files:**
- Modify: `reto-04/README.md`

- [ ] **Step 10.1: Escribir README completo**

  ```markdown
  # Reto 4 — Commute Buddy

  > Vibe Coders League Platzi 2026

  Automatización en Make que cada mañana (L-V), 45 minutos antes de que salgas,
  revisa el clima y el estado de tus estaciones de TransMilenio. Solo te manda
  un WhatsApp si hay lluvia >60% o si @TransMilenio publicó alertas en tus
  estaciones. Si todo está bien, silencio total.

  ## Cómo funciona

  ```
  [Schedule L-V 6:15am]
      → [Google Sheets: leer config]
      → [HTTP: OpenWeatherMap] → [Set Variables: pop, descripción, temp]
      → [HTTP: X/Twitter API] → [Set Variables: result_count, primer tweet]
      → [Router]
          → Ruta 1 (Filter: lluvia >60% OR tweets >0)
              → [Componer mensaje] → [Twilio WhatsApp] → [Sheets Log: Sí]
          → Ruta 2 (fallback — sin alerta)
              → [Sheets Log: No]
  ```

  ## El filtro

  Solo continúa hacia Twilio si alguna de estas condiciones es verdadera:
  - Probabilidad de lluvia > 60 %
  - Descripción del clima contiene "lluvia" o "tormenta"
  - X/Twitter encontró tweets de @TransMilenio con #TMAhora en tus estaciones

  Si ninguna se cumple, el escenario registra "sin novedades" en el Log y termina.

  ## Credenciales necesarias

  | Servicio | Qué obtener | Costo |
  |----------|-------------|-------|
  | OpenWeatherMap | API Key | Gratis |
  | X / Twitter | Bearer Token | $200/mes (Basic) — ver alternativa gratuita abajo |
  | Twilio | Account SID + Auth Token | ~$15 gratis (trial) |
  | Google Sheets | Spreadsheet ID | Gratis |

  Ver `.env.example` para el formato de cada credencial.

  ## Setup

  ### 1. Google Sheets
  1. Crear un Google Sheet con dos hojas: `Configuración` y `Log`
  2. Copiar cabeceras de `sheets/config-template.csv` y `sheets/log-template.csv`
  3. Llenar fila 2 de `Configuración` con tus datos (número con código de país: +573...)
  4. Anotar el Spreadsheet ID de la URL

  ### 2. Activar WhatsApp Sandbox (Twilio)
  1. Console → Messaging → Try it Out → WhatsApp
  2. Enviar el código desde tu WhatsApp al número indicado
  3. Verificar enviando un mensaje de prueba desde la consola de Twilio

  ### 3. Importar escenario en Make
  1. [make.com](https://make.com) → **Create a new scenario**
  2. Menú ⋯ → **Import Blueprint** → seleccionar `blueprint.json`
  3. Reconectar cada módulo con tus credenciales:
     - Google Sheets → cuenta de Google + tu Spreadsheet ID
     - HTTP Weather → reemplazar `TU_OWM_API_KEY` en la query string
     - HTTP Twitter → reemplazar `TU_X_BEARER_TOKEN` en el header Authorization
     - Twilio → Account SID + Auth Token
  4. Ajustar la hora del Schedule (tu hora de salida - 45 min)
  5. Zona horaria del escenario: **America/Bogota**
  6. Toggle **Active**

  ### 4. Verificar
  - Ejecutar **Run once** con el filtro en modo permisivo (añadir condición `twitter_count >= 0`)
  - Debe llegar un WhatsApp con el resumen
  - Restaurar el filtro a sus valores normales

  ## Alternativa gratuita para X/Twitter

  Si no tienes acceso al plan Basic de X ($200/mes), puedes reemplazar la Ruta B por:
  - Módulo **RSS → Watch RSS feed items** apuntando a un feed de Nitter
    (instancia pública: `https://nitter.net/TransMilenio/rss`)
  - Filtro de texto: el campo `title` o `content` contiene el nombre de tus estaciones
  - Misma lógica de condición en el Router filter

  ## Personalizar

  - **Estaciones:** Editar columna `estaciones` en Google Sheets (separadas por coma)
  - **Umbral de lluvia:** Editar condición del filtro en Make
  - **Hora de salida:** Editar el Schedule trigger (no se lee del Sheet — es hardcodeado)
  - **Número de WhatsApp:** Editar columna `whatsapp` en Google Sheets

  ## Estructura

  ```
  reto-04/
  ├── blueprint.json              ← Importar en Make para replicar
  ├── sheets/
  │   ├── config-template.csv    ← Template hoja Configuración
  │   └── log-template.csv       ← Template hoja Log
  ├── .env.example               ← Documentación de credenciales
  └── README.md
  ```

  **Estado:** Completado
  ```

- [ ] **Step 10.2: Commit README**

  ```bash
  git add reto-04/README.md
  git commit -m "docs(reto-04): complete README with setup instructions"
  ```

---

## Task 11: Actualizar README raíz

**Files:**
- Modify: `README.md`

- [ ] **Step 11.1: Marcar reto-04 como completado**

  Cambiar:
  ```markdown
  | 04 | [Reto 4](./reto-04) | Pendiente |
  ```
  Por:
  ```markdown
  | 04 | [Commute Buddy](./reto-04) | Completado |
  ```

- [ ] **Step 11.2: Commit**

  ```bash
  git add README.md
  git commit -m "docs: mark reto-04 as completed"
  ```

---

## Checklist de verificación final

- [ ] Escenario activo en Make, programado L-V a la hora correcta
- [ ] Run once con alerta forzada → WhatsApp recibido con formato correcto
- [ ] Run once sin alerta (filtro bloqueando) → sin WhatsApp, solo log en Google Sheets
- [ ] Hoja `Log` con al menos 2 filas: una "Sí" y una "No"
- [ ] `blueprint.json` importable y confirmado (módulos cargan correctamente)
- [ ] README cubre setup completo para alguien sin contexto
- [ ] Root README actualizado con nombre y estado

---

## Notas

- **X API costo:** El endpoint de búsqueda requiere plan Basic ($200/mes). Alternativa gratuita: RSS feed de Nitter (`https://nitter.net/TransMilenio/rss`) con filtro de texto en Make — documentado en el README.
- **Schedule hardcodeado:** Make no puede leer dinámicamente la hora de salida del Sheet para configurar el trigger. La hora debe ajustarse manualmente en el módulo Schedule.
- **Zona horaria:** Configurar Make en `America/Bogota` (UTC-5). Verificar en: Scenario Settings → Time zone.
- **Formato de estaciones en tweets:** Revisar tweets reales de @TransMilenio para confirmar el formato exacto ("Calle 72" vs "Cll72" vs "Héroes" vs "Heroes") — la query de búsqueda debe coincidir.
- **Variable picker:** Siempre usar el selector de variables de Make para mapear campos de módulos anteriores. Los números de módulo (`{{6.campo}}`) cambian al reordenar módulos y harán fallar el escenario.
