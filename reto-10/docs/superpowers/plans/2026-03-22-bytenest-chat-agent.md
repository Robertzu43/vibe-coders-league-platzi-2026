# ByteNest Chat Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a conversational AI chat agent for ByteNest (fictional computer store) that handles 6 intents and recommends computers based on user needs.

**Architecture:** Single Astro 6 app with React chat component and server-side API route that calls Claude API. System prompt defines Nex's personality, store info, catalog, and intent rules. Conversation history maintained in React state.

**Tech Stack:** Astro 6, React 19, TypeScript, Anthropic SDK (`@anthropic-ai/sdk`), Node adapter (`@astrojs/node`)

**Spec:** `reto-10/docs/superpowers/specs/2026-03-22-bytenest-chat-agent-design.md`

---

## File Map

| File | Responsibility |
|------|---------------|
| `reto-10/package.json` | Dependencies: astro, react, anthropic SDK, node adapter |
| `reto-10/astro.config.mjs` | Astro config: React integration, Node adapter, `output: 'server'` |
| `reto-10/tsconfig.json` | TypeScript strict config |
| `reto-10/.env.example` | `ANTHROPIC_API_KEY=` placeholder |
| `reto-10/src/lib/catalog.ts` | Hardcoded product catalog (10 products) |
| `reto-10/src/lib/system-prompt.ts` | Builds system prompt from catalog + store info + personality + intent rules |
| `reto-10/src/pages/api/chat.ts` | POST endpoint: receives messages, calls Claude API, returns response |
| `reto-10/src/components/Chat.tsx` | React chat component: message list, input, history state, API calls |
| `reto-10/src/styles/chat.css` | Dark theme chat styles |
| `reto-10/src/pages/index.astro` | Main page: renders Chat component |
| `reto-10/README.md` | Setup and run instructions |

---

### Task 1: Scaffold Astro project with React and Node adapter

**Files:**
- Create: `reto-10/package.json`
- Create: `reto-10/astro.config.mjs`
- Create: `reto-10/tsconfig.json`
- Create: `reto-10/.env.example`

- [ ] **Step 1: Initialize Astro project**

```bash
cd reto-10
npm create astro@latest . -- --template minimal --no-install --typescript strict
```

- [ ] **Step 2: Install dependencies**

```bash
cd reto-10
npm install @astrojs/react @astrojs/node react react-dom @anthropic-ai/sdk
npm install -D @types/react @types/react-dom
```

- [ ] **Step 3: Configure Astro with React and Node adapter**

`reto-10/astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
});
```

- [ ] **Step 4: Update tsconfig.json**

`reto-10/tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

- [ ] **Step 5: Create .env.example**

`reto-10/.env.example`:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

- [ ] **Step 6: Verify project builds**

```bash
cd reto-10
npx astro check
```

Expected: No errors

- [ ] **Step 7: Commit**

```bash
git add reto-10/package.json reto-10/package-lock.json reto-10/astro.config.mjs reto-10/tsconfig.json reto-10/.env.example reto-10/src/
git commit -m "feat(reto-10): scaffold Astro project with React and Node adapter"
```

---

### Task 2: Product catalog and system prompt

**Files:**
- Create: `reto-10/src/lib/catalog.ts`
- Create: `reto-10/src/lib/system-prompt.ts`

- [ ] **Step 1: Create product catalog**

`reto-10/src/lib/catalog.ts`:
```ts
export interface Product {
  name: string;
  type: 'laptop' | 'desktop';
  profile: string[];
  price: number;
  specs: string;
}

