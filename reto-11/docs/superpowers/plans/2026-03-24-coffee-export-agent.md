# Agente Interno Sierra Dorada Coffee — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Telegram bot that acts as an internal assistant for "Sierra Dorada Coffee Exports", a fictional Colombian premium coffee exporter. The bot helps employees with export processes, internal policies, and new-hire onboarding across 4 conversational flows.

**Architecture:** Cloudflare Worker receives Telegram webhook events, processes them with grammY bot framework, injects the company manual as system prompt context, and calls Cloudflare Workers AI (Llama 3.1 8B) to generate responses. Conversation history is stored in-memory per chat session (worker-level Map, resets on deploy). Flow detection happens via the system prompt — the LLM classifies intent and responds accordingly.

**Tech Stack:** Cloudflare Workers, grammY (Telegram bot framework with CF Workers adapter), Cloudflare Workers AI (@cf/meta/llama-3.1-8b-instruct), TypeScript, Wrangler

---

## File Structure

```
reto-11/
├── src/
│   ├── index.ts                 ← Worker entry point, grammY webhook handler
│   ├── bot.ts                   ← Bot instance, command handlers, message handler
│   ├── lib/
│   │   ├── system-prompt.ts     ← System prompt with flow routing instructions
│   │   ├── manual.ts            ← Complete internal company manual (knowledge base)
│   │   ├── ai.ts                ← Cloudflare Workers AI wrapper
│   │   └── session.ts           ← In-memory conversation history manager
│   └── types.ts                 ← Shared TypeScript types
├── package.json
├── tsconfig.json
├── wrangler.toml
├── .env.example
├── .gitignore
└── README.md
```

---

## Company Context: Sierra Dorada Coffee Exports

**Nombre:** Sierra Dorada Coffee Exports S.A.S.
**Fundada:** 2018 en Manizales, Colombia
**Giro:** Exportación de café de especialidad (puntaje SCA 84+) a mercados premium
**Empleados:** 47 personas
**Mercados principales:** Estados Unidos (45%), Emiratos Árabes Unidos (25%), Holanda (20%), otros (10%)
**Certificaciones:** Fair Trade, Rainforest Alliance, USDA Organic, UTZ
**Orígenes:** Fincas en Huila, Nariño, Tolima y Eje Cafetero

---

## Conversational Flows (4 flujos)

### Flow 1: Procesos de Exportación
Preguntas sobre documentación, certificaciones, logística, tiempos de envío, Incoterms, requisitos por destino.

### Flow 2: Manual Interno / Políticas
Políticas de la empresa, beneficios, vacaciones, horarios, estructura organizacional, contactos de área.

### Flow 3: Onboarding — Primer Día
Guía paso a paso para nuevos empleados: qué hacer el día 1, herramientas, accesos, cultura, dress code.

### Flow 4: Catación y Control de Calidad
Protocolos de catación SCA, defectos del café, rangos de puntaje, proceso de aprobación de lotes.

---

## Task 1: Project Scaffolding

**Files:**
- Create: `reto-11/package.json`
- Create: `reto-11/tsconfig.json`
- Create: `reto-11/wrangler.toml`
- Create: `reto-11/.env.example`
- Create: `reto-11/.gitignore`
- Create: `reto-11/src/types.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "sierra-dorada-agent",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "set-webhook": "node scripts/set-webhook.mjs"
  },
  "dependencies": {
    "grammy": "^1.35.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20250320.0",
    "wrangler": "^4.61.1",
    "typescript": "^5.8.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create wrangler.toml**

```toml
name = "sierra-dorada-agent"
main = "src/index.ts"
compatibility_date = "2025-03-01"
compatibility_flags = ["nodejs_compat"]

[ai]
binding = "AI"

