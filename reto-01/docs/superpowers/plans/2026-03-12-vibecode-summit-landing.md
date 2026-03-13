# Vibecode Summit Colombia — Landing Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, Apple-style landing page for Vibecode Summit Colombia using Astro 5 + GSAP with scroll-driven animations, typewriter hero effect, and full responsive design.

**Architecture:** Astro 5 static site with component-per-section architecture. GSAP + ScrollTrigger handles all scroll animations. Data-driven sections (speakers, agenda, sponsors, tickets) read from JSON files. CSS vanilla with custom properties for design tokens. No frameworks CSS.

**Tech Stack:** Astro 5, GSAP 3 + ScrollTrigger, TypeScript, CSS vanilla, Inter font (self-hosted)

**Spec:** `docs/superpowers/specs/2026-03-12-vibecode-summit-landing-design.md`

---

## Chunk 1: Project Scaffolding & Foundation

### Task 1: Initialize Astro project and install dependencies

**Files:**
- Create: `reto-01/package.json`
- Create: `reto-01/astro.config.mjs`
- Create: `reto-01/tsconfig.json`

- [ ] **Step 1: Scaffold Astro project**

```bash
cd reto-01
npm create astro@latest . -- --template minimal --no-install --typescript strict
```

- [ ] **Step 2: Install dependencies**

```bash
cd reto-01
npm install
npm install gsap
```

- [ ] **Step 3: Verify dev server starts**

```bash
cd reto-01
npm run dev
```

Expected: Server starts on localhost:4321, shows Astro welcome page.

- [ ] **Step 4: Commit**

```bash
git add reto-01/package.json reto-01/package-lock.json reto-01/astro.config.mjs reto-01/tsconfig.json reto-01/src/
git commit -m "feat(reto-01): scaffold Astro project with GSAP dependency"
```

---

### Task 2: Download Inter font and create favicon

**Files:**
- Create: `reto-01/public/fonts/Inter-Regular.woff2` (400)
- Create: `reto-01/public/fonts/Inter-Medium.woff2` (500)
- Create: `reto-01/public/fonts/Inter-SemiBold.woff2` (600)
- Create: `reto-01/public/fonts/Inter-Bold.woff2` (700)
- Create: `reto-01/public/favicon.svg`

- [ ] **Step 1: Download Inter woff2 files**

Download Inter font weights 400, 500, 600, 700 in woff2 format from fontsource or Google Fonts API. Place in `reto-01/public/fonts/`. Weight 300 (Light) is omitted — not used in any section of the spec.

