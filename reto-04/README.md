# Reto 4 — Commute Buddy

> Vibe Coders League Platzi 2026

Automatización en Make que cada mañana de lunes a viernes, a las 6:15am, revisa el clima en Bogotá y el estado de las estaciones de TransMilenio. Solo te manda un WhatsApp si hay lluvia >60% o si @TransMilenio publicó alertas en tus estaciones. Si todo está bien, silencio total.

## Cómo funciona

```
[Schedule: L-V 6:15am Bogotá]
    → [HTTP: OpenWeatherMap — próximas 2h en Chapinero]
    → [HTTP: X/Twitter — busca @TransMilenio #TMAhora + estaciones]
    → [Filter: lluvia >60% OR tweets encontrados >0]
        → SÍ → [HTTP: Twilio WhatsApp] → FIN
        → NO → FIN (silencio)
```

## El filtro

El escenario solo continúa hacia Twilio si al menos una de estas condiciones es verdadera:

| Condición | Operador | Valor |
|-----------|----------|-------|
| Probabilidad de lluvia | `>` | `0.6` (60%) |
| Descripción del clima | `contains` | `lluvia` |
| Descripción del clima | `contains` | `tormenta` |
| Tweets de @TransMilenio encontrados | `>` | `0` |

Si ninguna aplica → el escenario para antes del módulo Twilio. No se envía nada.

## Ejemplo de mensaje recibido

**Cuando hay alerta:**
```
🚍 Commute Buddy — Buenos días, Roberto

🕐 Sales en 45 minutos

🌧️ CLIMA:
lluvia ligera (72%)
🌡️ 13°C — Lleva paraguas

⚠️ TRANSMILENIO:
Presentamos demoras en estación Calle 72 por manifestación ciudadana

¡Buen viaje! 💪
```

**Cuando todo está bien:** no llega nada.

## Servicios usados

| Servicio | Función | Costo |
|----------|---------|-------|
| Make | Orquestación del escenario | Free (1,000 ops/mes) |
| OpenWeatherMap | Pronóstico de lluvia | Gratis |
| X / Twitter API | Tweets recientes de @TransMilenio | $200/mes (Basic) |
| Twilio WhatsApp | Envío del mensaje | ~$0.005 por mensaje |

## Setup — Importar el escenario

El escenario ya está creado en Make (ID: `4428543`) en la cuenta del autor. Para replicarlo:

### 1. Importar blueprint
1. [make.com](https://make.com) → **Create a new scenario**
2. Menú ⋯ → **Import Blueprint** → seleccionar `blueprint.json`
3. El escenario cargará con 3 módulos HTTP preconfigurados

### 2. Reemplazar credenciales en los módulos
Los módulos HTTP tienen las credenciales hardcodeadas. Sustituirlas por las tuyas:

**Módulo 1 (Weather):** Query param `appid` → tu OWM API Key

**Módulo 2 (Twitter):** Header `Authorization` → `Bearer TU_BEARER_TOKEN`

**Módulo 3 (Twilio):**
- URL → `https://api.twilio.com/2010-04-01/Accounts/TU_ACCOUNT_SID/Messages.json`
- Form field `MessagingServiceSid` → tu Messaging Service SID
- Form field `To` → tu número de WhatsApp
- Basic Auth User → tu Account SID
- Basic Auth Pass → tu Auth Token

### 3. Ajustar horario
- Schedule tipo **weekly**, días **Lun-Vie**
- Hora: tu `hora_salida - 45 min` en UTC (Bogotá = UTC-5, entonces 6:15am Bogotá = 11:15 UTC)

### 4. Ajustar coordenadas y estaciones
- **Módulo 1**, query params `lat` y `lon` → tus coordenadas
- **Módulo 2**, query param `query` → cambia `(Calle72 OR Heroes OR Calle100)` por tus estaciones

### 5. Activar y probar
1. Toggle **Active** en el escenario
2. Click **Run once** para probar manualmente
3. Si quieres forzar el envío, añadir temporalmente condición `result_count >= 0` al filtro

## Estructura

```
reto-04/
├── blueprint.json              ← Importar en Make para replicar
├── sheets/
│   ├── config-template.csv    ← Template referencia (no usado en el escenario final)
│   └── log-template.csv       ← Template referencia (no usado en el escenario final)
├── .env.example               ← Documentación de credenciales
└── README.md
```

## Notas

- **Zona horaria Make:** Verificar en Settings del escenario que esté en `America/Bogota`
- **X API:** El endpoint de búsqueda requiere plan Basic ($200/mes). Sin acceso a X, el filtro solo se activa por condición de lluvia
- **Twilio WhatsApp Sandbox:** El número destinatario debe haber activado la conexión con el sandbox primero (enviar código desde WhatsApp al número de Twilio)
- **Estaciones:** Verificar cómo escribe @TransMilenio los nombres en sus tweets ("Calle 72" vs "Cll72" vs "Héroes") para que la query coincida

## Estado

- [x] Completado
