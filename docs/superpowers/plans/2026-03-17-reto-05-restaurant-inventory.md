# Reto 05 — Restaurant Inventory Automation: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatización en Make que conecta Square POS con Google Sheets para detectar bajo inventario, alertar al manager por email, y enviar pedidos a proveedores con IA por email y WhatsApp.

**Architecture:** Dos escenarios independientes en Make. Escenario 1: trigger por venta completada en Square → actualiza stock en Sheets. Escenario 2: trigger scheduled cada 6h → detecta bajo stock → agrega en un array → alerta manager (un email consolidado) → itera por producto → busca proveedor en Sheets → Claude genera email de pedido → envía email + WhatsApp a proveedor.

**Tech Stack:** Make.com (no-code), Google Sheets (2 hojas), Square POS, Gmail/Email module, Anthropic Claude API, WhatsApp Business Cloud (Meta).

---

## File Map

| Archivo | Propósito |
|---------|-----------|
| `reto-05/sheets/inventario-template.csv` | Template de la hoja Inventario con datos de ejemplo |
| `reto-05/sheets/proveedores-template.csv` | Template de la hoja Proveedores con datos de ejemplo |
| `reto-05/.env.example` | Documentación de credenciales requeridas |
| `reto-05/blueprints/scenario-1-inventory-update.json` | Blueprint Make del Escenario 1 exportado |
| `reto-05/blueprints/scenario-2-low-stock-alert.json` | Blueprint Make del Escenario 2 exportado |
| `reto-05/README.md` | Setup completo end-to-end para replicar la automatización |

---

## Task 1: Crear archivos base del repo

**Files:**
- Create: `reto-05/.env.example`
- Create: `reto-05/sheets/inventario-template.csv`
- Create: `reto-05/sheets/proveedores-template.csv`
- Create: `reto-05/blueprints/` (directorio vacío con `.gitkeep`)

- [ ] **Step 1.1: Crear `.env.example`**

  > ⚠️ Solo documentación — Make gestiona las credenciales internamente en sus Connections. No se importa ni se usa directamente.

  ```
  # Square POS — https://developer.squareup.com/
  # Crear app en Square Developer Dashboard → OAuth → Access Token
  SQUARE_ACCESS_TOKEN=EAAAl...tu_token_aqui

  # Google Sheets — Conectar via OAuth en Make (no requiere token manual)
  # Solo necesitas el Spreadsheet ID (en la URL de la hoja)
  GOOGLE_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
  INVENTARIO_SHEET_NAME=Inventario
  PROVEEDORES_SHEET_NAME=Proveedores

  # Anthropic Claude — https://console.anthropic.com/
  ANTHROPIC_API_KEY=sk-ant-...tu_api_key_aqui

  # Email — Conectar cuenta Gmail via OAuth en Make (no requiere token manual)
  MANAGER_EMAIL=manager@restaurante.com

  # WhatsApp Business Cloud — https://developers.facebook.com/
  # Requiere: Meta Business Suite + cuenta WhatsApp Business verificada
  # Obtener en: Meta for Developers → Tu App → WhatsApp → API Setup
  WHATSAPP_PHONE_NUMBER_ID=123456789012345
  WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxx...
  ```

- [ ] **Step 1.2: Crear `sheets/inventario-template.csv`**

  ```csv
  product_id,product_name,current_stock,min_threshold,unit
  P001,Pollo,15,10,kg
  P002,Carne de res,8,15,kg
  P003,Aceite de oliva,3,5,litros
  P004,Arroz,25,20,kg
  P005,Tomate,6,8,kg
  ```

  > **Nota:** `current_stock` se actualiza automáticamente por el Escenario 1. Los valores iniciales deben reflejar el stock real del restaurante. `min_threshold` es el umbral mínimo — cuando `current_stock` baje a este valor o menos, se dispara la alerta.