- [ ] **Step 2: Create favicon SVG**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#7c3aed"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="white" font-family="system-ui" font-weight="700" font-size="18">V</text>
</svg>
```

Save to `reto-01/public/favicon.svg`.

- [ ] **Step 3: Commit**

```bash
git add reto-01/public/fonts/ reto-01/public/favicon.svg
git commit -m "feat(reto-01): add self-hosted Inter font and favicon"
```

---

### Task 3: Create global styles with design tokens

**Files:**
- Create: `reto-01/src/styles/global.css`
- Create: `reto-01/src/styles/animations.css`

- [ ] **Step 1: Write global.css**

Contains:
- CSS reset (minimal: box-sizing, margin reset, img max-width)
- @font-face declarations for Inter weights 400, 500, 600, 700 with `font-display: swap` on each (300 omitted — not used, CSS var `--font-weight-light` kept for future use but falls back to Regular)
- All CSS custom properties from spec (colors, typography, spacing, transitions)
- Base body styles: font-family, background, color, overflow-x hidden
- `.container` utility: max-width 1280px, margin auto, padding horizontal
- `.section` utility: padding vertical var(--section-padding)
- Smooth scroll: `html { scroll-behavior: smooth }`
- `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`

- [ ] **Step 2: Write animations.css**

Contains:
- `@keyframes cursor-blink` — opacity 0→1 at 50%, `animation: cursor-blink 1.06s step-end infinite` (530ms per state = 1.06s total cycle)
- `@keyframes fade-in-up` — translateY(20px)→0, opacity 0→1

- [ ] **Step 3: Commit**

```bash
git add reto-01/src/styles/
git commit -m "feat(reto-01): add global CSS with design tokens and animations"
```

---

### Task 4: Create base Layout and index page

**Files:**
- Create: `reto-01/src/layouts/Layout.astro`
- Modify: `reto-01/src/pages/index.astro`

- [ ] **Step 1: Write Layout.astro**

Contains:
- `<!DOCTYPE html>` with `lang="es"`
- `<head>`: charset, viewport, title from prop, meta description, OG tags, twitter card, favicon
- `<link rel="preload" href="/fonts/Inter-Bold.woff2" as="font" type="font/woff2" crossorigin>` and same for Inter-Regular.woff2
- Import global.css and animations.css
- `<body>` with `<slot />`

- [ ] **Step 2: Write index.astro**

Minimal page using Layout. Structure: `<Navbar />` then `<main>` wrapping all section components, then `<Footer />`. Start with placeholder `<h1>Vibecode Summit Colombia</h1>` inside `<main>` to verify everything works. The `<main>` landmark is required for accessibility.

- [ ] **Step 3: Verify in browser**

```bash
cd reto-01 && npm run dev
```

Expected: Page loads with Inter font, dark background, white text, correct title in tab.

- [ ] **Step 4: Commit**

```bash
git add reto-01/src/layouts/ reto-01/src/pages/
git commit -m "feat(reto-01): add base Layout with SEO metadata and index page"
```

---

## Chunk 2: Data Files & Static Components (Navbar, Hero, Footer)

### Task 5: Create all JSON data files

**Files:**
- Create: `reto-01/src/data/speakers.json`
- Create: `reto-01/src/data/agenda.json`
- Create: `reto-01/src/data/sponsors.json`
- Create: `reto-01/src/data/tickets.json`

- [ ] **Step 1: Write speakers.json**

Array of 8 speaker objects with fields: `name`, `role`, `company`, `avatar` (placeholder path).

```json
[
  { "name": "Mariana Velasco", "role": "CTO", "company": "Protocolo Lumina" },
  { "name": "Andrés Ríos", "role": "Founder", "company": "VibeStudio" },
  { "name": "Camila Herrera", "role": "Head of Engineering", "company": "ChainLab" },
  { "name": "Diego Montoya", "role": "AI Research Lead", "company": "NeuralForge" },
  { "name": "Valentina Cruz", "role": "Web3 Developer Advocate", "company": "EtherCore" },
  { "name": "Santiago Mora", "role": "Blockchain Architect", "company": "CryptoAndes" },
  { "name": "Isabella Torres", "role": "Product Lead", "company": "CodeVerse DAO" },
  { "name": "Mateo Guzmán", "role": "Senior Protocol Engineer", "company": "ZK Labs" }
]
```

- [ ] **Step 2: Write agenda.json**

Use the exact schema from the spec with 3 days and all events.

- [ ] **Step 3: Write sponsors.json**

```json
{
  "platinum": [
    { "name": "ChainVerse Labs" },
    { "name": "NeuralPay" }
  ],
  "gold": [
    { "name": "CryptoAndes" },
    { "name": "BlockForge" },
    { "name": "VibeTools" },
    { "name": "DataNode" }
  ],
  "silver": [
    { "name": "ZKSync Studio" },
    { "name": "TokenBridge" },
    { "name": "DevPulse" },
    { "name": "SmartLayer" },
    { "name": "CodeNexus" },
    { "name": "HashFlow" }
  ]
}
```

- [ ] **Step 4: Write tickets.json**

```json
[
  {
    "tier": "Early Bird",
    "price": 149,
    "currency": "USD",
    "features": ["Acceso general 3 días", "Swag básico", "Acceso a grabaciones"],
    "highlighted": false
  },
  {
    "tier": "General",
    "price": 299,
    "currency": "USD",
    "features": ["Todo Early Bird", "Workshops incluidos", "Swag completo", "Certificado"],
    "highlighted": false
  },
  {
    "tier": "VIP",
    "price": 599,
    "currency": "USD",
    "features": ["Todo General", "Networking exclusivo", "Acceso backstage", "Meet & greet con speakers"],
    "highlighted": true
  }
]
```

- [ ] **Step 5: Commit**

```bash
git add reto-01/src/data/
git commit -m "feat(reto-01): add JSON data files for speakers, agenda, sponsors, tickets"
```

---

### Task 6: Build Navbar component

**Files:**
- Create: `reto-01/src/components/Navbar.astro`
- Create: `reto-01/src/scripts/navbar.ts`

- [ ] **Step 1: Write Navbar.astro**

Contains:
- `<nav>` with `position: fixed`, full width, z-index 1000, transparent by default
- Logo "VIBECODE" on left — `<a>` with font-weight semibold, letter-spacing 0.15em, color white, links to `#`
- Navigation links on right: Speakers, Agenda, Ubicación, Sponsors, Entradas — each `<a href="#section-id">`
- `.scrolled` class styles: `background: rgba(10,10,10,0.8)`, `backdrop-filter: blur(20px)`
- Hamburger button (hidden on desktop): 3 lines, toggles `.open` class
- Mobile overlay: full-screen, flex center, links stacked vertically, font-size large
- Scoped `<style>` with all navbar CSS including responsive breakpoints