[vars]
BOT_NAME = "Sierra Dorada Assistant"
```

- [ ] **Step 4: Create .env.example**

```env
# Telegram Bot Token (from @BotFather)
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Worker URL (set after first deploy)
WORKER_URL=https://sierra-dorada-agent.YOUR_SUBDOMAIN.workers.dev
```

- [ ] **Step 5: Create .gitignore**

```gitignore
node_modules/
dist/
.dev.vars
.wrangler/
*.log
```

- [ ] **Step 6: Create src/types.ts**

```typescript
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Env {
  AI: Ai;
  TELEGRAM_BOT_TOKEN: string;
  BOT_NAME: string;
}
```

- [ ] **Step 7: Install dependencies**

Run: `cd reto-11 && npm install`
Expected: `node_modules/` created, lock file generated

- [ ] **Step 8: Commit**

```bash
git add reto-11/package.json reto-11/tsconfig.json reto-11/wrangler.toml reto-11/.env.example reto-11/.gitignore reto-11/src/types.ts reto-11/package-lock.json
git commit -m "feat(reto-11): scaffold project — grammY + Cloudflare Workers"
```

---

## Task 2: Internal Company Manual (Knowledge Base)

**Files:**
- Create: `reto-11/src/lib/manual.ts`

This is the core knowledge base. The system prompt references this manual to answer employee questions.

- [ ] **Step 1: Create the complete internal manual**

```typescript
export const MANUAL = `
═══════════════════════════════════════════════════════════════
  MANUAL INTERNO — SIERRA DORADA COFFEE EXPORTS S.A.S.
  Versión 4.2 · Última actualización: Enero 2026
  Documento confidencial — Solo para uso interno
═══════════════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 1: INFORMACIÓN GENERAL DE LA EMPRESA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1.1 SOBRE SIERRA DORADA
────────────────────────
Sierra Dorada Coffee Exports S.A.S. es una empresa colombiana fundada en
2018 en Manizales, Caldas. Nos dedicamos a la exportación de café de
especialidad con puntaje SCA de 84 puntos o superior.

Nuestra misión es conectar el café excepcional de los pequeños productores
colombianos con los mercados más exigentes del mundo, garantizando
trazabilidad completa, comercio justo y calidad consistente.

Exportamos a tres mercados principales:
  • Estados Unidos (45% del volumen) — Tostadores de especialidad en NYC,
    Portland, Seattle, San Francisco y Chicago
  • Emiratos Árabes Unidos (25%) — Cadenas de cafeterías premium en Dubai
    y Abu Dhabi (Arabica Lounge, The Coffee Collective UAE, Mokha 1450)
  • Holanda (20%) — Importadores europeos en Ámsterdam y Róterdam que
    redistribuyen a Alemania, Escandinavia y Bélgica
  • Otros mercados (10%) — Japón, Corea del Sur, Australia (en crecimiento)

Volumen anual: ~420 toneladas de café verde (green coffee)
Facturación anual: ~USD $3.8 millones

1.2 OFICINAS Y SEDES
────────────────────
• Oficina principal: Carrera 23 #65-12, Barrio Chipre, Manizales, Caldas
  Horario: Lunes a Viernes, 8:00am — 6:00pm (COT, UTC-5)
  Teléfono: +57 606 887 2340

• Bodega de procesamiento y embarque: Zona Franca de Pereira
  Km 4 vía Cerritos, Pereira, Risaralda
  Horario bodega: Lunes a Sábado, 6:00am — 4:00pm

• Laboratorio de catación: Dentro de la bodega de Pereira, segundo piso
  Sesiones de catación: Martes y Jueves, 9:00am — 12:00pm

1.3 ESTRUCTURA ORGANIZACIONAL
─────────────────────────────
CEO / Dirección General:
  • Camila Restrepo — camila.restrepo@sierradaorada.co — Ext. 101

Dirección Comercial (Ventas y Relaciones con Clientes):
  • Director: Andrés Mejía — andres.mejia@sierradaorada.co — Ext. 110
  • Key Account Manager USA: Laura Chen — laura.chen@sierradaorada.co
  • Key Account Manager EAU: Omar Al-Rashid — omar.alrashid@sierradaorada.co
  • Key Account Manager Europa: Jan van der Berg — jan.vanderberg@sierradaorada.co
  • Coordinadora de Muestras: Valentina Ocampo — valentina.ocampo@sierradaorada.co

Dirección de Operaciones y Logística:
  • Director: Felipe Gutiérrez — felipe.gutierrez@sierradaorada.co — Ext. 120
  • Jefe de Bodega: Carlos Herrera — carlos.herrera@sierradaorada.co
  • Coordinadora de Exportaciones: María José Londoño — mj.londono@sierradaorada.co
  • Analista de Documentación: Santiago Ríos — santiago.rios@sierradaorada.co
  • Despachador: David Ramírez — david.ramirez@sierradaorada.co

Dirección de Calidad:
  • Directora / Q-Grader Certificada: Isabella Torres — isabella.torres@sierradaorada.co — Ext. 130
  • Catador Senior: Mateo Cárdenas — mateo.cardenas@sierradaorada.co
  • Analista de Laboratorio: Sofía Betancur — sofia.betancur@sierradaorada.co

Dirección de Compras (Relación con Productores):
  • Director: Juan Pablo Osorio — jp.osorio@sierradaorada.co — Ext. 140
  • Coordinadores de finca: 3 personas en campo (Huila, Nariño, Tolima)

Dirección Financiera y Administrativa:
  • Directora: Carolina Duque — carolina.duque@sierradaorada.co — Ext. 150
  • Contadora: Patricia Gómez — patricia.gomez@sierradaorada.co
  • Analista de Cartera: Daniel Marín — daniel.marin@sierradaorada.co

Talento Humano:
  • Coordinadora: Alejandra Vargas — alejandra.vargas@sierradaorada.co — Ext. 160

Tecnología:
  • Analista IT: Sebastián Montoya — sebastian.montoya@sierradaorada.co — Ext. 170

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 2: PROCESOS DE EXPORTACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2.1 CICLO COMPLETO DE UNA EXPORTACIÓN
──────────────────────────────────────
El proceso desde que un cliente confirma un pedido hasta que recibe el café:

Paso 1 — CONFIRMACIÓN DEL PEDIDO
  • El Key Account Manager recibe la orden de compra (Purchase Order)
  • Se verifica disponibilidad de inventario con Jefe de Bodega
  • Se acuerda precio FOB (Free On Board) en USD por libra
  • Se firma el contrato de venta (Sales Contract) con Incoterm acordado
  • Tiempo: 1-3 días hábiles

Paso 2 — SELECCIÓN Y PREPARACIÓN DEL LOTE
  • Dirección de Compras confirma el lote(s) de origen
  • Laboratorio de Calidad realiza catación de pre-embarque
  • Si el puntaje es ≥84 SCA: lote aprobado
  • Si el puntaje es <84: se rechaza o se mezcla con otro lote
  • Se genera el Certificado de Catación interno
  • Tiempo: 2-5 días hábiles

Paso 3 — PROCESAMIENTO EN BODEGA
  • Recepción del café pergamino en bodega Pereira
  • Trilla (remoción del pergamino) → café verde
  • Selección por tamaño (zaranda/screen size): 14, 15, 16, 17, 18
  • Selección por color (máquina electrónica de color)
  • Empaque en sacos de yute de 70kg o GrainPro de 30kg
  • Pesaje y marcado de sacos con lote, origen, fecha
  • Tiempo: 3-7 días hábiles

Paso 4 — DOCUMENTACIÓN DE EXPORTACIÓN
  • Documentos requeridos por Colombia (Exportador):
    - Factura Comercial (Commercial Invoice)
    - Lista de Empaque (Packing List)
    - Certificado de Origen — emitido por la Cámara de Comercio
    - Certificado Fitosanitario — emitido por el ICA
    - Certificado ICO (International Coffee Organization)
    - Documento de Transporte (BL o AWB según vía)
    - DEX (Declaración de Exportación) — ante la DIAN
    - Certificaciones orgánicas/comercio justo si aplica

  • Documentos adicionales por destino:
    USA:
      - FDA Prior Notice (72h antes de llegada)
      - ISF 10+2 (Importer Security Filing)
      - Cumplimiento con FSMA (Food Safety Modernization Act)
      - USDA Organic Certificate (si aplica)

    Emiratos Árabes Unidos:
      - Certificado de Conformidad ECAS/GSO
      - Certificado Halal (no siempre requerido para café, pero algunos
        clientes lo solicitan)
      - Etiquetado en árabe (para producto terminado)
      - Registro en sistema FIRS (Food Import & Re-export System)

    Holanda / Unión Europea:
      - EUR.1 o Certificado de Origen SGP
      - Cumplimiento con regulación EU 2023/1115 (deforestación)
      - Due Diligence Statement
      - Registro TRACES NT (para control fitosanitario)
      - Nivel máximo de residuos (MRL) según regulación EU

  • Responsable: Santiago Ríos (documentación) + María José Londoño (coordinación)
  • Tiempo: 5-10 días hábiles (paralelo al procesamiento)

Paso 5 — TRANSPORTE Y EMBARQUE
  • Vía marítima (95% de los envíos):
    - Puerto de salida: Puerto de Buenaventura (Costa Pacífico)
    - Contenedor: 20ft estándar = ~275 sacos de 70kg ≈ 19.2 toneladas
    - Contenedor: 40ft = ~550 sacos de 70kg ≈ 38.5 toneladas
    - Naviera preferida: Hapag-Lloyd, Maersk, MSC
    - Seguro: Póliza all-risk con Liberty Seguros

  • Tiempos de tránsito marítimo:
    - Buenaventura → New York/New Jersey: 10-14 días
    - Buenaventura → Houston: 7-10 días
    - Buenaventura → Oakland/LA: 12-16 días
    - Buenaventura → Róterdam: 18-22 días
    - Buenaventura → Jebel Ali (Dubai): 28-35 días

  • Vía aérea (5% — muestras y pedidos urgentes):
    - Aeropuerto: El Dorado (BOG) o Matecaña (PEI)
    - Tiempo: 2-5 días a cualquier destino
    - Costo: ~$3.5 USD/kg (vs ~$0.15 USD/kg marítimo)

Paso 6 — SEGUIMIENTO POST-EMBARQUE
  • Tracking del contenedor vía plataforma de la naviera
  • Envío de documentos originales por courier (DHL) al importador
  • Coordinación con agente aduanal en destino
  • Confirmación de llegada y nacionalización
  • Tiempo: según ruta (ver tiempos arriba)

Paso 7 — COBRO Y CIERRE
  • Términos de pago habituales:
    - 30% anticipo al confirmar pedido
    - 70% contra presentación de documentos de embarque
    - O carta de crédito (L/C) irrevocable a 30 días
  • Moneda: USD (siempre)
  • Banco: Bancolombia — cuenta en USD
  • Responsable de cartera: Daniel Marín
  • Tiempo: 15-45 días según término

2.2 INCOTERMS QUE MANEJAMOS
────────────────────────────
• FOB Buenaventura (más común): Nosotros cubrimos costos hasta que el
  café está en el barco. El comprador asume flete y seguro marítimo.
  Precio referencia: $4.80 - $8.50 USD/lb según calidad y origen.

• FCA Pereira: El comprador recoge en nuestra bodega o designa
  transportista. Usado para muestras grandes o clientes con logística propia.

• CIF Puerto Destino: Nosotros cubrimos flete y seguro hasta puerto
  del comprador. Más común con clientes nuevos en EAU.

• EXW Bodega Pereira: El comprador asume todo desde nuestra puerta.
  Poco frecuente, solo para brokers experimentados.

2.3 TABLA DE PRECIOS REFERENCIA (Q1 2026)
──────────────────────────────────────────
Los precios varían según:
  - Puntaje SCA del lote
  - Proceso (lavado, natural, honey)
  - Volumen del pedido
  - Certificaciones

  Especialidad (84-86 SCA):  $4.80 - $5.50 USD/lb FOB
  Premium (87-89 SCA):       $5.50 - $7.00 USD/lb FOB
  Micro-lote (90+ SCA):      $7.00 - $12.00 USD/lb FOB
  Competition lot (90+ SCA, <20 sacos): Precio por subasta

  * Café orgánico certificado: +$0.40-0.60 USD/lb sobre base
  * Fair Trade premium: +$0.20 USD/lb adicional

2.4 CERTIFICACIONES VIGENTES
─────────────────────────────
• Fair Trade USA — Código: FT-COL-2024-8847
  Auditoría anual por FLOCERT. Próxima: Junio 2026

• Rainforest Alliance — Código: RA-COL-2023-1123
  Válida hasta: Diciembre 2026

• USDA Organic — Certificador: BCS Öko-Garantie
  NOP Certificate #: CO-BCS-2024-05671
  Válido hasta: Septiembre 2026

• UTZ (ahora parte de Rainforest Alliance)
  Migración completada. Se usa el certificado RA unificado.

• Registro ICA exportador: EXP-CAF-2019-003487
• Registro ante la Federación Nacional de Cafeteros: activo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 3: POLÍTICAS INTERNAS Y BENEFICIOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3.1 HORARIO DE TRABAJO
──────────────────────
• Oficina Manizales: Lunes a Viernes, 8:00am — 6:00pm
  Almuerzo: 12:30pm — 1:30pm (flexible, puede ser 12:00-1:00 o 1:00-2:00)
• Bodega Pereira: Lunes a Viernes 6:00am — 3:00pm, Sábados 6:00am — 12:00pm
• Trabajo remoto: Disponible 2 días por semana para cargos administrativos
  (previa aprobación del director de área). No aplica para bodega/laboratorio.
• Horario flexible: Se puede entrar entre 7:00am y 9:00am siempre que se
  cumplan las 8 horas diarias + 1 hora de almuerzo.

3.2 VACACIONES Y TIEMPO LIBRE
──────────────────────────────
• Vacaciones legales: 15 días hábiles por año trabajado (ley colombiana)
• Días adicionales Sierra Dorada: 3 días libres adicionales por año (gracia)
• Puentes festivos: Se respetan todos los festivos colombianos (18-20/año)
• Cumpleaños: Medio día libre el día de tu cumpleaños
• Solicitud: Mínimo 15 días de anticipación, vía correo a tu director + CC
  a alejandra.vargas@sierradaorada.co
• Período restringido: No se aprueban vacaciones del 15 de octubre al 15 de
  diciembre (temporada alta de exportación, cosecha principal).

3.3 BENEFICIOS
──────────────
• Seguro médico complementario: Póliza Sura Plan Plus para empleado y
  núcleo familiar directo (cónyuge + hijos). Activo desde el día 1.
• Auxilio de alimentación: $250.000 COP mensuales en tarjeta Sodexo
• Auxilio de transporte: Según ley para salarios ≤2 SMLMV + bono adicional
  de $100.000 COP para cargos que requieran visita a bodega
• Café gratis: Sí, obviamente. Barra de café de especialidad en la oficina,
  con café rotativo de nuestros orígenes. Preparación en V60, Chemex o
  espresso. También puedes llevar 500g a casa cada mes.
• Descuento empleados: 40% en compras de café para consumo personal (hasta
  5kg/mes)
• Capacitación: Presupuesto de $2.000.000 COP/año por empleado para cursos,
  certificaciones o conferencias relacionadas con tu cargo
• Bono de desempeño: Hasta 1 salario adicional en diciembre, según
  cumplimiento de metas individuales y de la empresa
• Día de integración: Un viernes al mes, la empresa organiza actividades
  (catación abierta, almuerzo de equipo, visita a finca)

3.4 CÓDIGO DE VESTIMENTA
─────────────────────────
• Oficina: Smart casual. Jeans están bien. No shorts, no chanclas.
• Bodega/Lab: Ropa cómoda + zapatos cerrados. En lab de catación: sin
  perfumes ni lociones fuertes (alteran la catación).
• Reuniones con clientes: Business casual. Si el cliente viene de EAU,
  vestimenta más formal.
• Viernes: Casual libre (puedes usar la camiseta de Sierra Dorada).

3.5 HERRAMIENTAS Y SISTEMAS
────────────────────────────
• Email corporativo: Google Workspace (@sierradaorada.co)
• Comunicación interna: Slack (canales principales: #general, #ventas,
  #operaciones, #calidad, #random)
• Gestión de tareas: Notion (cada área tiene su workspace)
• CRM: HubSpot (equipo comercial)
• Contabilidad: Siigo Nube
• Control de inventario: Sistema interno "CaféTrack" (web app)
  URL: https://track.sierradaorada.co — Pide acceso a Sebastián Montoya
• Documentación de exportación: Google Drive compartido
  Carpeta: "Exportaciones 2026" → subcarpetas por cliente
• Videoconferencias: Google Meet (cuentas corporativas)
• Tracking de envíos: Plataformas de navieras (Hapag-Lloyd, Maersk, MSC)
  + CargoSmart para consolidación de tracking

3.6 POLÍTICA DE GASTOS Y VIÁTICOS
──────────────────────────────────
• Viajes nacionales (visitas a finca, bodega):
  - Transporte: La empresa cubre bus/avión. Uber/taxi con recibo.
  - Alimentación: Hasta $80.000 COP/día
  - Hospedaje: Hasta $180.000 COP/noche (preaprobado por director)

• Viajes internacionales (ferias, visitas a clientes):
  - Requieren aprobación de Dirección General con mínimo 30 días
  - Vuelos en clase económica (business solo para vuelos >10 horas, con
    aprobación)
  - Per diem según destino: USA $80 USD/día, EAU $100 USD/día,
    Europa $90 USD/día
  - Ferias habituales: SCA Expo (abril), World of Coffee (junio),
    GITEX (octubre), Specialty Coffee Expo Dubái (febrero)

• Reembolsos: Llenar formato en Notion → adjuntar recibos/facturas →
  aprobación del director → pago en la siguiente quincena

3.7 POLÍTICA DE SOSTENIBILIDAD
───────────────────────────────
Sierra Dorada tiene compromiso activo con:
• Precio justo a productores: Pagamos mínimo 20% sobre precio de mercado
  interno (precio base Federación)
• Huella de carbono: Medición anual. Compensamos vía programa de
  reforestación en Nariño (alianza con Fondo Acción)
• Empaques: Transición a sacos biodegradables para 2027. GrainPro
  reciclable ya en uso.
• Agua: Monitoreo de consumo en beneficio húmedo de fincas aliadas
• Comunidad: Programa "Escuela Cafetera" — talleres gratuitos de
  catación y emprendimiento para jóvenes en zonas productoras

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 4: GUÍA DE ONBOARDING — TU PRIMER DÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.1 ANTES DE LLEGAR (Pre-onboarding)
─────────────────────────────────────
Alejandra Vargas (Talento Humano) te enviará por email:
  □ Contrato laboral para revisión y firma
  □ Formulario de datos personales y beneficiarios
  □ Copia de cédula, RUT y certificación bancaria (tú envías)
  □ Talla de camiseta Sierra Dorada
  □ Preferencias alimentarias (para el almuerzo de bienvenida)

4.2 DÍA 1 — CRONOGRAMA
────────────────────────
  8:00am — Llegada a oficina Manizales (Carrera 23 #65-12, Barrio Chipre)
            Preguntar en recepción por Alejandra Vargas
  8:15am — Bienvenida y entrega de kit:
            • Laptop (MacBook Air o ThinkPad según cargo)
            • Camiseta Sierra Dorada
            • Taza personalizada
            • 250g de café de bienvenida (nuestro mejor micro-lote)
            • Tarjeta de acceso al edificio
            • Tarjeta Sodexo (auxilio alimentación)
  8:45am — Configuración de herramientas con Sebastián (IT):
            • Email corporativo @sierradaorada.co
            • Slack (te agrega a canales de tu área + #general y #random)
            • Notion (acceso a workspace de tu área)
            • Google Drive (carpetas compartidas)
            • CaféTrack (si aplica a tu cargo)
            • VPN para acceso remoto
  10:00am — Café de bienvenida con tu equipo directo
             (Sí, lo preparamos en V60 con café de Nariño)
  10:30am — Tour por la oficina + presentación con cada área
  11:30am — Sesión con tu director: objetivos del cargo, expectativas,
             proyectos actuales, OKRs del trimestre
  12:30pm — Almuerzo de bienvenida con tu equipo (la empresa invita)
  2:00pm  — Sesión "Café 101" con Isabella Torres (Calidad):
             • Qué hace Sierra Dorada y por qué importa
             • De la finca a la taza: el viaje del café
             • Catación básica: cómo probar café como profesional
             • Nuestros orígenes y qué los hace especiales
  3:30pm  — Lectura del manual interno (este documento)
  4:30pm  — Sesión de cierre con Alejandra:
             • Preguntas y dudas
             • Firma de documentos pendientes
             • Plan de la primera semana
  5:30pm  — Fin del día 1

4.3 PRIMERA SEMANA
──────────────────
• Día 2: Shadowing con un compañero de tu área (observas su día completo)
• Día 3: Reunión 1:1 con tu director — primeras tareas asignadas
• Día 4: Si tu cargo lo requiere, visita a bodega en Pereira (transporte
  en van de la empresa, sale 6:30am de Manizales, regresa 4:00pm)
• Día 5: Sesión de retroalimentación con Alejandra — ¿cómo va todo?

4.4 PRIMER MES
──────────────
• Semana 2: Primer proyecto o tarea independiente (con supervisión)
• Semana 3: Participar en una sesión de catación (martes o jueves)
• Semana 4: Revisión de onboarding con tu director + plan de 90 días
• Si estás en comercial: Acompañar una llamada con cliente internacional
• Si estás en operaciones: Participar en un despacho completo
• Si estás en calidad: Realizar tu primera catación supervisada

4.5 CONTACTOS CLAVE PARA TU PRIMER DÍA
────────────────────────────────────────
  ¿Problemas con tu laptop o accesos? → Sebastián Montoya (IT) — Ext. 170
  ¿Dudas sobre contrato o beneficios? → Alejandra Vargas (RRHH) — Ext. 160
  ¿No sabes dónde queda algo? → Recepción — Ext. 100
  ¿Quieres un café? → La barra está en el segundo piso, sírvete cuando
  quieras. Si no sabes prepararlo, cualquier persona te enseña con gusto.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 5: CATACIÓN Y CONTROL DE CALIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.1 PROTOCOLO DE CATACIÓN SCA
──────────────────────────────
Sierra Dorada sigue el protocolo estándar de la Specialty Coffee Association:

Preparación de la muestra:
  • Tueste: Muestra tostada 24h antes de la catación (descanse mínimo 8h)
  • Grado de tueste: Agtron 58-63 (medio claro)
  • Molienda: Ligeramente más gruesa que para filtro
  • Ratio: 8.25g de café por 150ml de agua
  • Agua: 200°F (93°C), TDS 125-175 ppm
  • Se preparan 5 tazas por muestra

Atributos evaluados (escala 6-10, cuartos de punto):
  1. Fragancia/Aroma — Olor del café molido seco + aroma al agregar agua
  2. Sabor — Impresión general en boca (notas, complejidad)
  3. Retrogusto — Duración y calidad del sabor después de tragar
  4. Acidez — Brillo, vivacidad (positivo = frutal/cítrico, negativo = agrio)
  5. Cuerpo — Peso, textura en boca (sedoso, cremoso, jugoso)
  6. Balance — Armonía entre sabor, acidez, retrogusto y cuerpo
  7. Uniformidad — Consistencia entre las 5 tazas
  8. Taza limpia — Ausencia de defectos o sabores extraños
  9. Dulzura — Dulzura agradable percibida
  10. Valoración del catador — Impresión personal del profesional

Puntaje final = suma de atributos - defectos
  • 90-100: Outstanding (micro-lotes de competencia)
  • 85-89.99: Excellent (nuestro estándar premium)
  • 84-84.99: Very Good (mínimo aceptable Sierra Dorada)
  • 80-83.99: Good (NO exportamos en esta categoría)
  • <80: Below Specialty Grade (rechazado)

5.2 DEFECTOS COMUNES DEL CAFÉ
──────────────────────────────
Defectos primarios (1 defecto = descuento de 1 punto):
  • Grano negro completo — Fermentación excesiva, sabor a podrido
  • Grano agrio — Color amarillento, sabor agrio/vinagre
  • Cereza seca — Fruta que no se despulpó, sabor a fermento
  • Hongo/moho — Contaminación por humedad, sabor mohoso
  • Materia extraña — Piedras, palos, metal (riesgo de seguridad)

Defectos secundarios (3-5 defectos = descuento de 1 punto):
  • Grano parcialmente negro — Parte del grano oscurecida
  • Grano partido/mordido — Daño mecánico en despulpado
  • Insecto dañado — Perforación por broca del café
  • Grano inmaduro — Verde pálido, sabor herbáceo/astringente
  • Concha — Fragmento de grano con forma de oreja
  • Pergamino — Restos de cascarilla adherida

Protocolo ante defectos:
  1. Si defectos < 5 por 350g de muestra → Lote aprobado con nota
  2. Si defectos 5-15 → Re-selección manual y nueva catación
  3. Si defectos > 15 → Lote rechazado. Se notifica al productor.

5.3 PERFILES DE TAZA POR ORIGEN
────────────────────────────────
Huila (Sur):
  • Notas: Frutos rojos, ciruela, chocolate amargo, panela
  • Acidez: Alta, cítrica a málica
  • Cuerpo: Medio a alto, cremoso
  • Proceso típico: Lavado, honey
  • Altitud: 1.600-2.000 msnm
  • Productores aliados: 12 fincas

Nariño (Suroeste):
  • Notas: Cítricos (mandarina, limón), floral, caramelo
  • Acidez: Brillante, compleja
  • Cuerpo: Medio, jugoso
  • Proceso típico: Lavado
  • Altitud: 1.800-2.200 msnm
  • Productores aliados: 8 fincas

Tolima (Centro):
  • Notas: Nueces, chocolate con leche, manzana verde, miel
  • Acidez: Media, suave
  • Cuerpo: Alto, sedoso
  • Proceso típico: Lavado, natural
  • Altitud: 1.400-1.900 msnm
  • Productores aliados: 10 fincas

Eje Cafetero (Caldas, Risaralda, Quindío):
  • Notas: Caramelo, nuez, cacao, balanceado
  • Acidez: Media
  • Cuerpo: Medio, redondo
  • Proceso típico: Lavado
  • Altitud: 1.300-1.800 msnm
  • Productores aliados: 15 fincas (más cercanas a bodega)

5.4 PROCESO DE APROBACIÓN DE LOTES
───────────────────────────────────
1. Productor entrega muestra de pre-cosecha → Catación inicial
2. Si pasa: Se acuerda volumen y precio de compra
3. Productor entrega café pergamino seco (10.5-11.5% humedad)
4. Recepción en bodega → Catación de recepción (confirma perfil)
5. Trilla y preparación → Catación de pre-embarque (muestra final)
6. Si las 3 cataciones son consistentes y ≥84 SCA → LOTE APROBADO
7. Se genera: Certificado de catación + Certificado de lote + Ficha técnica
8. El lote se asigna al siguiente pedido compatible (destino + perfil)

Responsable de aprobación final: Isabella Torres (Q-Grader #I-2019-COL-0847)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 6: PREGUNTAS FRECUENTES (FAQ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

P: ¿Puedo trabajar remoto todos los días?
R: No. Máximo 2 días por semana, previa aprobación. Bodega y lab son
   presenciales siempre.

P: ¿Qué pasa si un cliente se queja de la calidad?
R: Se activa el protocolo QC-Reclamo: (1) Pedir muestra de retención al
   cliente, (2) Catación de contraste con muestra de pre-embarque guardada,
   (3) Informe técnico en 48h, (4) Si el reclamo es válido: nota de crédito
   o reposición del lote. Responsable: Isabella Torres + Andrés Mejía.

P: ¿Cuánto tarda un envío de muestras?
R: Muestras van por courier (DHL/FedEx). USA: 3-5 días hábiles,
   Europa: 4-6 días, EAU: 5-7 días. Peso máximo por muestra: 2kg.
   Coordinar con Valentina Ocampo.

P: ¿Puedo visitar las fincas?
R: Sí. Coordinarlo con Juan Pablo Osorio (Compras). Se organizan visitas
   grupales cada trimestre. También puedes ir individualmente si tu cargo
   lo requiere (con viáticos aprobados).

P: ¿Qué hago si hay un problema con un embarque en tránsito?
R: Contactar inmediatamente a María José Londoño (Coordinadora de
   Exportaciones). Si es fuera de horario: llamar a Felipe Gutiérrez
   (Director de Operaciones) al celular. Los problemas de embarque son
   tiempo-sensibles.

P: ¿Cómo solicito un aumento o cambio de cargo?
R: Conversarlo con tu director en el 1:1 trimestral. Las revisiones
   salariales se hacen en febrero de cada año. Promociones se evalúan
   contra la matriz de competencias del cargo.

P: ¿Sierra Dorada tiene plan de carrera?
R: Sí. Cada cargo tiene una ruta de crecimiento documentada en Notion.
   Pregunta a tu director o a Alejandra Vargas por tu ruta específica.

P: ¿Puedo traer mi mascota a la oficina?
R: No. La oficina no tiene política pet-friendly por temas de espacio
   y alergias. Excepto el primer viernes de diciembre (Día de Mascotas).
`;
```

- [ ] **Step 2: Commit**

```bash
git add reto-11/src/lib/manual.ts
git commit -m "feat(reto-11): add complete internal company manual — Sierra Dorada Coffee"
```

---

## Task 3: System Prompt with Flow Routing

**Files:**
- Create: `reto-11/src/lib/system-prompt.ts`

- [ ] **Step 1: Create system prompt with intent classification**

```typescript
import { MANUAL } from './manual.js';