export const catalog: Product[] = [
  {
    name: 'MacBook Air M3',
    type: 'laptop',
    profile: ['básico'],
    price: 999,
    specs: 'M3, 8GB, 256GB SSD, 15h batería',
  },
  {
    name: 'Lenovo IdeaPad 3',
    type: 'laptop',
    profile: ['básico'],
    price: 449,
    specs: 'Ryzen 5, 8GB, 256GB SSD',
  },
  {
    name: 'MacBook Pro 14" M3 Pro',
    type: 'laptop',
    profile: ['productividad', 'diseño/video'],
    price: 1999,
    specs: 'M3 Pro, 18GB, 512GB SSD',
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    type: 'laptop',
    profile: ['productividad'],
    price: 1399,
    specs: 'i7-1365U, 16GB, 512GB SSD',
  },
  {
    name: 'Dell XPS 15',
    type: 'laptop',
    profile: ['desarrollo', 'diseño/video'],
    price: 1599,
    specs: 'i7-13700H, 16GB, 512GB SSD, RTX 4050',
  },
  {
    name: 'ASUS ROG Strix G16',
    type: 'laptop',
    profile: ['gaming'],
    price: 1499,
    specs: 'i9-13980HX, 16GB, 1TB SSD, RTX 4060',
  },
  {
    name: 'MSI Raider GE78',
    type: 'laptop',
    profile: ['gaming'],
    price: 2299,
    specs: 'i9-13950HX, 32GB, 1TB SSD, RTX 4080',
  },
  {
    name: 'Mac Mini M3',
    type: 'desktop',
    profile: ['básico', 'productividad'],
    price: 599,
    specs: 'M3, 8GB, 256GB SSD',
  },
  {
    name: 'Dell OptiPlex 7010',
    type: 'desktop',
    profile: ['productividad'],
    price: 849,
    specs: 'i5-13500, 16GB, 512GB SSD',
  },
  {
    name: 'Custom Gaming PC',
    type: 'desktop',
    profile: ['gaming'],
    price: 1899,
    specs: 'Ryzen 7 7800X3D, 32GB, 1TB, RTX 4070 Ti',
  },
];
```

- [ ] **Step 2: Create system prompt builder**

`reto-10/src/lib/system-prompt.ts`:
```ts
import { catalog } from './catalog';

function formatCatalog(): string {
  return catalog
    .map(
      (p) =>
        `- ${p.name} (${p.type}) — $${p.price} USD — ${p.specs} — Perfiles: ${p.profile.join(', ')}`
    )
    .join('\n');
}

export const systemPrompt = `Eres Nex, el asesor tech de ByteNest — "Tu nido tecnológico", una tienda online de computadores.

## Tu personalidad
- Amigable y cercano, como un amigo que sabe mucho de tecnología pero lo explica simple
- Siempre respondes en español
- Respuestas concisas y útiles — nada de muros de texto
- Tono casual pero respetuoso

## Información de la tienda
- Horario: Lunes a Viernes 9am–7pm, Sábados 10am–3pm
- Contacto: info@bytenest.com, WhatsApp +52 55 1234 5678
- Envíos: Gratis en compras mayores a $500 USD. Entrega en 3-5 días hábiles. Cobertura nacional (México).
- Garantía: 1 año en todos los equipos. 30 días para devoluciones sin preguntas.
- Pagos: Tarjeta de crédito/débito, transferencia bancaria, PayPal. Hasta 12 meses sin intereses con tarjetas participantes.

## Catálogo de productos
${formatCatalog()}

## Intenciones que manejas
1. Saludo/despedida — Saluda amigablemente, ofrece ayuda
2. Horarios y contacto — Comparte info de la tienda
3. Envíos y entregas — Explica opciones de envío
4. Garantías y devoluciones — Detalla políticas
5. Métodos de pago — Lista opciones de pago
6. Recomendación de compra — Sigue el flujo de recomendación

## Flujo de recomendación de compra
Cuando el usuario quiera comprar un computador:
1. Pregunta: "¿Para qué la vas a usar principalmente?"
2. Clasifica su uso en un perfil: básico, productividad, desarrollo, diseño/video, o gaming
3. Recomienda 1-2 productos del catálogo explicando por qué le convienen
4. Ofrece resolver dudas sobre la recomendación

## Reglas importantes
- NUNCA inventes productos fuera del catálogo
- Si te preguntan algo fuera de tu alcance, di: "No tengo info sobre eso, pero puedo ayudarte a encontrar tu compu ideal 💻"
- Mantén las respuestas cortas y al punto
`;
```

- [ ] **Step 3: Commit**

```bash
git add reto-10/src/lib/catalog.ts reto-10/src/lib/system-prompt.ts
git commit -m "feat(reto-10): add product catalog and system prompt"
```

---

### Task 3: Chat API route

**Files:**
- Create: `reto-10/src/pages/api/chat.ts`

- [ ] **Step 1: Create the API route**

`reto-10/src/pages/api/chat.ts`:
```ts
import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { systemPrompt } from '../../lib/system-prompt';

