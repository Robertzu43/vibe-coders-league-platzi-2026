# Vibecode Summit Colombia — Landing Page Design Spec

## Resumen

Landing page para **VIBECODE SUMMIT COLOMBIA**, un festival ficticio de tecnología centrado en vibe coding, web3 y crypto. El evento se celebra en Octubre 2026 en el Centro de Convenciones Ágora, Bogotá, Colombia.

El objetivo es crear una experiencia web premium estilo Apple.com: tipografía grande, espacios amplios, animaciones scroll-driven cinematográficas y diseño responsive.

Todo el contenido de la página está en español.

## Stack Técnico

- **Astro 5** — framework de generación estática, 0kb JS por defecto
- **GSAP + ScrollTrigger** — animaciones scroll-driven, parallax, reveals
- **CSS vanilla** — sin Tailwind ni frameworks CSS, control total del diseño
- **Tipografía:** Inter, self-hosted desde `public/fonts/` para máximo rendimiento (preloaded con `<link rel="preload">`)

No se usan frameworks CSS. Los estilos se escriben a mano para máximo control sobre la estética premium.

## Identidad Visual

### Design Tokens (CSS Custom Properties)

```css
:root {
  /* Colores */
  --color-bg-dark: #0a0a0a;
  --color-bg-black: #000000;
  --color-bg-light: #fafafa;
  --color-bg-white: #ffffff;
  --color-text-primary: #ffffff;
  --color-text-secondary: #a0a0a0;
  --color-text-dark: #1a1a1a;
  --color-accent: #7c3aed;         /* Violeta principal */
  --color-accent-blue: #3b82f6;    /* Azul secundario */
  --color-accent-glow: rgba(124, 58, 237, 0.15); /* Glow sutil */
  --color-border: rgba(255, 255, 255, 0.1);

  /* Tags de categoría (agenda) */
  --color-tag-web3: #8b5cf6;
  --color-tag-vibecoding: #06b6d4;
  --color-tag-crypto: #f59e0b;
  --color-tag-ai: #10b981;

  /* Tipografía */
  --font-family: 'Inter', system-ui, -apple-system, sans-serif;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Tamaños tipográficos — Desktop */
  --text-hero: clamp(48px, 8vw, 120px);
  --text-section-title: clamp(36px, 5vw, 72px);
  --text-h3: clamp(20px, 2.5vw, 28px);
  --text-body: clamp(16px, 1.2vw, 18px);
  --text-small: clamp(13px, 1vw, 14px);

  /* Espaciado */
  --section-padding: clamp(80px, 12vw, 200px);
  --container-max-width: 1280px;
  --container-padding: clamp(20px, 4vw, 80px);

  /* Transiciones */
  --transition-fast: 0.2s ease;
  --transition-medium: 0.4s ease;
}
```

### Paleta y Estilo

- **Fondo:** Alternancia oscuro (--color-bg-dark) / claro (--color-bg-light) entre secciones
- **Tipografía:** Inter self-hosted, pesos 300-700. Títulos oversized con `clamp()` para escalado fluido
- **Espaciado:** Generoso. Secciones con padding vertical amplio. Max-width de 1280px para contenido
- **Ritmo visual:** Secciones oscuras → claras → oscuras para crear cadencia
- **Gradiente hero:** CSS radial-gradient con dos focos: violeta (--color-accent) arriba-derecha y azul (--color-accent-blue) abajo-izquierda, ambos con opacidad baja (~0.15)

## Estructura de Secciones

### 1. Navbar

- Fija en la parte superior (`position: fixed`), transparente sobre el hero
- Logo "VIBECODE" a la izquierda, peso semibold, tracking amplio
- Links de navegación a la derecha: Speakers, Agenda, Ubicación, Sponsors, Entradas
- Al hacer scroll pasado el hero, el navbar adquiere `background: rgba(10,10,10,0.8)` + `backdrop-filter: blur(20px)`
- **Mobile (< 768px):** Hamburger menu que abre overlay full-screen con fondo oscuro, links centrados verticalmente. Apertura con fade-in 0.3s. Body scroll-lock cuando está abierto.

### 2. Hero

- **Fondo:** Negro (--color-bg-black) con radial-gradient sutil en tonos violeta/azul
- **Elemento principal:** Efecto typewriter que escribe "VIBECODE SUMMIT COLOMBIA" carácter por carácter con cursor parpadeante `|`, como si alguien estuviera prompteando en un editor de código
  - Velocidad de typing: 60ms por carácter
  - Cursor blink rate: 530ms
  - Pausa después de "VIBECODE": 400ms (efecto dramático)
  - Delay antes del fade-in del subtítulo: 500ms después de terminar el typing
