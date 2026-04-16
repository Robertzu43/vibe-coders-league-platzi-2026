# 🛍️ Platzi Store — Reto Final VCL 2026

La primera tienda oficial de merchandising de Platzi. Construida en vivo durante el Reto Final de la **Vibe Coders League 2026** — una experiencia de compra completa con chatbot IA, automatización de pedidos y una línea de 12 productos con identidad visual generada por IA.

> _"Nunca Pares de Codear"_

## 🌐 Demo en Vivo

👉 [URL de Vercel aquí]

## 📸 Screenshots

<!-- Agregar screenshots del proyecto aquí -->

## ✨ Features

- 🛒 **12 productos** con imágenes generadas por IA (Midjourney) en alta resolución
- 🛍️ **Carrito de compras completo** — código de descuento para empleados, selección de método de pago (tarjeta, PayPal, Platzi Credits) y checkout funcional
- 🤖 **Chatbot IA (Gemini)** — asistente de compras que conoce todo el catálogo, recomienda productos y sugiere cursos de Platzi
- 📧 **Automatización Make.com** — confirmación de pedido por email vía webhook en tiempo real
- 🌍 **Soporte bilingüe (Español/Inglés)** con toggle de idioma
- 🧠 **Fondo de red neuronal interactiva** — efecto visual generativo en el hero
- ⌨️ **Efecto typewriter** animado en la sección principal
- 🌙 **Dark theme** con colores oficiales Platzi y diseño 100% responsive

## 🛠️ Tech Stack

| Tecnología | Uso |
|---|---|
| **Next.js 16** + TypeScript | Framework principal |
| **Tailwind CSS** | Estilos y diseño responsive |
| **shadcn/ui** | Librería de componentes |
| **Supabase** | Base de datos PostgreSQL + Storage CDN para imágenes |
| **Gemini API** | Chatbot de IA / asistente de compras |
| **Make.com** | Automatización webhook + email de confirmación |
| **Vercel** | Deployment y hosting |
| **Midjourney** | Generación de imágenes de productos |
| **HeyGen** | Video promocional con avatar IA |

## 🏪 Catálogo de Productos

### Colección Premium (5)

| # | Producto | Precio |
|---|---------|--------|
| 1 | **The Deployer Hoodie** — Hoodie El Deployer | $89.99 |
| 2 | **The Clean Code Tee** — Camiseta Código Limpio | $39.99 |
| 3 | **La Funda Full Stack** — Laptop Sleeve | $49.99 |
| 4 | **Hydrate & Iterate Bottle** — Botella Hidrata & Itera | $29.99 |
| 5 | **El Cuaderno del Founder** — Notebook | $24.99 |

### Colección Fun (5)

| # | Producto | Precio |
|---|---------|--------|
| 6 | **Medias CEO** — Socks | $14.99 |
| 7 | **Sticker Bomb Pack** — 12 stickers de vinilo | $9.99 |
| 8 | **Chanclas Modo Debug** — Slippers | $34.99 |
| 9 | **El Enter Destructor** — Giant Enter Key Plushie | $44.99 |
| 10 | **Taza Nunca Pares de Codear** — Coffee Mug | $19.99 |

### Edición Limitada (2)

| # | Producto | Precio |
|---|---------|--------|
| 11 | **VCL Championship Cap** — Gorra edición limitada (solo Mar-Abr 2026) | $54.99 |
| 12 | **Nunca Pares de Aprender — Regalo** — Suscripción Platzi de regalo | $49.99 |

## 🏆 Diferenciadores

### 🤖 Chatbot IA con Gemini
Asistente de compras inteligente integrado en la tienda. Conoce los 12 productos, sus precios, tallas y disponibilidad. Recomienda productos según preferencias del usuario y sugiere cursos de Platzi relevantes. Implementado como API route de Next.js con widget flotante.

### ⚡ Automatización Make.com
Flujo automatizado de confirmación de pedidos: al completar una compra, un webhook envía los datos del pedido a Make.com, que genera y envía un email de confirmación con branding Platzi al correo del cliente — todo en tiempo real.

## 🚀 Cómo correr localmente

```bash
# 1. Clonar el repositorio
git clone https://github.com/Robertzu43/Vibe-Coders-League-Platzi-2026.git
cd Vibe-Coders-League-Platzi-2026/reto-final

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# 4. Correr el servidor de desarrollo
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