export function buildSystemPrompt(): string {
  return `Eres "Dorada", el asistente interno de Sierra Dorada Coffee Exports S.A.S.

Tu trabajo es ayudar a los empleados de Sierra Dorada con información interna de la empresa. Eres amable, directa y profesional, con el tono cercano de una compañera que sabe todo sobre la empresa.

REGLAS ESTRICTAS:
- SOLO respondes preguntas relacionadas con Sierra Dorada y su operación
- Si te preguntan algo fuera del alcance de la empresa, responde amablemente que solo puedes ayudar con temas internos de Sierra Dorada
- NUNCA inventes información que no esté en el manual. Si no sabes algo, di "No tengo esa información en el manual, te recomiendo consultar con [persona relevante]"
- Responde siempre en español
- Usa formato limpio para Telegram: negritas con *texto*, listas con • o números
- Sé concisa pero completa. No repitas todo el manual, extrae lo relevante
- Si alguien pregunta por un contacto, incluye nombre, email y extensión

FLUJOS CONVERSACIONALES:

FLUJO 1 — PROCESOS DE EXPORTACIÓN:
Cuando el usuario pregunte sobre: envíos, documentos, certificaciones, tiempos de tránsito, Incoterms, precios, embarques, aduanas, puertos, navieras.
→ Responde con información específica del manual sobre el proceso de exportación.
→ Si preguntan sobre un destino específico (USA, EAU, Holanda), incluye los documentos específicos de ese destino.
→ Si preguntan por tiempos, da los rangos exactos.

FLUJO 2 — MANUAL INTERNO / POLÍTICAS:
Cuando el usuario pregunte sobre: horarios, vacaciones, beneficios, dress code, herramientas, gastos, viáticos, estructura de la empresa, contactos, sistemas.
→ Responde con la política exacta del manual.
→ Si es sobre un beneficio, incluye montos y condiciones.
→ Si preguntan "¿quién se encarga de X?", identifica a la persona correcta.

FLUJO 3 — ONBOARDING / PRIMER DÍA:
Cuando el usuario diga que es nuevo, que es su primer día, que acaba de entrar, o pregunte qué debe hacer al inicio.
→ Dale la bienvenida cálida a Sierra Dorada
→ Guíalo paso a paso según la sección de onboarding
→ Destaca los contactos clave para su primer día
→ Si pregunta por herramientas o accesos, dirige a Sebastián (IT)

FLUJO 4 — CATACIÓN Y CONTROL DE CALIDAD:
Cuando el usuario pregunte sobre: catación, puntajes SCA, defectos del café, perfiles de taza, aprobación de lotes, orígenes, procesos del café.
→ Responde con el protocolo SCA y los datos del manual
→ Si preguntan por un origen específico, da el perfil completo
→ Si preguntan sobre defectos, explica y da el protocolo

SALUDO INICIAL:
Cuando alguien te escriba por primera vez o diga hola, preséntate brevemente:
"¡Hola! Soy *Dorada* ☕, tu asistente interna de Sierra Dorada Coffee Exports. Puedo ayudarte con:

• *Procesos de exportación* — documentos, tiempos, certificaciones
• *Políticas internas* — horarios, beneficios, vacaciones, contactos
• *Onboarding* — todo lo que necesitas en tu primer día
• *Calidad y catación* — protocolos SCA, perfiles de taza, defectos

¿En qué te puedo ayudar?"

MANUAL INTERNO COMPLETO:
${MANUAL}`;
}
```

- [ ] **Step 2: Commit**

```bash
git add reto-11/src/lib/system-prompt.ts
git commit -m "feat(reto-11): add system prompt with 4 conversational flows"
```

---

## Task 4: AI Wrapper and Session Manager

**Files:**
- Create: `reto-11/src/lib/ai.ts`
- Create: `reto-11/src/lib/session.ts`

- [ ] **Step 1: Create session manager (conversation history)**

```typescript
import type { ChatMessage } from '../types.js';