const client = new Anthropic();

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: systemPrompt,
      messages,
    });

    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Lo siento, tuve un problema. ¿Puedes intentar de nuevo?' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add reto-10/src/pages/api/chat.ts
git commit -m "feat(reto-10): add chat API route with Claude integration"
```

---

### Task 4: Chat styles (dark theme)

**Files:**
- Create: `reto-10/src/styles/chat.css`

- [ ] **Step 1: Create chat styles**

`reto-10/src/styles/chat.css`:
```css
:root {
  --bg-primary: #0f0f13;
  --bg-secondary: #1a1a24;
  --bg-bubble-nex: #23233a;
  --bg-bubble-user: #2563eb;
  --text-primary: #e4e4e7;
  --text-secondary: #a1a1aa;
  --accent: #3b82f6;
  --accent-hover: #2563eb;
  --border: #27273a;
  --radius: 16px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  height: 100dvh;
  overflow: hidden;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  max-width: 800px;
  margin: 0 auto;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-secondary);
}

.chat-header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.chat-header-info h1 {
  font-size: 16px;
  font-weight: 600;
}

.chat-header-info p {
  font-size: 12px;
  color: var(--text-secondary);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  gap: 8px;
  max-width: 80%;
  animation: fadeIn 0.2s ease;
}

.message-nex {
  align-self: flex-start;
}

.message-user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 4px;
}

.message-user .message-avatar {
  background: var(--bg-bubble-user);
}

.message-bubble {
  padding: 10px 14px;
  border-radius: var(--radius);
  line-height: 1.5;
  font-size: 14px;
  white-space: pre-wrap;
}

.message-nex .message-bubble {
  background: var(--bg-bubble-nex);
  border-bottom-left-radius: 4px;
}

.message-user .message-bubble {
  background: var(--bg-bubble-user);
  border-bottom-right-radius: 4px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: var(--text-secondary);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

.chat-input-area {
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  background: var(--bg-secondary);
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 24px;
  border: 1px solid var(--border);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: var(--accent);
}

.chat-input:disabled {
  opacity: 0.5;
}

.chat-send {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--accent);
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.chat-send:hover:not(:disabled) {
  background: var(--accent-hover);
}

.chat-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

@media (max-width: 640px) {
  .message { max-width: 90%; }
  .chat-header { padding: 12px 16px; }
  .chat-messages { padding: 12px; }
  .chat-input-area { padding: 12px; }
}
```

- [ ] **Step 2: Commit**

```bash
git add reto-10/src/styles/chat.css
git commit -m "feat(reto-10): add dark theme chat styles"
```

---

### Task 5: React Chat component

**Files:**
- Create: `reto-10/src/components/Chat.tsx`

- [ ] **Step 1: Create Chat component**

`reto-10/src/components/Chat.tsx`:
```tsx
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: '¡Hola! Soy Nex, tu asesor tech en ByteNest. ¿En qué te puedo ayudar?',
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages
            .filter((m) => m !== INITIAL_MESSAGE)
            .map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.error || 'Lo siento, tuve un problema. ¿Puedes intentar de nuevo?' },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Lo siento, tuve un problema. ¿Puedes intentar de nuevo?' },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="chat-header-avatar">🤖</div>
        <div className="chat-header-info">
          <h1>ByteNest</h1>
          <p>Nex — Tu asesor tech</p>
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message message-${msg.role === 'assistant' ? 'nex' : 'user'}`}>
            <div className="message-avatar">
              {msg.role === 'assistant' ? '🤖' : '👤'}
            </div>
            <div className="message-bubble">{msg.content}</div>
          </div>
        ))}

        {loading && (
          <div className="message message-nex">
            <div className="message-avatar">🤖</div>
            <div className="message-bubble">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          ref={inputRef}
          className="chat-input"
          type="text"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button className="chat-send" onClick={sendMessage} disabled={loading || !input.trim()}>
          ➤
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add reto-10/src/components/Chat.tsx
git commit -m "feat(reto-10): add React Chat component"
```

---

### Task 6: Main page and wiring

**Files:**
- Create: `reto-10/src/pages/index.astro`

- [ ] **Step 1: Create index page**

