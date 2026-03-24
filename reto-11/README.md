# Reto 11 — Agente Interno Sierra Dorada Coffee

> Vibe Coders League Platzi 2026

---

## El problema

Cuando entras a una empresa nueva, todo es confuso. Donde estan los documentos? Cual es el proceso para exportar a Dubai? Quien aprueba mis vacaciones? Que hago mi primer dia?

**Dorada** es un bot de Telegram que actua como asistente interna de Sierra Dorada Coffee Exports, una empresa ficticia de exportacion de cafe premium colombiano. Responde dudas sobre procesos, consulta el manual interno y guia a los nuevos empleados en su primer dia.

---

## La empresa ficticia

**Sierra Dorada Coffee Exports S.A.S.** — Fundada en 2018 en Manizales, Colombia. Exporta cafe de especialidad (SCA 84+) a Estados Unidos, Emiratos Arabes Unidos y Holanda. 47 empleados, 4 certificaciones internacionales, fincas aliadas en Huila, Narino, Tolima y el Eje Cafetero.

---

## Flujos conversacionales

| # | Flujo | Ejemplo de pregunta |
|---|-------|-------------------|
| 1 | Procesos de exportacion | "Que documentos necesito para enviar cafe a Dubai?" |
| 2 | Manual interno / Politicas | "Cuantos dias de vacaciones tengo?" |
| 3 | Onboarding | "Es mi primer dia, que debo hacer?" |
| 4 | Catacion y calidad | "Cual es el perfil de taza del cafe de Narino?" |

---

## Stack tecnico

| Componente | Tecnologia |
|------------|------------|
| Bot framework | grammY |
| Runtime | Cloudflare Workers |
| AI Model | Cloudflare Workers AI (Llama 3.1 8B) |
| Lenguaje | TypeScript |
| Delivery | Telegram Bot API (webhook) |

---

## Instalacion

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

Para desarrollo local con Telegram, necesitas un tunel (ngrok o cloudflared).

---

## Estructura

```
reto-11/
├── src/
│   ├── index.ts              <- Worker entry point
│   ├── bot.ts                <- Bot handlers
│   ├── lib/
│   │   ├── system-prompt.ts  <- Prompt + flow routing
│   │   ├── manual.ts         <- Manual interno completo
│   │   ├── ai.ts             <- Workers AI wrapper
│   │   └── session.ts        <- Conversation history
│   └── types.ts              <- TypeScript types
├── scripts/
│   └── set-webhook.mjs       <- Registro de webhook
└── README.md
```

---

## Estado

- [x] En progreso
- [x] Completado