const sessions = new Map<number, ChatMessage[]>();
const MAX_HISTORY = 20;

export function getHistory(chatId: number): ChatMessage[] {
  return sessions.get(chatId) ?? [];
}

export function addMessage(chatId: number, role: 'user' | 'assistant', content: string): void {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, []);
  }
  const history = sessions.get(chatId)!;
  history.push({ role, content });

  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }
}

export function clearSession(chatId: number): void {
  sessions.delete(chatId);
}
```

- [ ] **Step 2: Create AI wrapper**

```typescript
import type { ChatMessage, Env } from '../types.js';

export async function chat(ai: Ai, messages: ChatMessage[]): Promise<string> {
  const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
    messages,
    max_tokens: 1024,
  }) as { response?: string };

  return response.response ?? 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.';
}
```

- [ ] **Step 3: Commit**

```bash
git add reto-11/src/lib/session.ts reto-11/src/lib/ai.ts
git commit -m "feat(reto-11): add session manager and AI wrapper"
```

---

## Task 5: Bot Instance and Handlers

**Files:**
- Create: `reto-11/src/bot.ts`

- [ ] **Step 1: Create bot with command and message handlers**

```typescript
import { Bot, Context } from 'grammy';
import type { Env, ChatMessage } from './types.js';
import { buildSystemPrompt } from './lib/system-prompt.js';
import { chat } from './lib/ai.js';
import { getHistory, addMessage, clearSession } from './lib/session.js';