- [ ] **Step 2: Write navbar.ts**

Contains:
- Mobile menu toggle: click handler on hamburger button, toggles `.open` on nav, toggles `overflow: hidden` on body
- Close menu when a nav link is clicked (for smooth scroll UX)
- Export function `initNavbar()` that sets up event listeners

- [ ] **Step 3: Add Navbar to index.astro and verify**

Import Navbar in index.astro, place before main content. Verify in browser: navbar visible, links present, hamburger works on mobile viewport.

- [ ] **Step 4: Commit**

```bash
git add reto-01/src/components/Navbar.astro reto-01/src/scripts/navbar.ts reto-01/src/pages/index.astro
git commit -m "feat(reto-01): add Navbar with mobile hamburger menu"
```

---

### Task 7: Build Hero component with typewriter effect

**Files:**
- Create: `reto-01/src/components/Hero.astro`
- Create: `reto-01/src/scripts/typewriter.ts`

- [ ] **Step 1: Write Hero.astro**

Contains:
- `<section id="hero">` with min-height 100vh, flex center, position relative
- Background: `--color-bg-black` with radial-gradient overlays (violeta arriba-derecha, azul abajo-izquierda, opacity ~0.15)
- `<h1 class="hero-title">` — empty, will be filled by typewriter. Font-size var(--text-hero), weight bold, color white
- `<span class="cursor">|</span>` — after h1, with cursor-blink animation
- `<p class="hero-subtitle">` — "Donde el código se encuentra con el futuro", opacity 0 initially
- `<p class="hero-info">` — "Octubre 2026 · Bogotá, Colombia", opacity 0 initially
- `<a class="hero-cta" href="#tickets">` — "Obtener Entradas", white bg, black text, border-radius 100px, padding generous
- Scoped `<style>` with all hero CSS
- `<script>` tag importing typewriter.ts

- [ ] **Step 2: Write typewriter.ts**

Contains:
- `initTypewriter()` function:
  - Target text: "VIBECODE SUMMIT COLOMBIA"
  - Check `prefers-reduced-motion`: if true, show full text immediately, show subtitle/info immediately, return
  - Type each character at 60ms interval
  - After "VIBECODE" (8 chars), pause 400ms before continuing
  - After typing completes, wait 500ms, then add `.visible` class to subtitle (triggers CSS fade-in-up 0.6s)
  - After subtitle, wait 200ms, add `.visible` to info
  - After info, wait 200ms, add `.visible` to CTA
- Run on `DOMContentLoaded`

- [ ] **Step 3: Add Hero to index.astro and verify**

Import Hero, place after Navbar. Verify: typewriter animates text, cursor blinks, subtitle fades in after.

- [ ] **Step 4: Commit**

```bash
git add reto-01/src/components/Hero.astro reto-01/src/scripts/typewriter.ts reto-01/src/pages/index.astro
git commit -m "feat(reto-01): add Hero with typewriter effect and gradient background"
```

---

### Task 8: Build Footer component

**Files:**
- Create: `reto-01/src/components/Footer.astro`

- [ ] **Step 1: Write Footer.astro**

Contains:
- `<footer>` with bg --color-bg-black, padding 60px vertical
- Logo "VIBECODE" small, semibold
- Social links row: X (Twitter), GitHub, Discord, LinkedIn — inline SVG icons, `href="#"`, `aria-label` on each
- Icons color: --color-text-secondary, hover: white
- Copyright: "© 2026 Vibecode Summit Colombia"
- Layout: flex, centered, row on desktop, column on mobile
- Scoped `<style>`

- [ ] **Step 2: Add Footer to index.astro and verify**

Verify: footer renders at bottom, icons visible, hover states work.

- [ ] **Step 3: Commit**

