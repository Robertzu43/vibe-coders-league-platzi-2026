# Reto 2 — Music DNA Dashboard

> Vibe Coders League Platzi 2026

**Live:** [music-dna.pages.dev](https://music-dna.pages.dev/)

Dashboard personal que convierte tus datos de escucha de Spotify en una experiencia visual y sensorial. Porque conformarte con entender tu música solo una vez al año no es suficiente si eres melómano.

## Tech Stack

- Astro 6 (Static Site Generation)
- GSAP 3 + ScrollTrigger (Scroll-driven animations)
- CSS vanilla + Glass Morphism + Design Tokens
- TypeScript
- SVG (Radar chart, trend line, favicon)
- Google Fonts (Syne + Outfit)
- Cloudflare Pages (Deploy)

## Features

- **Top Artists** con flip cards 3D que revelan minutos escuchados, entrada animada desde los lados con GSAP timeline
- **Genre Breakdown** con porcentajes de 72px con glow pulsante, largest-remainder method para sumar exactamente 100%
- **Sound DNA** radar chart que morfea desde el centro con ScrollTrigger
- **Listening Activity** barras que crecen al hacer scroll
- **Monthly Trend** línea que se dibuja como trazo de tinta
- **Sidebar** con flip cards 3D en las estadísticas (Top Artist, Top Track, Top Genre en el reverso)
- **Now Playing** reproductor con vinilo giratorio y controles de audio
- **Time Range Toggle** (4 semanas / 6 meses / All time)
- **Fondo atmosférico** con ruido SVG, 3 orbes de color flotantes animados
- **Glass cards** con gradient border shine via mask-composite
- **Favicon** SVG con barras de audio en gradiente
- Responsive: Desktop, Tablet, Mobile
- Animaciones respetan `prefers-reduced-motion`
- XSS-safe dynamic HTML con utility `esc()`

## Setup

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name music-dna
```

## Estado

- [x] Completado
