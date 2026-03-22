# ByteNest Chat Agent — Design Spec

## Problem

Online computer stores overwhelm users with specs and options. Most buyers don't know which machine fits their needs. A conversational assistant that understands use cases and recommends the right computer — while also handling common store questions — creates a better buying experience.

## Solution

**ByteNest** is a fictional online computer store with an AI chat assistant called **Nex**. Nex is a friendly tech advisor who explains things simply, handles 6 distinct intents, and guides buyers to the right computer based on their actual use case.

Built as a single Astro app with a React chat component and Claude API as the brain.

## Intents

| # | Intent | Triggers (examples) | Response behavior |
|---|--------|---------------------|-------------------|
| 1 | Greeting/farewell | "Hola", "Gracias, adiós" | Friendly greeting or farewell, offers help |
| 2 | Hours & contact | "¿Horario?", "¿Tienen WhatsApp?" | Store hours, phone, email, social media |
| 3 | Shipping & delivery | "¿Hacen envíos?", "¿Cuánto tarda?" | Shipping options, times, costs, coverage |
| 4 | Warranty & returns | "¿Qué garantía tienen?", "¿Puedo devolver?" | Warranty terms, return policy, process |
| 5 | Payment methods | "¿Aceptan tarjeta?", "¿Tienen cuotas?" | Accepted methods, installment options |
| 6 | Purchase recommendation | "Quiero comprar un compu", "Necesito laptop" | Triggers recommendation flow (see below) |

## Purchase Recommendation Flow

When Nex detects purchase intent:

1. **Ask use case**: "¿Para qué la vas a usar principalmente?"
2. **Classify profile** from response:
   - **Básico** — Documentos, navegación, email
   - **Productividad** — Office avanzado, multitarea, reuniones
   - **Desarrollo** — Programación, compilación, Docker, VMs
   - **Diseño/Video** — Edición de video, diseño gráfico, renderizado
   - **Gaming** — Juegos AAA, streaming
3. **Recommend 1-2 products** from catalog with simple explanation of why it fits
4. **Offer to answer follow-up questions** about the recommendation

## Product Catalog

~10 products covering all use profiles:

### Laptops

| Product | Profile | Price | Key specs |
|---------|---------|-------|-----------|
| MacBook Air M3 | Básico | $999 USD | M3, 8GB, 256GB SSD, 15h batería |
| Lenovo IdeaPad 3 | Básico | $449 USD | Ryzen 5, 8GB, 256GB SSD |
| MacBook Pro 14" M3 Pro | Productividad/Diseño | $1,999 USD | M3 Pro, 18GB, 512GB SSD |
| Lenovo ThinkPad X1 Carbon | Productividad | $1,399 USD | i7-1365U, 16GB, 512GB SSD |
| Dell XPS 15 | Desarrollo/Diseño | $1,599 USD | i7-13700H, 16GB, 512GB SSD, RTX 4050 |
| ASUS ROG Strix G16 | Gaming | $1,499 USD | i9-13980HX, 16GB, 1TB SSD, RTX 4060 |
| MSI Raider GE78 | Gaming | $2,299 USD | i9-13950HX, 32GB, 1TB SSD, RTX 4080 |

### Desktops

| Product | Profile | Price | Key specs |
|---------|---------|-------|-----------|
| Mac Mini M3 | Básico/Productividad | $599 USD | M3, 8GB, 256GB SSD |
| Dell OptiPlex 7010 | Productividad | $849 USD | i5-13500, 16GB, 512GB SSD |
| Custom Gaming PC | Gaming | $1,899 USD | Ryzen 7 7800X3D, 32GB, 1TB, RTX 4070 Ti |

## Nex Personality

- **Tone**: Friendly, knowledgeable, explains simply — like a friend who knows about computers
- **Language**: Spanish only
- **Name**: Nex
- **Avatar**: Robot/tech icon
- **Behavior rules**:
  - Always responds in Spanish
  - Never invents products outside the catalog
  - If asked something outside scope, politely redirects: "No tengo info sobre eso, pero puedo ayudarte a encontrar tu compu ideal"
  - Keeps responses concise — no walls of text
  - Uses casual but respectful tone

## Store Info (for FAQ intents)

- **Name**: ByteNest — "Tu nido tecnológico"
- **Hours**: Lunes a Viernes 9am–7pm, Sábados 10am–3pm
- **Contact**: info@bytenest.com, WhatsApp +52 55 1234 5678
- **Shipping**: Envío gratis en compras mayores a $500 USD. Entrega en 3-5 días hábiles. Cobertura nacional (México).
- **Warranty**: 1 año de garantía en todos los equipos. 30 días para devoluciones sin preguntas.
- **Payment**: Tarjeta de crédito/débito, transferencia bancaria, PayPal. Hasta 12 meses sin intereses con tarjetas participantes.

## Architecture

```
reto-10/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Main page with chat
│   │   └── api/
│   │       └── chat.ts          # API route → Claude API
│   ├── components/
│   │   └── Chat.tsx             # React chat component
│   ├── lib/
│   │   ├── system-prompt.ts     # System prompt: personality, catalog, intents
│   │   └── catalog.ts           # Hardcoded product catalog
│   └── styles/
│       └── chat.css             # Chat styles
├── .env.example                 # ANTHROPIC_API_KEY=
├── package.json
├── astro.config.mjs
├── tsconfig.json
└── README.md
```

### Data flow

1. User types message in `Chat.tsx`
2. `Chat.tsx` sends POST to `/api/chat` with message + conversation history
3. `chat.ts` builds Claude API request: system prompt (personality + catalog + intent rules) + full conversation history
4. Claude returns response based on detected intent
5. `Chat.tsx` displays response and stores history in React state

### Key decisions

- **No database** — conversation history lives in React state (lost on reload, sufficient for this challenge)
- **No intent classifier** — Claude detects intents naturally via the system prompt
- **Catalog in system prompt** — Claude references it when recommending
- **Astro `output: 'server'`** with Node adapter for API route
- **No streaming** — simple request/response for clarity
- **Claude model**: `claude-sonnet-4-6` — good balance of quality and speed for conversational responses
- **Max tokens**: 500 per response — enforces concise answers
- **Error handling**: On API failure, show a generic error bubble: "Lo siento, tuve un problema. ¿Puedes intentar de nuevo?"

## UI Design

- **Theme**: Dark with electric blue accent — fits a computer store
- **Layout**: Full-screen chat (iMessage/WhatsApp style)
- **Header**: ByteNest logo + "Nex - Tu asesor tech"
- **Messages**: Bubbles — user right (blue accent), Nex left (dark gray) with small avatar
- **Input**: Text field at bottom with send button. Disabled while waiting for response.
- **Loading state**: Typing indicator (animated dots) in a Nex bubble while waiting for Claude response
- **Initial message**: Nex greets automatically: "¡Hola! Soy Nex, tu asesor tech en ByteNest. ¿En qué te puedo ayudar?"
- **Responsive**: Works on mobile and desktop

## Requirements Checklist

- [ ] Astro project with React integration and Node adapter
- [ ] Chat component with message history in state
- [ ] API route that calls Claude API with system prompt
- [ ] System prompt with Nex personality, catalog, store info, and intent rules
- [ ] Hardcoded catalog with ~10 products
- [ ] 6 distinct intents handled naturally
- [ ] Purchase recommendation flow: ask use → classify → recommend
- [ ] Dark theme UI with chat bubbles
- [ ] Responsive design
- [ ] .env.example with ANTHROPIC_API_KEY
- [ ] README with setup instructions