```bash
git add reto-01/src/components/Footer.astro reto-01/src/pages/index.astro
git commit -m "feat(reto-01): add Footer with social icons"
```

---

## Chunk 3: Content Sections (Speakers, Agenda, Ubicación, Sponsors, Tickets)

### Task 9: Build Speakers component

**Files:**
- Create: `reto-01/src/components/Speakers.astro`

- [ ] **Step 1: Write Speakers.astro**

Contains:
- `<section id="speakers">` with bg --color-bg-light, padding var(--section-padding)
- `<h2 class="section-title">Speakers</h2>` — font-size var(--text-section-title), color --color-text-dark, initially opacity 0 translateY 60px (for GSAP)
- `.container` wrapping content
- Grid of 8 speaker cards from imported speakers.json
- Each card: avatar placeholder (CSS gradient circle or SVG), name (h3), role, company
- Avatar: 120px circle, grayscale, with unique gradient per speaker based on index
- Card hover: scale(1.03), box-shadow, grayscale removed
- Grid: 4 cols desktop, 2 tablet, 1 mobile via CSS grid + media queries
- Cards initially: opacity 0, translateY 40px (for GSAP stagger)
- Scoped `<style>`

- [ ] **Step 2: Add to index.astro and verify**

Verify: section renders, grid works, cards show data, hover effects work, responsive on resize.

- [ ] **Step 3: Commit**

```bash
git add reto-01/src/components/Speakers.astro reto-01/src/pages/index.astro
git commit -m "feat(reto-01): add Speakers section with card grid"
```

---

### Task 10: Build Agenda component

**Files:**
- Create: `reto-01/src/components/Agenda.astro`

- [ ] **Step 1: Write Agenda.astro**

Contains:
- `<section id="agenda">` with bg --color-bg-dark, padding var(--section-padding)
- `<h2 class="section-title">Agenda</h2>` — color white, initially hidden for GSAP
- Day tabs/headers showing "Día 1 — 15 Oct", "Día 2 — 16 Oct", "Día 3 — 17 Oct"
- Timeline layout: vertical line in center (desktop), events alternating left/right
- Each event block: time, title, speaker name, category tag pill
- Tag pill: colored background (semitransparent) based on tag value using CSS classes `.tag-web3`, `.tag-vibecoding`, `.tag-crypto`, `.tag-ai`
- Events initially: opacity 0, translateX(±40px) for GSAP
- Mobile/tablet: linear layout, no alternating, line on left side
- Import agenda.json, iterate with Astro template
- Scoped `<style>`

- [ ] **Step 2: Add to index.astro and verify**

Verify: timeline renders, tags colored correctly, responsive layout works.

- [ ] **Step 3: Commit**

```bash
git add reto-01/src/components/Agenda.astro reto-01/src/pages/index.astro
git commit -m "feat(reto-01): add Agenda section with timeline layout"
```

---

### Task 11: Build Ubicación component

**Files:**
- Create: `reto-01/src/components/Ubicacion.astro`

- [ ] **Step 1: Source venue image and OG image**

Use a high-quality Unsplash image of Bogotá cityscape or convention center. Download and save to `reto-01/src/assets/images/venue.jpg`. Optimize to WebP as well: `reto-01/src/assets/images/venue.webp`.

Also create an OG image (1200x630px) for social sharing. This can be a simple dark card with "VIBECODE SUMMIT COLOMBIA" text and event date. Save to `reto-01/public/og-image.jpg`. This is referenced by the Layout's `<meta property="og:image">` tag.

Alternatively, use a CSS gradient/placeholder for the venue if no suitable image is available, with a note to replace later.

- [ ] **Step 2: Write Ubicacion.astro**

Contains:
- `<section id="ubicacion">`
- Image container: height 80vh, overflow hidden, position relative
- `<picture>` with WebP source + JPG fallback, `object-fit: cover`, full width/height, `loading="lazy"`, `alt="Centro de Convenciones Ágora, Bogotá"`
- Dark overlay: `rgba(0,0,0,0.5)` absolute positioned
- Text overlay centered: "Centro de Convenciones Ágora" (--text-section-title), "Bogotá, Colombia" (--text-h3), white, text-shadow for readability
- Info grid below image (bg --color-bg-dark): 3 columns with Dirección, Cómo llegar, Fecha (15-17 Octubre 2026)
- Mobile: info grid stacks to 1 column
- Image wrapper has class for GSAP parallax
- Scoped `<style>`