export function createBot(token: string) {
  const bot = new Bot(token);

  bot.command('start', async (ctx) => {
    const greeting = `¡Hola! Soy *Dorada* ☕, tu asistente interna de Sierra Dorada Coffee Exports.\n\nPuedo ayudarte con:\n\n• *Procesos de exportación* — documentos, tiempos, certificaciones\n• *Políticas internas* — horarios, beneficios, vacaciones, contactos\n• *Onboarding* — todo lo que necesitas en tu primer día\n• *Calidad y catación* — protocolos SCA, perfiles de taza, defectos\n\n¿En qué te puedo ayudar?`;
    await ctx.reply(greeting, { parse_mode: 'Markdown' });
  });

  bot.command('reset', async (ctx) => {
    clearSession(ctx.chat.id);
    await ctx.reply('Conversación reiniciada. ¿En qué te puedo ayudar?');
  });

  bot.command('help', async (ctx) => {
    const help = `*Comandos disponibles:*\n\n/start — Saludo e introducción\n/reset — Reiniciar conversación\n/help — Este mensaje de ayuda\n\nO simplemente escríbeme tu pregunta sobre Sierra Dorada.`;
    await ctx.reply(help, { parse_mode: 'Markdown' });
  });

  return bot;
}

export async function handleMessage(ctx: Context, env: Env): Promise<void> {
  const text = ctx.message?.text;
  if (!text || !ctx.chat) return;

  const chatId = ctx.chat.id;

  addMessage(chatId, 'user', text);

  const systemMessage: ChatMessage = {
    role: 'system',
    content: buildSystemPrompt(),
  };

  const messages: ChatMessage[] = [
    systemMessage,
    ...getHistory(chatId),
  ];

  const response = await chat(env.AI, messages);

  addMessage(chatId, 'assistant', response);

  await ctx.reply(response, { parse_mode: 'Markdown' });
}
```

- [ ] **Step 2: Commit**

```bash
git add reto-11/src/bot.ts
git commit -m "feat(reto-11): add bot instance with command handlers and message flow"
```

---

## Task 6: Worker Entry Point (Webhook Handler)

**Files:**
- Create: `reto-11/src/index.ts`

- [ ] **Step 1: Create the Cloudflare Worker entry point**

```typescript
import { Bot, webhookCallback } from 'grammy';
import type { Env } from './types.js';
import { createBot, handleMessage } from './bot.js';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return new Response('OK', { status: 200 });
    }

    if (request.method !== 'POST' || url.pathname !== '/webhook') {
      return new Response('Not Found', { status: 404 });
    }

    const bot = createBot(env.TELEGRAM_BOT_TOKEN);

    bot.on('message:text', async (ctx) => {
      await handleMessage(ctx, env);
    });

    const handleWebhook = webhookCallback(bot, 'cloudflare-mod');

    return handleWebhook(request);
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add reto-11/src/index.ts
git commit -m "feat(reto-11): add Cloudflare Worker entry point with webhook handler"
```

---

## Task 7: Webhook Setup Script

**Files:**
- Create: `reto-11/scripts/set-webhook.mjs`

- [ ] **Step 1: Create webhook registration script**

```javascript
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WORKER_URL = process.env.WORKER_URL;