- **Tipografía:** var(--text-hero), blanca, peso bold
- **Subtítulo:** "Donde el código se encuentra con el futuro" — fade-in + translate-y(20px→0) en 0.6s
- **Info:** Octubre 2026 · Bogotá, Colombia — mismo fade-in, 200ms delay extra
- **CTA:** Botón "Obtener Entradas" — fondo blanco, texto negro, border-radius 100px, hover: scale(1.05) con transition 0.2s
- **Animación de scroll:** Al scrollear, el hero se fija (pin) y el texto escala de 1 → 1.15 mientras opacity va de 1 → 0 (zoom-in + fade out). ScrollTrigger config: `start: "top top"`, `end: "+=50%"`, `scrub: 1`
- **Altura:** 100vh mínimo

### 3. Speakers

- **Fondo:** Claro (--color-bg-light)
- **Título:** "Speakers" — reveal con translate-y(60px→0) + opacity(0→1), `start: "top 80%"`, `duration: 0.8`
- **Layout:** Grid de cards — 4 columnas desktop (1200px+), 2 columnas tablet (768-1199px), 1 columna mobile (< 768px)
- **Cards:** Foto placeholder (gradiente o avatar genérico SVG) en blanco y negro con `filter: grayscale(100%)`, nombre, rol, empresa. Hover: `scale(1.03)` + `box-shadow: 0 20px 60px rgba(0,0,0,0.1)`, grayscale se remueve
- **Animación:** Cards aparecen staggered con `stagger: 0.12s` al hacer scroll
- **Contenido — 8 speakers ficticios:**
  - Mariana Velasco — CTO, Protocolo Lumina (DeFi)
  - Andrés Ríos — Founder, VibeStudio (Vibe Coding tools)
  - Camila Herrera — Head of Engineering, ChainLab
  - Diego Montoya — AI Research Lead, NeuralForge
  - Valentina Cruz — Web3 Developer Advocate, EtherCore
  - Santiago Mora — Blockchain Architect, CryptoAndes
  - Isabella Torres — Product Lead, CodeVerse DAO
  - Mateo Guzmán — Senior Protocol Engineer, ZK Labs

### 4. Agenda

- **Fondo:** Oscuro (--color-bg-dark)
- **Título:** "Agenda" — reveal con scroll (mismo patrón que Speakers)
- **Formato:** Timeline vertical, 3 días de evento
- **Cada bloque:** Hora, título de charla/workshop, speaker, tag de categoría
- **Tags:** Web3 (--color-tag-web3), Vibe Coding (--color-tag-vibecoding), Crypto (--color-tag-crypto), AI (--color-tag-ai) — pills con border-radius, fondo semitransparente
- **Layout:** Bloques alternando izquierda/derecha en desktop (línea central), linear en mobile/tablet
- **Animación:** Cada bloque entra con translate-x(±40px→0) + opacity, `stagger: 0.15s`
- **Schema de datos (`agenda.json`):**
  ```json
  {
    "days": [
      {
        "label": "Día 1 — 15 Oct",
        "title": "Keynotes & Visión",
        "events": [
          {
            "time": "09:00",
            "title": "Apertura: El Estado del Vibe Coding en 2026",
            "speaker": "Andrés Ríos",
            "tag": "Vibe Coding"
          },
          {
            "time": "10:30",
            "title": "Web3 en Latinoamérica: Oportunidades Reales",
            "speaker": "Mariana Velasco",
            "tag": "Web3"
          },
          {
            "time": "14:00",
            "title": "De Prompts a Producción: AI como Co-piloto",
            "speaker": "Diego Montoya",
            "tag": "AI"
          },
          {
            "time": "16:00",
            "title": "Panel: El Futuro de las DAOs",
            "speaker": "Isabella Torres",
            "tag": "Crypto"
          }
        ]
      },
      {
        "label": "Día 2 — 16 Oct",
        "title": "Workshops & Deep Dives",
        "events": [
          {
            "time": "09:00",
            "title": "Workshop: Vibe Coding en Vivo con Claude",
            "speaker": "Andrés Ríos",
            "tag": "Vibe Coding"
          },
          {
            "time": "11:00",
            "title": "Smart Contracts con Solidity: De Cero a Deploy",
            "speaker": "Santiago Mora",
            "tag": "Crypto"
          },
          {
            "time": "14:00",
            "title": "Construyendo AI Agents para Web3",
            "speaker": "Diego Montoya",
            "tag": "AI"
          },
          {
            "time": "16:00",
            "title": "DeFi Protocols: Arquitectura y Seguridad",
            "speaker": "Camila Herrera",
            "tag": "Web3"
          }
        ]
      },
      {
        "label": "Día 3 — 17 Oct",
        "title": "Hackathon & Demos",
        "events": [
          {
            "time": "09:00",
            "title": "Hackathon: 8 Horas para Cambiar el Juego",
            "speaker": "Todos los mentores",
            "tag": "Vibe Coding"
          },
          {
            "time": "17:00",
            "title": "Demo Day: Presentación de Proyectos",
            "speaker": "Participantes",
            "tag": "Web3"
          },
          {
            "time": "19:00",
            "title": "Ceremonia de Cierre & Networking",
            "speaker": "Valentina Cruz",
            "tag": "Crypto"
          }
        ]
      }
    ]
  }
  ```