- [ ] **Step 3: Add to index.astro and verify**

Verify: image displays, overlay text readable, info grid responsive.

- [ ] **Step 4: Commit**

```bash
git add reto-01/src/components/Ubicacion.astro reto-01/src/assets/ reto-01/src/pages/index.astro
git commit -m "feat(reto-01): add Ubicación section with venue image and info grid"
```

---

### Task 12: Build Sponsors component

**Files:**
- Create: `reto-01/src/components/Sponsors.astro`

- [ ] **Step 1: Write Sponsors.astro**

Contains:
- `<section id="sponsors">` with bg --color-bg-dark, padding var(--section-padding)
- `<h2 class="section-title">Sponsors</h2>` — white, hidden for GSAP
- Three tier groups: Platinum, Gold, Silver with label above each
- Each sponsor rendered as an SVG placeholder: rounded rectangle with company name text inside
  - Platinum: 180px wide
  - Gold: 120px wide
  - Silver: 80px wide
- Logos: `filter: grayscale(100%) opacity(0.6)`, hover removes filter, transition 0.3s
- Layout: flex wrap, centered, gap between logos
- Initially opacity 0 for GSAP stagger
- CTA at bottom: "Sé sponsor" text link, --color-text-secondary, underline on hover
- Import sponsors.json
- Scoped `<style>`

- [ ] **Step 2: Add to index.astro and verify**

Verify: tiers display correctly, logos grayscale, hover brings color, responsive.

- [ ] **Step 3: Commit**

```bash
git add reto-01/src/components/Sponsors.astro reto-01/src/pages/index.astro
git commit -m "feat(reto-01): add Sponsors section with tiered logos"
```

---

### Task 13: Build Tickets component

**Files:**
- Create: `reto-01/src/components/Tickets.astro`

- [ ] **Step 1: Write Tickets.astro**

Contains:
- `<section id="tickets">` with bg --color-bg-dark, subtle violet gradient (callback to hero)
- `<h2 class="section-title">Asegura tu lugar</h2>` — white, hidden for GSAP
- 3 ticket cards in a row (CSS grid: 3 cols desktop, 1 col tablet/mobile)
- Each card: tier name, price ($X USD), feature list (ul), "Comprar" button
- VIP card: `border: 1px solid var(--color-accent)`, `box-shadow: 0 0 40px var(--color-accent-glow)`
- Regular cards: `border: 1px solid var(--color-border)`
- Button: same style as hero CTA (white bg, black text, pill shape)
- Cards initially: scale(0.9), opacity 0 for GSAP
- Import tickets.json
- Scoped `<style>`

- [ ] **Step 2: Add to index.astro and verify**

Verify: 3 cards render, VIP highlighted, responsive stacking, buttons styled.

- [ ] **Step 3: Commit**

```bash
git add reto-01/src/components/Tickets.astro reto-01/src/pages/index.astro
git commit -m "feat(reto-01): add Tickets section with pricing cards"
```

---

## Chunk 4: GSAP Animations & Final Polish

### Task 14: Initialize GSAP and wire all scroll animations

**Files:**
- Create: `reto-01/src/scripts/gsap-init.ts`
- Modify: `reto-01/src/layouts/Layout.astro` (add script import)

- [ ] **Step 1: Write gsap-init.ts**

Contains:
- Import gsap and ScrollTrigger
- `gsap.registerPlugin(ScrollTrigger)`
- Check `prefers-reduced-motion` — if true, return early (no animations)
- **Hero pin + zoom:** pin hero section, scrub 1, start "top top", end "+=50%", animate scale 1→1.15 and opacity 1→0 on `.hero-content`
- **Navbar background:** `ScrollTrigger.create({ trigger: '#hero', start: 'bottom top', onLeave: () => nav.classList.add('scrolled'), onEnterBack: () => nav.classList.remove('scrolled') })`
- **Section title reveals:** `gsap.utils.toArray('.section-title')` — each gets translateY 60→0, opacity 0→1, start "top 80%", duration 0.8
- **Speaker cards stagger:** target `.speakers-grid` as trigger element, animate children `.speaker-card` with translateY 40→0, opacity 0→1, stagger 0.12, start "top 75%"
- **Agenda blocks stagger:** translateX ±40→0 (alternate with index), opacity 0→1, stagger 0.15, start "top 80%"
- **Location parallax:** image translateY "20%" to "-20%", scrub true, start "top bottom", end "bottom top". Use `ScrollTrigger.matchMedia` to reduce parallax on mobile: `"(max-width: 767px)"` → y: "5%" to "-5%" (reduced to ~10%)
- **Sponsor logos stagger:** opacity 0→1, stagger 0.08, start "top 80%"
- **Ticket cards stagger:** scale 0.9→1, opacity 0→1, stagger 0.15, start "top 75%"

