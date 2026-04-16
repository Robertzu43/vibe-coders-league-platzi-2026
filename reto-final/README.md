# 🛍️ Platzi Store — Reto Final VCL 2026

La primera tienda oficial de merchandising de Platzi. Construida en vivo durante el Reto Final de la **Vibe Coders League 2026** — una experiencia de compra completa con chatbot IA, automatización de pedidos y una línea de 13 productos con identidad visual generada por IA.

> _"Aprender es el nuevo estilo."_

## 🌐 Demo en Vivo

👉 [https://reto-final.vercel.app](https://reto-final.vercel.app)

📸 Instagram: [@plat.zistore](https://www.instagram.com/plat.zistore/)

## 🏪 La Tienda

- 13 productos originales en 3 colecciones: Premium, Fun & Community, y Edición Limitada
- Nombres creativos inspirados en cultura dev: "El Enter Destructor", "Medias CEO", "Chanclas Modo Debug", "Hoodie El Deployer"
- Incluye el libro "Control" de Freddy Vega y la gorra VCL Championship como edición limitada
- Producto "Nunca Pares de Aprender" para regalar suscripciones Platzi
- Todas las imágenes generadas con Gemini en alta definición
- Carrito funcional con códigos de descuento, 3 métodos de pago, y proceso de checkout animado
- Soporte bilingüe completo (Español/Inglés) con toggle en tiempo real

## ✨ La Experiencia Visual

- Fondo de red neuronal interactiva que reacciona al mouse y al scroll
- Efecto typewriter en el hero: "Aprender es el nuevo estilo."
- Animación de código binario al cargar imágenes de productos — estilo Matrix
- Confetti al confirmar un pedido
- Dark theme con colores oficiales Platzi

## 📢 Campaña de Lanzamiento

- Video promocional generado con HeyGen
- Serie de imágenes para redes sociales generadas con Gemini
- Cuenta de Instagram creada: [@plat.zistore](https://www.instagram.com/plat.zistore/)

## 🏆 Diferenciadores

- **Chatbot IA "Asistente Platzi Store" con Gemini** — conoce los 13 productos, precios, tallas, y recomienda cursos de Platzi
- **Automatización Make.com** — al hacer un pedido se envía email de confirmación con diseño Platzi, detalle de productos, total, y método de pago
- **Base de datos Supabase** con productos, órdenes, y códigos de descuento
- **Código de descuento especial:** EMPLEADOPLATZI (100% off para el equipo Platzi)

## 🛠️ Tech Stack

| Tecnología | Uso |
|---|---|
| **Next.js 16** + TypeScript + Tailwind CSS + shadcn/ui | Framework y diseño |
| **Supabase** | PostgreSQL + Storage CDN |
| **Gemini API** | Chatbot + imágenes de productos |
| **Make.com** | Automatización email |
| **Vercel** | Deploy |
| **HeyGen** | Video promocional |
| **v0** | Diseño base |

## 🏪 Catálogo de Productos

### Colección Premium (6)

| # | Producto | Precio |
|---|---------|--------|
| 1 | **Hoodie El Deployer** | $89.99 |
| 2 | **Camiseta Código Limpio** | $39.99 |
| 3 | **La Funda Full Stack** | $49.99 |
| 4 | **Botella Hidrata & Itera** | $29.99 |
| 5 | **El Cuaderno del Founder** | $24.99 |
| 6 | **Control** — La guía radical para dominar tu vida, tu futuro y tu riqueza | $17.95 |

### Colección Fun & Community (5)

| # | Producto | Precio |
|---|---------|--------|
| 7 | **Medias CEO** | $14.99 |
| 8 | **Pack Sticker Bomb** | $9.99 |
| 9 | **Chanclas Modo Debug** | $34.99 |
| 10 | **El Enter Destructor** | $44.99 |
| 11 | **Taza Nunca Pares de Codear** | $19.99 |

### Edición Limitada (2)

| # | Producto | Precio |
|---|---------|--------|
| 12 | **Gorra VCL Championship** — Solo Mar-Abr 2026 | $54.99 |
| 13 | **Nunca Pares de Aprender — Regalo** — Suscripción Platzi | $49.99 |

## 🚀 Cómo correr localmente

```bash
git clone https://github.com/Robertzu43/Vibe-Coders-League-Platzi-2026.git
cd Vibe-Coders-League-Platzi-2026/reto-final
npm install
cp .env.example .env.local
npm run dev
```

### Variables de entorno requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
MAKE_WEBHOOK_URL=
```

## 👤 Autor

**Roberto Zuniga**

## 🏅 Competencia

**Vibe Coders League Platzi 2026** — Reto Final

Construido en vivo el 16 de abril de 2026.

> "Construí la Platzi Store completa — 13 productos con IA, chatbot inteligente, automatización de pedidos, y una experiencia visual interactiva. Todo en un día."