### 5. Ubicación

- **Fondo:** Imagen de alta calidad representativa de Bogotá/centro de convenciones. Full-bleed, `height: 80vh`, `object-fit: cover`, con overlay oscuro semitransparente (`rgba(0,0,0,0.5)`)
- **Overlay:** Texto blanco centrado sobre la imagen: "Centro de Convenciones Ágora" (var(--text-section-title)), "Bogotá, Colombia" (var(--text-h3))
- **Info práctica:** Grid de 3 columnas debajo de la imagen (fondo oscuro): Dirección, Cómo llegar, Fecha exacta (15-17 Octubre 2026)
- **Animación:** Parallax en la imagen — ScrollTrigger `y: "-20%"`, `scrub: true`
- **Sin mapa embebido** — imagen estática es más limpia y premium
- **Imagen:** Usaremos una imagen de Unsplash de Bogotá o un venue genérico premium

### 6. Sponsors

- **Fondo:** Oscuro (--color-bg-dark)
- **Título:** "Sponsors" — reveal con scroll
- **Layout por tier:**
  - Platinum: 2 logos, 180px de ancho cada uno
  - Gold: 4 logos, 120px de ancho cada uno
  - Silver: 6 logos, 80px de ancho cada uno
- **Estilo:** Logos SVG placeholder (rectángulos con nombre del sponsor ficticio). Escala de grises por defecto (`filter: grayscale(100%) opacity(0.6)`), color + opacidad completa al hover
- **Animación:** Logos con fade-in staggered, `stagger: 0.08s`
- **CTA:** "Sé sponsor" — link estilo texto con underline sutil, color --color-text-secondary
- **Sponsors ficticios:**
  - Platinum: ChainVerse Labs, NeuralPay
  - Gold: CryptoAndes, BlockForge, VibeTools, DataNode
  - Silver: ZKSync Studio, TokenBridge, DevPulse, SmartLayer, CodeNexus, HashFlow

### 7. Tickets / CTA Final

- **Fondo:** Oscuro, con gradiente sutil hacia violeta (callback al hero)
- **Título:** "Asegura tu lugar" — reveal con scroll
- **Layout:** 3 cards lado a lado en desktop, 1 columna en tablet/mobile (stacked)
- **Cards:**
  - **Early Bird** ($149 USD) — Acceso general 3 días, swag básico, acceso a grabaciones
  - **General** ($299 USD) — Todo Early Bird + workshops, swag completo, certificado
  - **VIP** ($599 USD) — Todo General + networking exclusivo, acceso backstage, meet & greet con speakers. Card con borde `1px solid var(--color-accent)` y glow sutil
- **CTA por card:** Botón "Comprar" — mismo estilo del hero CTA
- **Animación:** Cards entran con scale(0.9→1) + opacity, `stagger: 0.15s`

### 8. Footer

- **Fondo:** Negro (--color-bg-black)
- **Contenido:**
  - Logo "VIBECODE" pequeño, peso semibold
  - Links de redes sociales como SVG inline: X (Twitter), GitHub, Discord, LinkedIn — color --color-text-secondary, hover: blanco
  - Todos con `href="#"` (placeholders)
  - Copyright: "© 2026 Vibecode Summit Colombia"
- **Layout:** Centrado, una línea en desktop, stacked en mobile
- **Padding:** Moderado (60px vertical)

## SEO & Metadata

```html
<title>Vibecode Summit Colombia 2026 — Festival de Tecnología, Vibe Coding & Web3</title>
<meta name="description" content="Únete al Vibecode Summit Colombia. 3 días de charlas, workshops y hackathon sobre vibe coding, web3, crypto e inteligencia artificial. Octubre 2026, Bogotá.">
<meta property="og:title" content="Vibecode Summit Colombia 2026">
<meta property="og:description" content="El festival de tecnología donde el código se encuentra con el futuro. Bogotá, Octubre 2026.">
<meta property="og:type" content="website">
<meta property="og:image" content="/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
```

## Accesibilidad