- [ ] **Step 1.3: Crear `sheets/proveedores-template.csv`**

  ```csv
  product_id,product_name,supplier_name,supplier_email,supplier_whatsapp,reorder_quantity
  P001,Pollo,Avícola del Norte,pedidos@avicola-norte.com,+521234567890,50 kg
  P002,Carne de res,Carnes Premium SA,ventas@carnespremium.com,+521234567891,30 kg
  P003,Aceite de oliva,Distribuidora Mediterránea,contacto@distmediterranea.com,+521234567892,20 litros
  P004,Arroz,Arrocera Central,pedidos@arroceracentral.com,+521234567893,100 kg
  P005,Tomate,Verduras Frescas MX,pedidos@verdurasfrescas.com,+521234567894,25 kg
  ```

  > **Nota:** `supplier_whatsapp` debe estar en formato E.164 (ej. `+521234567890`). WhatsApp Business Cloud en Make usa este formato directamente — sin el prefijo `whatsapp:` que usa Twilio.

- [ ] **Step 1.4: Crear directorio blueprints**

  ```bash
  mkdir -p reto-05/blueprints
  touch reto-05/blueprints/.gitkeep
  ```

- [ ] **Step 1.5: Commit**

  ```bash
  git add reto-05/
  git commit -m "feat(reto-05): add base files — sheet templates and env docs"
  ```

---

## Task 2: Configurar Google Sheets

**Prerequisito:** Tener una cuenta de Google con acceso a Google Sheets.

