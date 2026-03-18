# Reto 05 — Restaurant Inventory Automation

Automatización en Make.com que conecta **Square POS** con **Google Sheets** para detectar bajo inventario automáticamente, alertar al manager por email, y enviar pedidos de reabastecimiento a proveedores con IA (Claude) por email y WhatsApp.

**Estado:** Completado

---

## El problema

Los managers de restaurantes rastrean inventario y ventas manualmente en sistemas desconectados. El bajo stock pasa desapercibido hasta que un producto se acaba en mitad del servicio. Los pedidos a proveedores son manuales, lentos y se olvidan.

## La solución

Dos escenarios independientes en Make:

- **Escenario 1** — Cada venta completada en Square actualiza el inventario en Sheets en tiempo real
- **Escenario 2** — Cada 6 horas detecta bajo stock, alerta al manager y envía pedidos automáticos a proveedores

---

## Flujo de automatización

### Escenario 1 — Actualización de Inventario

```
Square: Watch Orders (COMPLETED)
    → Iterator (line items de cada orden)
        → Google Sheets: Search Rows (buscar producto en Inventario)
            → Google Sheets: Update Row (restar cantidad vendida de current_stock)
```

### Escenario 2 — Detección, Alerta y Auto-Orden

```
Schedule (cada 6h)
    → Google Sheets: Get All Rows (Inventario — 1ra pasada)
        → [filter: current_stock ≤ min_threshold]
            → Text Aggregator (construye lista consolidada)
                → Email (alerta al manager con lista completa)
    → Google Sheets: Get All Rows (Inventario — 2da pasada)
        → [filter: current_stock ≤ min_threshold]
            → Google Sheets: Search Rows (busca proveedor en Proveedores)
                → Anthropic Claude (genera email formal de pedido en español)
                    → Email (envía pedido al proveedor)
                    → WhatsApp Business Cloud (notifica al proveedor)
```

> La 2da pasada de Inventario es necesaria porque el Text Aggregator produce un string, no bundles iterables para el loop de proveedores.

---

## Estructura de datos

### Hoja: Inventario

| product_id | product_name | current_stock | min_threshold | unit |
|------------|--------------|---------------|---------------|------|
| P001 | Pollo | 15 | 10 | kg |
| P002 | Carne de res | 8 | 15 | kg |
| ... | ... | ... | ... | ... |

### Hoja: Proveedores

| product_id | product_name | supplier_name | supplier_email | supplier_whatsapp | reorder_quantity |
|------------|--------------|---------------|----------------|-------------------|------------------|
| P001 | Pollo | Avícola del Norte | pedidos@avicola-norte.com | +521234567890 | 50 kg |
| ... | ... | ... | ... | ... | ... |

- `supplier_whatsapp` en formato E.164 (ej. `+521234567890`) — sin prefijo `whatsapp:`

---

## Setup

### 1. Google Sheets

1. Crear un nuevo Spreadsheet en [sheets.google.com](https://sheets.google.com)
2. Crear hoja `Inventario` con las columnas de la tabla anterior
3. Crear hoja `Proveedores` con las columnas de la tabla anterior
4. Importar datos de `sheets/inventario-template.csv` y `sheets/proveedores-template.csv`
5. Copiar el Spreadsheet ID de la URL: `https://docs.google.com/spreadsheets/d/**{SPREADSHEET_ID}**/edit`

> Los `product_id` en Inventario deben coincidir con los `Catalog Object ID` del catálogo de Square (obtener en Square Dashboard → Items).

### 2. Importar Escenario 1

1. Make → **Create a new scenario**
2. Menú `⋯` → **Import Blueprint** → subir `blueprints/scenario-1-inventory-update.json`
3. Configurar conexiones:
   - **Square**: autenticar con cuenta Square (OAuth)
   - **Google Sheets** (módulos 3 y 4): autenticar con cuenta Google (OAuth)
4. En el módulo Square (Watch Orders):
   - **Location ID**: ID de tu ubicación en Square Dashboard → Locations
   - **State**: `COMPLETED`
5. En los módulos Google Sheets: verificar Spreadsheet ID y Sheet Names
6. **Run once** para probar → crear una venta en Square Sandbox y verificar que `current_stock` disminuye

### 3. Importar Escenario 2

1. Make → **Create a new scenario**
2. Menú `⋯` → **Import Blueprint** → subir `blueprints/scenario-2-low-stock-alert.json`
3. Configurar conexiones:
   - **Google Sheets** (módulos 1, 4, 5): autenticar con cuenta Google (OAuth)
   - **Gmail/Email** (módulos 3 y 7): autenticar cuenta de email del restaurante
   - **Anthropic Claude** (módulo 6): pegar API Key de [console.anthropic.com](https://console.anthropic.com)
   - **WhatsApp Business Cloud** (módulo 8): Phone Number ID + Access Token de Meta for Developers
4. En el módulo Email del manager (módulo 3): cambiar `to` por el email real del manager
5. Configurar el Schedule: **Scenario settings** → `Every 6 hours`

### 4. Activar ambos escenarios

Toggle **Active** en cada escenario. El Escenario 1 comienza a monitorear ventas inmediatamente. El Escenario 2 corre en 6h (o manualmente con **Run once**).

### 5. Demo rápida

Para probar Escenario 2 sin esperar 6 horas:
1. En Inventario, bajar manualmente el `current_stock` de un producto a ≤ su `min_threshold`
2. Make → Escenario 2 → **Run once**
3. Verificar: email al manager + email al proveedor (cuerpo generado por Claude) + WhatsApp

---

## Servicios y costos estimados

| Servicio | Uso | Costo |
|----------|-----|-------|
| Make.com | 2 escenarios activos | Free tier (1,000 ops/mes) |
| Google Sheets | Read/Write por venta | Gratis |
| Square POS | Polling cada 15 min | Gratis (API pública) |
| Anthropic Claude (Haiku) | ~$0.001 por pedido generado | Mínimo |
| Gmail | Envío de emails | Gratis |
| WhatsApp Business Cloud | Mensajes a proveedores | Gratis (primeros 1,000/mes) |

---

## Notas importantes

**Square Sandbox vs Producción**
- Para desarrollo usar Square Sandbox: [developer.squareup.com](https://developer.squareup.com) → crear app → Sandbox credentials
- El módulo Square en Make tiene campo para elegir entorno
- Los `product_id` en Sheets deben coincidir con los `Catalog Object ID` del entorno usado

**WhatsApp Business Cloud**
- Requiere cuenta verificada en Meta Business Suite
- Para mensajes de texto libre: el número destinatario debe haber iniciado conversación en las últimas 24h
- Para producción: usar plantillas pre-aprobadas en Meta Business Manager

**Estado vacío (sin bajo stock)**
- Si ningún producto está bajo umbral en Escenario 2, el filter pasa cero bundles y el escenario termina sin enviar emails — comportamiento correcto

**Zona horaria**
- Configurar en Make → Scenario Settings → Time zone según la zona del restaurante