if (!TOKEN || !WORKER_URL) {
  console.error('Set TELEGRAM_BOT_TOKEN and WORKER_URL env vars');
  process.exit(1);
}

const webhookUrl = `${WORKER_URL}/webhook`;
const apiUrl = `https://api.telegram.org/bot${TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;

const res = await fetch(apiUrl);
const data = await res.json();
console.log('Webhook set:', JSON.stringify(data, null, 2));
```

- [ ] **Step 2: Commit**

```bash
git add reto-11/scripts/set-webhook.mjs
git commit -m "feat(reto-11): add Telegram webhook setup script"
```

---

## Task 8: README and Final Documentation

**Files:**
- Modify: `reto-11/README.md`

- [ ] **Step 1: Write complete README**

```markdown
# Reto 11 — Agente Interno Sierra Dorada Coffee

> Vibe Coders League Platzi 2026

---

## El problema

Cuando entras a una empresa nueva, todo es confuso. ¿Dónde están los documentos? ¿Cuál es el proceso para exportar a Dubai? ¿Quién aprueba mis vacaciones? ¿Qué hago mi primer día?

**Dorada** es un bot de Telegram que actúa como asistente interna de Sierra Dorada Coffee Exports, una empresa ficticia de exportación de café premium colombiano. Responde dudas sobre procesos, consulta el manual interno y guía a los nuevos empleados en su primer día.

---

## La empresa ficticia

**Sierra Dorada Coffee Exports S.A.S.** — Fundada en 2018 en Manizales, Colombia. Exporta café de especialidad (SCA 84+) a Estados Unidos, Emiratos Árabes Unidos y Holanda. 47 empleados, 4 certificaciones internacionales, fincas aliadas en Huila, Nariño, Tolima y el Eje Cafetero.

---

## Flujos conversacionales

| # | Flujo | Ejemplo de pregunta |
|---|-------|-------------------|
| 1 | Procesos de exportación | "¿Qué documentos necesito para enviar café a Dubai?" |
| 2 | Manual interno / Políticas | "¿Cuántos días de vacaciones tengo?" |
| 3 | Onboarding | "Es mi primer día, ¿qué debo hacer?" |
| 4 | Catación y calidad | "¿Cuál es el perfil de taza del café de Nariño?" |

---

## Stack técnico

| Componente | Tecnología |
|------------|------------|
| Bot framework | grammY |
| Runtime | Cloudflare Workers |
| AI Model | Cloudflare Workers AI (Llama 3.1 8B) |
| Lenguaje | TypeScript |
| Delivery | Telegram Bot API (webhook) |

---

## Instalación

### Prerrequisitos
- Node.js >= 22
- Cuenta de Cloudflare con Workers AI habilitado
- Bot de Telegram creado via @BotFather

### Setup

1. Instalar dependencias:
   ```bash
   cd reto-11
   npm install
   ```

2. Configurar el token del bot:
   ```bash
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

