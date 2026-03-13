# Reto 1: Vibecode Summit Colombia

Landing page para un festival ficticio de tecnología centrado en vibe coding, web3 y crypto.

## Tech Stack

- **Astro 5** — generación estática
- **GSAP + ScrollTrigger** — animaciones scroll-driven
- **CSS vanilla** — sin frameworks
- **Inter** — tipografía self-hosted

## Ejecutar

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Estructura

- `src/components/` — Navbar, Hero, Speakers, Agenda, Ubicación, Sponsors, Tickets, Footer
- `src/data/` — JSON con datos de speakers, agenda, sponsors, tickets
- `src/scripts/` — GSAP init, typewriter, navbar
- `src/styles/` — CSS global con design tokens
