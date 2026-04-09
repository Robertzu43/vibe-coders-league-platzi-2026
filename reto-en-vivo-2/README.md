# Reto en Vivo 2 — Commute Buddy v3 (Multi-usuario)

> Vibe Coders League Platzi 2026

Evolucion del [Reto 04 — Commute Buddy](../reto-04) convertido en un sistema multi-usuario. Automatizacion en Make que revisa el clima y alertas de TransMilenio para **cada usuario registrado**, y les envia un SMS personalizado antes de que salgan al trabajo.

**Blueprint publico:** [make.com/public/shared-scenario](https://us2.make.com/public/shared-scenario/JcHdScfyIgb/commute-buddy-v3-multi-usuario)

## Que cambio vs Reto 04

| Aspecto | Reto 04 (v1) | Reto en Vivo 2 (v3) |
|---------|--------------|----------------------|
| Usuarios | 1 (hardcodeado) | N usuarios via Google Form |
| Registro | Manual en Make | Google Form → Google Sheets |
| Hora de salida | Fija (6:15am) | Personalizada por usuario |
| Canal | WhatsApp (Twilio) | SMS (Twilio) |
| Alertas TM | Twitter API (@TransMilenio) | Google Sheets (Alertas_TM) |
| Envio | Siempre a la misma hora | Ventana de 10 min por usuario |
| Log | Sin log | Sheet de Log para evitar duplicados |

## Como funciona

```
[Schedule: cada 5 min]
    → [Google Sheets: leer Usuarios]
    → [Google Sheets: leer Log (ya enviado hoy?)]
    → [Set Variables: calcular ventana de hora ±5 min]
    → [Filter: ¿hora actual dentro de ventana?]
        → SI →  [HTTP: OpenWeatherMap — pronostico proximas 2h]
                 → [Set Variables: temp, lluvia%, descripcion]
                 → [Google Sheets: leer Alertas_TM]
                 → [Set Variables: alertas texto, count]
                 → [Compose SMS: mensaje personalizado]
                 → [Twilio: enviar SMS al numero del usuario]
        → NO → FIN (siguiente usuario)
```

## Hojas de Google Sheets

El escenario usa un Google Spreadsheet con 3 hojas:

### Usuarios
Poblada automaticamente por un Google Form de registro.

| Campo | Ejemplo |
|-------|---------|
| Nombre | Roberto |
| Celular | +573001234567 |
| Hora de salida | 7:30:00 AM |
| Estaciones TM | Calle 72, Calle 100 |

### Alertas_TM
Hoja con alertas activas de TransMilenio (alimentada manualmente o por scraping).

### Log
Registro de mensajes enviados para evitar duplicados en el mismo dia.

## Ejemplo de SMS recibido

```
🚍 Hola Roberto! Temp: 14C, lluvia: 72%.
Alerta TM: Demoras en estacion Calle 72 por manifestacion ciudadana
```

Si no hay alertas:
```
🚍 Hola Roberto! Temp: 18C, lluvia: 10%.
Todo bien en tus estaciones.
```

## Servicios usados

| Servicio | Funcion | Costo |
|----------|---------|-------|
| Make | Orquestacion del escenario multi-usuario | Free (1,000 ops/mes) |
| Google Sheets | Base de datos de usuarios, alertas y log | Gratis |
| Google Forms | Registro de nuevos usuarios | Gratis |
| OpenWeatherMap | Pronostico de lluvia por ciudad | Gratis |
| Twilio SMS | Envio del mensaje personalizado | ~$0.007 por SMS |

## Setup — Importar el escenario

### 1. Importar blueprint
1. [make.com](https://make.com) → **Create a new scenario**
2. Menu ⋯ → **Import Blueprint** → seleccionar `blueprint.json`
3. El escenario cargara con los modulos preconfigurados

### 2. Crear Google Spreadsheet
1. Crear un spreadsheet con 3 hojas: `Usuarios`, `Alertas_TM`, `Log`
2. Crear un Google Form que alimente la hoja `Usuarios` con los campos: nombre, celular, hora de salida, estaciones
3. Actualizar el `spreadsheetId` en los modulos de Google Sheets

### 3. Reemplazar credenciales
- **Google Sheets:** Conectar tu cuenta de Google
- **OpenWeatherMap:** Query param `appid` → tu API Key
- **Twilio:** Configurar Account SID, Auth Token y numero de envio

## Contexto del reto

Segundo reto en vivo de la Vibe Coders League. El objetivo era escalar una automatizacion existente (Commute Buddy del reto 04) para que soporte multiples usuarios con horarios personalizados, usando Google Forms como punto de registro.