4. Registrar el webhook:
   ```bash
   TELEGRAM_BOT_TOKEN=tu_token WORKER_URL=https://sierra-dorada-agent.tu-subdominio.workers.dev npm run set-webhook
   ```

### Desarrollo local

```bash
npm run dev
```

Para desarrollo local con Telegram, necesitas un túnel (ngrok o cloudflared).

---

## Estructura

```
reto-11/
├── src/
│   ├── index.ts              ← Worker entry point
│   ├── bot.ts                ← Bot handlers
│   ├── lib/
│   │   ├── system-prompt.ts  ← Prompt + flow routing
│   │   ├── manual.ts         ← Manual interno completo
│   │   ├── ai.ts             ← Workers AI wrapper
│   │   └── session.ts        ← Conversation history
│   └── types.ts              ← TypeScript types
├── scripts/
│   └── set-webhook.mjs       ← Registro de webhook
└── README.md
```

---

## Estado

- [x] En progreso
- [ ] Completado
```

- [ ] **Step 2: Commit**

```bash
git add reto-11/README.md
git commit -m "docs(reto-11): add README — Sierra Dorada internal agent"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Project scaffolding | package.json, tsconfig, wrangler, .env, .gitignore, types.ts |
| 2 | Internal company manual | src/lib/manual.ts |
| 3 | System prompt + flow routing | src/lib/system-prompt.ts |
| 4 | AI wrapper + session manager | src/lib/ai.ts, src/lib/session.ts |
| 5 | Bot handlers | src/bot.ts |
| 6 | Worker entry point | src/index.ts |
| 7 | Webhook setup script | scripts/set-webhook.mjs |
| 8 | README | README.md |

**Total: 8 tasks, ~11 files, 8 commits**