- Respetar `prefers-reduced-motion`: cuando está activo, desactivar todas las animaciones GSAP y el typewriter muestra el texto completo directamente
- Contraste mínimo WCAG AA en todos los textos
- Navegación por teclado funcional (focus states visibles)
- Alt text en todas las imágenes
- Landmarks semánticos (`<nav>`, `<main>`, `<section>`, `<footer>`)
- `aria-label` en links de redes sociales

## Responsive Design

- **Desktop (1200px+):** Layout completo, tipografía oversized, grids multi-columna (4 cols speakers, 3 cols tickets), timeline alternado
- **Tablet (768-1199px):** Grids a 2 columnas, tipografía escalada vía clamp(), timeline linear, tickets stacked
- **Mobile (< 768px):** Single column, hamburger nav full-screen overlay, tipografía adaptada vía clamp(), timeline linear, parallax reducido a 10%
- Imágenes optimizadas con `<picture>` y formatos WebP con fallback JPG

## Animaciones (GSAP + ScrollTrigger) — Configuraciones Específicas

| Animación | Trigger | Start | End | Scrub | Valores |
|-----------|---------|-------|-----|-------|---------|
| Hero pin + zoom | Hero section | `top top` | `+=50%` | `1` | scale: 1→1.15, opacity: 1→0 |
| Section title reveal | Cada título | `top 80%` | — | `false` | translateY: 60→0, opacity: 0→1, duration: 0.8s |
| Speaker cards stagger | Grid container | `top 75%` | — | `false` | translateY: 40→0, opacity: 0→1, stagger: 0.12s |
| Agenda blocks | Cada bloque | `top 80%` | — | `false` | translateX: ±40→0, opacity: 0→1, stagger: 0.15s |
| Location parallax | Imagen | `top bottom` | `bottom top` | `true` | y: "20%" → "-20%" |
| Sponsor logos | Grid container | `top 80%` | — | `false` | opacity: 0→1, stagger: 0.08s |
| Ticket cards | Cards container | `top 75%` | — | `false` | scale: 0.9→1, opacity: 0→1, stagger: 0.15s |
| Navbar bg | Hero section | `bottom top` | — | `false` | toggleClass "scrolled" |

- **`prefers-reduced-motion`:** Todas las animaciones se desactivan. Elementos aparecen en su estado final.

## Performance

- Astro genera HTML estático — solo se hidrata lo mínimo
- GSAP cargado como módulo (~30kb gzip)
- Imágenes lazy-loaded con `loading="lazy"` (excepto hero)
- Inter self-hosted, preloaded con `<link rel="preload" as="font" crossorigin>`
- Target: Lighthouse 95+ en todas las métricas

## Estructura de Archivos

```
reto-01/
├── src/
│   ├── layouts/
│   │   └── Layout.astro          # Layout base (head, fonts, meta, SEO)
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── Hero.astro
│   │   ├── Speakers.astro
│   │   ├── Agenda.astro
│   │   ├── Ubicacion.astro
│   │   ├── Sponsors.astro
│   │   ├── Tickets.astro
│   │   └── Footer.astro
│   ├── styles/
│   │   ├── global.css            # Reset, variables CSS, tipografía base
│   │   └── animations.css        # Keyframes (cursor blink, etc.)
│   ├── scripts/
│   │   ├── gsap-init.ts          # Setup GSAP + ScrollTrigger + todas las animaciones
│   │   ├── typewriter.ts         # Efecto typewriter del hero
│   │   └── navbar.ts             # Lógica navbar scroll + mobile menu toggle
│   ├── data/
│   │   ├── speakers.json         # Data de speakers
│   │   ├── agenda.json           # Data de agenda (schema definido arriba)
│   │   ├── sponsors.json         # Data de sponsors por tier
│   │   └── tickets.json          # Data de tiers de tickets
│   ├── pages/
│   │   └── index.astro           # Página principal — ensambla todos los componentes
│   └── assets/
│       └── images/               # Imágenes (venue, OG image)
├── public/
│   ├── fonts/                    # Inter woff2 self-hosted
│   └── favicon.svg
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## Criterios de Éxito

1. La landing se ve profesional y premium — comparable a sitios de conferencias tech reales
2. Las animaciones scroll-driven son suaves y cinematográficas
3. Responsive perfecto en mobile, tablet y desktop
4. Lighthouse 95+ en performance, accessibility, best practices y SEO
5. Todo el contenido en español
6. El efecto typewriter en el hero transmite la identidad de "vibe coding"
7. Accesibilidad completa: prefers-reduced-motion, WCAG AA, navegación por teclado
8. Componentes nombrados consistentemente en español donde aplica (Ubicacion.astro)