- [ ] **Step 2: Import gsap-init.ts in Layout.astro**

Add `<script>` tag in body end that imports and runs the GSAP init.

- [ ] **Step 3: Verify all animations in browser**

Test each section by scrolling through. Verify:
- Hero pins and zooms out
- Navbar gets solid bg after hero
- All titles reveal on scroll
- Cards/items stagger in
- Parallax on venue image
- Ticket cards scale in

- [ ] **Step 4: Test prefers-reduced-motion**

In browser DevTools, enable "Prefer reduced motion". Reload. Verify all elements are visible immediately without animation.

- [ ] **Step 5: Commit**

```bash
git add reto-01/src/scripts/gsap-init.ts reto-01/src/layouts/Layout.astro
git commit -m "feat(reto-01): add GSAP ScrollTrigger animations for all sections"
```

---

### Task 15: Responsive polish and cross-device testing

**Files:**
- Modify: Various component `<style>` blocks as needed

- [ ] **Step 1: Test desktop (1200px+)**

Verify: full grid layouts, oversized typography, all animations smooth.

- [ ] **Step 2: Test tablet (768-1199px)**

Verify: grids reduce to 2 columns, timeline goes linear, tickets stack, typography scales down.

- [ ] **Step 3: Test mobile (< 768px)**

Verify: single column, hamburger nav works, overlay opens/closes, all content readable, no horizontal scroll.

- [ ] **Step 4: Fix any responsive issues found**

Adjust media queries, paddings, font sizes as needed in component scoped styles.

- [ ] **Step 5: Commit**

```bash
git add reto-01/src/components/ reto-01/src/styles/
git commit -m "fix(reto-01): responsive polish for tablet and mobile"
```

---

### Task 16: Accessibility audit and fixes

**Files:**
- Modify: Various components as needed

- [ ] **Step 1: Run accessibility checks**

- Verify all images have alt text
- Verify semantic landmarks: `<nav>`, `<main>`, `<section>`, `<footer>`
- Verify focus states visible on all interactive elements (links, buttons)
- Verify `aria-label` on social icons and hamburger button
- Verify color contrast passes WCAG AA (use browser DevTools)

- [ ] **Step 2: Fix any issues found**

Add missing aria labels, fix contrast issues, add focus-visible styles if missing.

- [ ] **Step 3: Commit**

```bash
git add reto-01/src/components/ reto-01/src/layouts/ reto-01/src/styles/
git commit -m "fix(reto-01): accessibility improvements — aria labels, focus states, contrast"
```

---

### Task 17: Build production and verify Lighthouse

**Files:**
- No new files

- [ ] **Step 1: Run production build**

```bash
cd reto-01
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 2: Preview production build**

```bash
cd reto-01
npm run preview
```

- [ ] **Step 3: Run Lighthouse audit**

Open Chrome DevTools → Lighthouse → run audit for Performance, Accessibility, Best Practices, SEO.

Target: 95+ on all four metrics.

- [ ] **Step 4: Fix any Lighthouse issues**

Common fixes: image optimization, missing meta tags, CLS from animations, font display swap.

- [ ] **Step 5: Commit fixes if any**

```bash
git add reto-01/src/
git commit -m "perf(reto-01): Lighthouse optimizations"
```

---

### Task 18: Update README and final commit

**Files:**
- Modify: `reto-01/README.md`

- [ ] **Step 1: Update reto-01 README**

Replace placeholder content with:
- Project name and description
- Tech stack
- How to run: `npm install`, `npm run dev`
- How to build: `npm run build`
- Project structure overview

- [ ] **Step 2: Update root README status**

Change reto-01 status from "Pendiente" to "Completado" in the root README table.

- [ ] **Step 3: Final commit and push**

```bash
git add reto-01/README.md README.md
git commit -m "docs(reto-01): update README with project info and mark as completed"
git push origin main
```