`reto-10/src/pages/index.astro`:
```astro
---
import Chat from '../components/Chat';
import '../styles/chat.css';
---

<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ByteNest — Tu nido tecnológico</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>" />
  </head>
  <body>
    <Chat client:load />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add reto-10/src/pages/index.astro
git commit -m "feat(reto-10): add main page with Chat component"
```

---

### Task 7: End-to-end verification and README

**Files:**
- Modify: `reto-10/README.md`

- [ ] **Step 1: Create .env with real API key**

```bash
cd reto-10
cp .env.example .env
# Add real ANTHROPIC_API_KEY to .env
```

- [ ] **Step 2: Start dev server and test all 6 intents**

```bash
cd reto-10
npm run dev
```

Test in browser at `http://localhost:4321`:
1. "Hola" → greeting response
2. "¿Cuál es su horario?" → store hours
3. "¿Hacen envíos?" → shipping info
4. "¿Qué garantía tienen?" → warranty info
5. "¿Aceptan tarjeta?" → payment methods
6. "Quiero comprar una laptop" → asks about use case → recommend based on answer

- [ ] **Step 3: Test recommendation flow end-to-end**

1. "Necesito un computador"
2. Nex asks use case
3. "Solo para documentos y navegar"
4. Nex recommends básico options (MacBook Air / IdeaPad)
5. "¿Y si necesito programar con Docker?"
6. Nex recommends desarrollo options (Dell XPS)

- [ ] **Step 4: Test error handling**

Stop the dev server, verify error bubble appears on send

- [ ] **Step 5: Test responsive design**

Open Chrome DevTools, toggle mobile view, verify chat works on small screens

- [ ] **Step 6: Update README**

`reto-10/README.md`:
```markdown
# Reto 10 — ByteNest Chat Agent

Agente conversacional con IA para **ByteNest**, una tienda online ficticia de computadores. El asistente **Nex** maneja preguntas frecuentes y recomienda el computador ideal según el uso del cliente.

**Estado:** Completado

---

## El reto

Construir un agente que responda preguntas frecuentes de un negocio ficticio, maneje al menos 5 intenciones distintas y tenga respuestas útiles y naturales.

## La solución

Una web app con chat en tiempo real donde **Nex**, el asesor tech de ByteNest, atiende a los clientes. Nex maneja 6 intenciones: saludos, horarios, envíos, garantías, pagos y recomendación de compra. El plus: cuando alguien quiere comprar, Nex pregunta para qué lo usará y recomienda el computador ideal del catálogo.

---

## Intenciones

| Intención | Ejemplo |
|-----------|---------|
| Saludo/despedida | "Hola", "Gracias" |
| Horarios y contacto | "¿Cuál es su horario?" |
| Envíos y entregas | "¿Hacen envíos?" |
| Garantías y devoluciones | "¿Qué garantía tienen?" |
| Métodos de pago | "¿Aceptan tarjeta?" |
| Recomendación de compra | "Quiero comprar un compu" |

## Stack

- **Astro 6** + React — Frontend con chat interactivo
- **Claude API** (claude-sonnet-4-6) — Cerebro del agente
- **Node adapter** — Server-side rendering para API route

---

## Setup

1. Instalar dependencias:

```bash
cd reto-10
npm install
```

2. Configurar API key:

```bash
cp .env.example .env
# Editar .env y agregar tu ANTHROPIC_API_KEY
```

3. Iniciar servidor:

```bash
npm run dev
```

4. Abrir `http://localhost:4321` y chatear con Nex.

---

## Herramientas

| Herramienta | Uso |
|-------------|-----|
| Astro 6 | Framework web con SSR |
| React | Componente de chat interactivo |
| Claude API | Procesamiento de lenguaje natural |
| @anthropic-ai/sdk | SDK oficial de Anthropic |
```

- [ ] **Step 7: Final commit**

```bash
git add reto-10/README.md
git commit -m "docs(reto-10): add README with setup instructions"
```

---

## Verification Checklist

- [ ] `npm run dev` starts without errors
- [ ] All 6 intents produce appropriate responses
- [ ] Recommendation flow asks use case and recommends from catalog
- [ ] Follow-up questions maintain conversation context
- [ ] Error bubble shown on API failure
- [ ] Typing indicator shown while waiting
- [ ] Input disabled while loading
- [ ] Responsive on mobile
- [ ] Dark theme renders correctly
