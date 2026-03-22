# Reto 10 — ByteNest Chat Agent

Agente conversacional con IA para **ByteNest**, una tienda online ficticia de computadores. El asistente **Nex** maneja preguntas frecuentes y recomienda el computador ideal según el uso del cliente.

**Estado:** Completado

**Demo:** [bytenest-chat.robertzu43.workers.dev](https://bytenest-chat.robertzu43.workers.dev)

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
- **Cloudflare Workers** — Hosting y SSR

---

## Setup local

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

## Deploy

```bash
# Configurar secret (una vez)
npx wrangler secret put ANTHROPIC_API_KEY

# Build y deploy
npx astro build && npx wrangler deploy
```

---

## Herramientas

| Herramienta | Uso |
|-------------|-----|
| Astro 6 | Framework web con SSR |
| React | Componente de chat interactivo |
| Claude API | Procesamiento de lenguaje natural |
| @anthropic-ai/sdk | SDK oficial de Anthropic |
| Cloudflare Workers | Hosting y deploy |