- [ ] **Step 2.1: Crear el Spreadsheet**

  1. Ir a [sheets.google.com](https://sheets.google.com) → **+ Blank**
  2. Renombrar el archivo: `Restaurante - Sistema de Inventario`
  3. Copiar el **Spreadsheet ID** de la URL (la parte entre `/d/` y `/edit`):
     ```
     https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit
                                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                           Este es el Spreadsheet ID
     ```

- [ ] **Step 2.2: Crear hoja Inventario**

  1. Renombrar la hoja predeterminada "Sheet1" → `Inventario`
  2. Agregar encabezados en fila 1: `product_id | product_name | current_stock | min_threshold | unit`
  3. Copiar los datos del archivo `sheets/inventario-template.csv` como filas de datos (filas 2-6)

- [ ] **Step 2.3: Crear hoja Proveedores**

  1. Click **+** para agregar nueva hoja → renombrar `Proveedores`
  2. Agregar encabezados en fila 1: `product_id | product_name | supplier_name | supplier_email | supplier_whatsapp | reorder_quantity`
  3. Copiar los datos del archivo `sheets/proveedores-template.csv` como filas de datos (filas 2-6)

- [ ] **Step 2.4: Verificar estructura**

  Confirmación visual de que ambas hojas tienen:
  - Fila 1: encabezados exactamente como los CSV
  - Filas 2+: datos de ejemplo
  - Hoja `Inventario`: 5 productos con stock en diferentes estados (algunos por debajo del umbral para facilitar pruebas)

---

## Task 3: Construir Escenario 1 en Make — Actualización de Inventario

**Prerequisito:** Cuenta en [make.com](https://make.com) + cuenta de Square (sandbox o producción).

**Flujo:** Square: Watch Orders → Iterator → Google Sheets: Search Rows → Google Sheets: Update Row

- [ ] **Step 3.1: Crear nuevo escenario en Make**

  1. [make.com](https://make.com) → **Create a new scenario**
  2. Renombrar: `[Reto-05] Escenario 1 — Actualizar Inventario`

- [ ] **Step 3.2: Módulo 1 — Square: Watch Orders**

  1. Click **+** → buscar `Square` → seleccionar **Watch Orders**
  2. Crear Connection → autenticar con cuenta Square
  3. Configurar:
     - **Location ID:** ID de la ubicación del restaurante en Square (obtener en Square Dashboard → Locations)
     - **State:** `COMPLETED` (solo órdenes completadas)
     - **Limit:** `10`
  4. Click OK

- [ ] **Step 3.3: Módulo 2 — Iterator sobre line items**

  1. Click **+** después de Square → buscar `Flow Control` → seleccionar **Iterator**
  2. En **Array**, seleccionar `Line Items` del output de Square Watch Orders
  3. Click OK

  > **Por qué Iterator:** Una orden de Square puede tener múltiples productos. El Iterator descompone el array de line items en bundles individuales para que los módulos siguientes procesen cada producto por separado.

- [ ] **Step 3.4: Módulo 3 — Google Sheets: Search Rows (buscar producto en Inventario)**

  1. Click **+** → buscar `Google Sheets` → seleccionar **Search Rows**
  2. Crear Connection → autenticar con cuenta Google (OAuth)
  3. Configurar:
     - **Spreadsheet ID:** pegar el Spreadsheet ID del Step 2.1
     - **Sheet Name:** `Inventario`
     - **Filter:** Column `product_id` | Operator `Equal to` | Value: mapear `Catalog Object ID` del Iterator (este es el ID del producto en Square — debe coincidir con `product_id` en Sheets)
     - **Limit:** `1`
  4. Click OK

  > **Nota importante:** El `Catalog Object ID` de Square debe coincidir con el `product_id` en la hoja Inventario. En producción, usar los IDs reales del catálogo de Square al cargar los datos en Sheets. En sandbox, verificar los IDs en Square → Items → Catalog.

- [ ] **Step 3.5: Módulo 4 — Google Sheets: Update Row**

  1. Click **+** → `Google Sheets` → **Update a Row**
  2. Configurar:
     - **Spreadsheet ID:** mismo ID
     - **Sheet Name:** `Inventario`
     - **Row Number:** mapear el número de fila devuelto por Search Rows (campo `Row Number`)
     - **Values:** solo el campo `current_stock`:
       - Columna `current_stock` → fórmula: `{{3.current_stock - 2.quantity}}`
       - (donde `3.` es el output de Search Rows — módulo 3 — y `2.quantity` es la cantidad vendida del bundle del Iterator — módulo 2. Los campos de line items son emitidos por el Iterator, no por Square Watch Orders directamente)
  3. Click OK

- [ ] **Step 3.6: Probar Escenario 1**

  1. Click **Run once** en Make
  2. Crear una orden de prueba en Square (o usar Square Sandbox)
  3. Verificar en la hoja Inventario que `current_stock` del producto vendido disminuyó correctamente
  4. Verificar en el historial de ejecución de Make que todos los módulos son verdes

- [ ] **Step 3.7: Activar Escenario 1**

  1. Toggle **Active** en el escenario
  2. Verificar que el estado cambia a activo (ícono verde)

- [ ] **Step 3.8: Exportar blueprint y commit**

  1. Make → menú `⋯` (tres puntos) → **Export Blueprint** → guardar como `scenario-1-inventory-update.json`
  2. Mover el archivo a `reto-05/blueprints/scenario-1-inventory-update.json`
  3. El archivo `.gitkeep` en `blueprints/` ya no es necesario — eliminarlo

  ```bash
  rm reto-05/blueprints/.gitkeep
  git add reto-05/blueprints/scenario-1-inventory-update.json
  git rm reto-05/blueprints/.gitkeep
  git commit -m "feat(reto-05): add Scenario 1 blueprint — Square to Sheets inventory update"
  ```

---

## Task 4: Construir Escenario 2 en Make — Detección, Alerta y Auto-Orden

**Flujo:** Schedule → Get All Rows → Filter → Text Aggregator → Email (manager) → Get All Rows (2ª vez) → Filter (2ª vez) → Google Sheets: Search Rows (proveedor) → Claude → Email (proveedor) → WhatsApp

> **Nota sobre el filtro de inventario:** Make's **Search Rows** solo permite comparar una columna contra un valor literal, no contra otra columna de la misma fila. Para comparar `current_stock ≤ min_threshold` (ambos valores dinámicos por fila), se usa **Get All Rows** para traer todas las filas y luego un módulo **Filter** independiente que compara los dos campos mapeados del mismo bundle.

> **Nota sobre el email del manager:** Make no soporta sintaxis Handlebars (`{{#each}}`). Para construir una lista consolidada en el email, se usa un **Text Aggregator** que construye el cuerpo del email línea por línea antes de enviarlo.

- [ ] **Step 4.1: Crear nuevo escenario en Make**

  1. Make → **Create a new scenario**
  2. Renombrar: `[Reto-05] Escenario 2 — Detección Bajo Stock y Auto-Orden`

- [ ] **Step 4.2: Módulo 1 — Schedule (trigger)**

  1. Click **+** → seleccionar **Schedule** (el trigger por defecto de Make)
  2. Configurar:
     - **Run scenario:** `Every N hours`
     - **Hours:** `6`
     - **Start:** elegir hora conveniente (ej. 8:00am en la zona horaria del restaurante)
  3. Click OK

- [ ] **Step 4.3: Módulo 2 — Google Sheets: Get All Rows**

  1. Click **+** → `Google Sheets` → **Get all rows** (o **Search Rows** sin filtro)
  2. Configurar:
     - **Spreadsheet ID:** mismo ID
     - **Sheet Name:** `Inventario`
     - **Column with headers:** `Yes — Row 1`
  3. Click OK

  > Make devuelve cada fila como un bundle independiente. Los módulos siguientes procesan cada fila de inventario una a una.

- [ ] **Step 4.4: Módulo 3 — Filter (solo productos bajo stock)**

  1. Click **+** → `Flow Control` → **Filter**
  2. Click **Add rule**
  3. Configurar la condición:
     - Campo izquierdo: mapear `current_stock` del módulo 2 (Google Sheets)
     - Operador: `Less than or equal to`
     - Campo derecho: mapear `min_threshold` del módulo 2 (Google Sheets)
  4. Click OK

  > **Por qué Filter y no filtro en Search Rows:** Make's Search Rows solo acepta valores literales como comparador, no campos mapeados del mismo row. El módulo Filter sí permite comparar dos campos del mismo bundle. Si ningún bundle pasa el filtro, el escenario termina automáticamente — sin módulos adicionales de control.

- [ ] **Step 4.5: Módulo 4 — Text Aggregator (construir cuerpo del email del manager)**

  1. Click **+** → `Flow Control` → **Text Aggregator**
  2. Configurar:
     - **Source Module:** módulo 3 (Filter)
     - **Text:**
     ```
     - {{2.product_name}}: {{2.current_stock}} {{2.unit}} (mínimo: {{2.min_threshold}} {{2.unit}})
     ```
     - **Row separator:** `New line`
  3. Click OK

  > El Text Aggregator produce un solo texto con una línea por producto bajo stock. Este texto se usa en el email al manager.

- [ ] **Step 4.6: Módulo 5 — Email: Send an Email (alerta al manager)**

  1. Click **+** → `Email` (o `Gmail`) → **Send an Email**
  2. Crear Connection → autenticar cuenta de email del restaurante
  3. Configurar:
     - **To:** email del manager (ej. `manager@restaurante.com`)
     - **Subject:** `⚠️ Alerta de inventario bajo — {{formatDate(now; "DD/MM/YYYY HH:mm")}}`
     - **Content type:** `Plain text`
     - **Content:**

  ```
  ⚠️ ALERTA DE INVENTARIO BAJO

  Los siguientes productos han alcanzado o superado su umbral mínimo de stock:

  {{4.text}}

  Se están enviando pedidos automáticos a los proveedores correspondientes.
  Los productos sin proveedor configurado en la hoja Proveedores no recibirán pedido automático — verificar manualmente.

  Fecha y hora: {{formatDate(now; "DD/MM/YYYY HH:mm")}}
  ```

  > `{{4.text}}` es el output del Text Aggregator (módulo 4), que contiene la lista consolidada de productos bajo stock.

- [ ] **Step 4.7: Módulo 6 — Google Sheets: Get All Rows (segunda pasada para proveedor loop)**

  1. Click **+** → `Google Sheets` → **Get all rows**
  2. Misma configuración que el módulo 2:
     - **Spreadsheet ID:** mismo ID
     - **Sheet Name:** `Inventario`
     - **Column with headers:** `Yes — Row 1`
  3. Click OK

  > **Por qué una segunda pasada:** El Text Aggregator (módulo 4) produce un string de texto, no un array estructurado. No se puede iterar sobre él para obtener `product_id` y contactar proveedores. La solución correcta es volver a leer el inventario desde cero y re-aplicar el mismo filtro de bajo stock para obtener bundles con datos estructurados.

- [ ] **Step 4.8: Módulo 7 — Filter (segunda pasada — solo productos bajo stock)**

  1. Click **+** → `Flow Control` → **Filter**
  2. Misma configuración que el módulo 3:
     - Campo izquierdo: mapear `current_stock` del módulo 6
     - Operador: `Less than or equal to`
     - Campo derecho: mapear `min_threshold` del módulo 6
  3. Click OK

  > Solo pasan los productos cuyo `current_stock ≤ min_threshold`. Los módulos siguientes se ejecutan una vez por cada producto bajo stock.

- [ ] **Step 4.9: Módulo 8 — Google Sheets: Search Rows (buscar proveedor)**

  1. Click **+** → `Google Sheets` → **Search Rows**
  2. Configurar:
     - **Spreadsheet ID:** mismo ID
     - **Sheet Name:** `Proveedores`
     - **Filter:** Column `product_id` | Operator `Equal to` | Value: mapear `product_id` del módulo 6 (Get All Rows — Inventario)
     - **Limit:** `1`
  3. Click OK

  > **Si no se encuentra proveedor:** Make devuelve cero bundles para ese producto — los módulos 9, 10 y 11 no se ejecutan para ese producto específico. El manager ya fue alertado en el módulo 5 con una nota indicando que productos sin proveedor configurado deben verificarse manualmente.

- [ ] **Step 4.10: Módulo 9 — Anthropic Claude: Create a Message (generar email de pedido)**

  1. Click **+** → `Anthropic Claude` → **Create a Message**
  2. Crear Connection → pegar Anthropic API Key
  3. Configurar:
     - **Model:** seleccionar `claude-3-5-haiku-20241022` en el dropdown
     - **Max tokens:** `500`
     - **Messages — Role:** `user`
     - **Messages — Content:** (mapear campos del módulo 6 — Inventario, y módulo 8 — Proveedores)

  ```
  Eres un asistente para un restaurante. Redacta un correo formal y profesional en español para solicitar reabastecimiento de un producto a un proveedor.

  Detalles:
  - Proveedor: {{8.supplier_name}}
  - Producto solicitado: {{6.product_name}}
  - Cantidad requerida: {{8.reorder_quantity}}
  - Motivo: stock bajo, se requiere reposición urgente

  Instrucciones:
  - Escribe solo el cuerpo del correo (sin asunto, sin "Asunto:", sin línea de destinatario)
  - Tono formal y cortés
  - Máximo 4 párrafos
  - Incluir saludo, cuerpo con la solicitud, datos del pedido, y despedida
  - No incluir placeholders como [Nombre del Remitente] — usar "El equipo de cocina del restaurante" como firmante
  ```

  > `{{8.supplier_name}}` y `{{8.reorder_quantity}}` vienen del módulo 8 (Proveedores). `{{6.product_name}}` viene del módulo 6 (segunda pasada de Inventario).

  4. Click OK

- [ ] **Step 4.11: Módulo 10 — Email: Send an Email (enviar pedido al proveedor)**

  1. Click **+** → `Email` (o `Gmail`) → **Send an Email**
  2. Usar la Connection de email ya creada
  3. Configurar:
     - **To:** mapear `supplier_email` del módulo 8 (Google Sheets Proveedores)
     - **Subject:** `Pedido de reabastecimiento — {{6.product_name}}`
     - **Content type:** `Plain text`
     - **Content:** mapear el campo `content[].text` del output de Claude (módulo 9)
  4. Click OK

- [ ] **Step 4.12: Módulo 11 — WhatsApp Business Cloud: Send a Text Message**

  1. Click **+** → `WhatsApp Business Cloud` → **Send a Text Message**
  2. Crear Connection:
     - **Phone Number ID:** tu WhatsApp Business Phone Number ID (obtener en Meta for Developers → Tu App → WhatsApp → API Setup)
     - **Access Token:** tu token de WhatsApp Business (formato: token permanente del sistema de Meta)
  3. Configurar:
     - **To:** mapear `supplier_whatsapp` del módulo 8 (formato E.164: `+521234567890` — sin prefijo `whatsapp:`)
     - **Message:**

  ```
  Hola {{8.supplier_name}} 👋

  Te escribimos del restaurante para informarte que acabas de recibir un correo formal con un pedido de reabastecimiento de *{{6.product_name}}* ({{8.reorder_quantity}}).

  Por favor confirma la disponibilidad respondiendo a ese correo. ¡Gracias!
  ```

  4. Click OK

- [ ] **Step 4.13: Probar Escenario 2**

  1. En la hoja Inventario, modificar manualmente el `current_stock` de 1-2 productos para que sea ≤ al `min_threshold` (ej. cambiar Carne de res de 8 a 5, que está por debajo del umbral de 15)
  2. En Make → Escenario 2 → click **Run once**
  3. Verificar:
     - [ ] Email al manager llegó con lista de texto consolidada de productos bajo stock
     - [ ] Email al proveedor llegó con cuerpo generado por Claude en español (verificar que no sea genérico — debe mencionar el producto y la cantidad específica)
     - [ ] WhatsApp al proveedor llegó con el mensaje de aviso
  4. Revisar historial de ejecución en Make — todos los módulos deben ser verdes
  5. Si algún módulo falla, revisar la sección de Notas de Implementación al final del plan

- [ ] **Step 4.14: Activar Escenario 2**

  1. Toggle **Active** en el escenario
  2. Verificar que el próximo trigger programado (en 6 horas) aparece en el panel del escenario

- [ ] **Step 4.15: Exportar blueprint y commit**

  1. Make → `⋯` → **Export Blueprint** → guardar como `scenario-2-low-stock-alert.json`
  2. Mover a `reto-05/blueprints/scenario-2-low-stock-alert.json`

  ```bash
  git add reto-05/blueprints/scenario-2-low-stock-alert.json
  git commit -m "feat(reto-05): add Scenario 2 blueprint — low stock detection, alert and auto-order"
  ```

---

## Task 5: Escribir README y finalizar

**Files:**
- Create: `reto-05/README.md`
- Modify: `README.md` (raíz del repo — marcar reto-05 como completado)

- [ ] **Step 5.1: Crear `reto-05/README.md`**

  El README debe cubrir:
  - Descripción del problema y la solución
  - Diagrama de flujo de ambos escenarios (texto)
  - Tabla de servicios usados con costo estimado
  - Instrucciones de setup paso a paso:
    1. Configurar Google Sheets (importar templates CSV)
    2. Importar Escenario 1 desde blueprint → reemplazar credenciales
    3. Importar Escenario 2 desde blueprint → reemplazar credenciales
    4. Configurar Schedule en Escenario 2
    5. Activar ambos escenarios
    6. Probar con Run once
  - Sección de notas (zona horaria, WhatsApp Business requirements, Square sandbox vs producción)
  - Estado: Completado

- [ ] **Step 5.2: Actualizar README raíz**

  Cambiar en la tabla de retos:
  ```
  | 05 | [Reto 5](./reto-05) | Pendiente |
  ```
  →
  ```
  | 05 | [Restaurant Inventory Automation](./reto-05) | Completado |
  ```

- [ ] **Step 5.3: Commit final**

  ```bash
  git add reto-05/README.md README.md
  git commit -m "docs(reto-05): add README and mark as completed"
  ```

---

## Notas de Implementación

**Square Sandbox vs Producción**
- Para desarrollo/demo usar Square Sandbox: [developer.squareup.com](https://developer.squareup.com) → crear app → usar Sandbox credentials
- El módulo Square en Make tiene campo para elegir entorno (Sandbox/Production)
- Los `product_id` en Sheets deben coincidir con los `Catalog Object ID` del entorno usado

**WhatsApp Business Cloud — Requisitos**
- Requiere cuenta verificada en Meta Business Suite
- El número de WhatsApp debe estar registrado como número Business
- Los números destinatarios deben haber iniciado conversación con el número Business en las últimas 24h (para mensajes de plantilla no aplica esta restricción, pero los mensajes de texto libre sí la tienen)
- Para demo: usar plantillas pre-aprobadas o enviar desde/hacia números que ya tienen conversación abierta

**Anthropic Claude — Costos**
- `claude-3-5-haiku` cuesta ~$0.001 por pedido generado
- Con 5 productos bajo stock simultáneamente: ~$0.005 por ejecución del escenario

**Zona Horaria en Make**
- Verificar en Make → Settings del escenario que la zona horaria esté configurada en `America/Mexico_City` o la del restaurante
- El Schedule de 6h debe considerar horario de operación real del restaurante

**Estado vacío en Escenario 2 — sin productos bajo stock**
- Si en el momento de ejecución ningún producto está bajo el umbral mínimo, el Filter (módulo 3) pasa cero bundles
- En este caso, el Text Aggregator produce un string vacío y Make puede ejecutar igualmente el Email del manager con un cuerpo vacío
- Verificar durante la prueba (Step 4.13) cuál es el comportamiento real: si el email llega vacío, agregar un Router antes del módulo 4 con la condición `total bundles > 0` para evitar alertas vacías. Make Community tiene ejemplos de este patrón bajo "empty aggregator guard"
