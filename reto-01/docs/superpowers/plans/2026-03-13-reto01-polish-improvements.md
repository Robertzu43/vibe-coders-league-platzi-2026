# Reto 01 Polish Improvements — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve 4 sections of the Vibecode Summit Colombia landing page: slower typewriter, iOS dock speakers, split venue layout, and hierarchical sponsor grid.

**Architecture:** Modify existing Astro components in-place. Add one new TypeScript module (`dock.ts`) for the speakers dock logic. Update `gsap-init.ts` to match new DOM selectors. Download a venue image from Unsplash for the split layout. No new dependencies.

**Tech Stack:** Astro 5, GSAP 3 + ScrollTrigger, CSS vanilla, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-13-reto01-polish-improvements-design.md`

---

## Chunk 1: Typewriter Speed + Speakers Data

### Task 1: Slow down the typewriter effect

**Files:**
- Modify: `reto-01/src/scripts/typewriter.ts:23-24`

- [ ] **Step 1: Update speed constants**

Change line 23 and 24:

```typescript
const speed = 110; // ms per character (was 60)
const pauseAfterVibecode = 800; // ms pause after "VIBECODE" (was 400)
```

- [ ] **Step 2: Verify in browser**

```bash
cd reto-01 && npm run dev
```

Expected: Open `http://localhost:4321`, hero text types noticeably slower with a longer dramatic pause after "VIBECODE".

- [ ] **Step 3: Commit**

```bash
git add reto-01/src/scripts/typewriter.ts
git commit -m "feat(reto-01): slow down typewriter effect for more dramatic pacing"
```

---

### Task 2: Add tags to speakers.json

**Files:**
- Modify: `reto-01/src/data/speakers.json`

- [ ] **Step 1: Replace speakers.json with tags field added**

```json
[
  { "name": "Mariana Velasco", "role": "CTO", "company": "Protocolo Lumina", "tags": ["DeFi", "Web3"] },
  { "name": "Andrés Ríos", "role": "Founder", "company": "VibeStudio", "tags": ["Vibe Coding", "Tools"] },
  { "name": "Camila Herrera", "role": "Head of Engineering", "company": "ChainLab", "tags": ["Web3", "Security"] },
  { "name": "Diego Montoya", "role": "AI Research Lead", "company": "NeuralForge", "tags": ["AI", "Agents"] },
  { "name": "Valentina Cruz", "role": "Web3 Developer Advocate", "company": "EtherCore", "tags": ["Web3", "DevRel"] },
  { "name": "Santiago Mora", "role": "Blockchain Architect", "company": "CryptoAndes", "tags": ["Crypto", "Architecture"] },
  { "name": "Isabella Torres", "role": "Product Lead", "company": "CodeVerse DAO", "tags": ["DAOs", "Product"] },
  { "name": "Mateo Guzmán", "role": "Senior Protocol Engineer", "company": "ZK Labs", "tags": ["ZK Proofs", "Crypto"] }
]
```

- [ ] **Step 2: Commit**

```bash
git add reto-01/src/data/speakers.json
git commit -m "feat(reto-01): add tags field to speakers data"
```

---

## Chunk 2: Speakers iOS Dock

### Task 3: Create dock.ts — magnification logic

**Files:**
- Create: `reto-01/src/scripts/dock.ts`

- [ ] **Step 1: Write dock.ts**

```typescript
export function initDock() {
  const dock = document.querySelector('.speakers-dock') as HTMLElement | null;
  if (!dock) return;

  const items = dock.querySelectorAll<HTMLElement>('.dock-item');
  const card = document.querySelector('.dock-info-card') as HTMLElement | null;
  const cardName = card?.querySelector('.dock-card-name');
  const cardRole = card?.querySelector('.dock-card-role');
  const cardCompany = card?.querySelector('.dock-card-company');
  const cardTags = card?.querySelector('.dock-card-tags');

  const BASE_SCALE = 1;
  const MAGNIFICATION = 0.6;
  const RANGE = 180; // px radius of influence

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let activeIndex = -1;

  function resetItems() {
    items.forEach((item) => {
      item.style.transform = `scale(${BASE_SCALE})`;
      const avatar = item.querySelector('.dock-avatar') as HTMLElement;
      if (avatar) {
        avatar.style.filter = 'grayscale(100%)';
        avatar.style.boxShadow = 'none';
      }
    });
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(8px)';
    }
    activeIndex = -1;
  }

  function updateCard(index: number) {
    if (!card || index < 0 || index >= items.length) return;
    const item = items[index];
    const name = item.dataset.name || '';
    const role = item.dataset.role || '';
    const company = item.dataset.company || '';
    const tags = item.dataset.tags || '';

    if (cardName) cardName.textContent = name;
    if (cardRole) cardRole.textContent = role;
    if (cardCompany) cardCompany.textContent = company;
    if (cardTags) {
      cardTags.innerHTML = tags
        .split(',')
        .map((t) => `<span class="dock-tag">${t.trim()}</span>`)
        .join('');
    }

    // Position card centered under the active item
    const dockRect = dock!.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const cardWidth = card.offsetWidth;
    const itemCenter = itemRect.left + itemRect.width / 2 - dockRect.left;
    let left = itemCenter - cardWidth / 2;

    // Clamp so card doesn't overflow the dock container
    const maxLeft = dockRect.width - cardWidth;
    left = Math.max(0, Math.min(left, maxLeft));

    card.style.left = `${left}px`;
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }

  if (prefersReducedMotion) {
    // Click-based interaction instead of hover
    items.forEach((item, i) => {
      item.addEventListener('click', () => {
        resetItems();
        item.style.transform = `scale(1.3)`;
        const avatar = item.querySelector('.dock-avatar') as HTMLElement;
        if (avatar) {
          avatar.style.filter = 'grayscale(0%)';
          avatar.style.boxShadow = '0 0 30px rgba(124, 58, 237, 0.5)';
        }
        activeIndex = i;
        updateCard(i);
      });
    });
    return;
  }

  dock.addEventListener('mousemove', (e: MouseEvent) => {
    const dockRect = dock!.getBoundingClientRect();
    const mouseX = e.clientX - dockRect.left;

    let closestIndex = -1;
    let closestDist = Infinity;

    items.forEach((item, i) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2 - dockRect.left;
      const distance = Math.abs(mouseX - itemCenter);
      const scale = BASE_SCALE + MAGNIFICATION * Math.max(0, 1 - distance / RANGE);

      item.style.transform = `scale(${scale})`;

      const avatar = item.querySelector('.dock-avatar') as HTMLElement;
      if (avatar) {
        if (distance < RANGE * 0.3) {
          avatar.style.filter = 'grayscale(0%)';
          avatar.style.boxShadow = '0 0 30px rgba(124, 58, 237, 0.5)';
        } else {
          avatar.style.filter = 'grayscale(100%)';
          avatar.style.boxShadow = 'none';
        }
      }

      if (distance < closestDist) {
        closestDist = distance;
        closestIndex = i;
      }
    });

    if (closestIndex !== activeIndex && closestIndex >= 0) {
      activeIndex = closestIndex;
      updateCard(closestIndex);
    }
  });

  dock.addEventListener('mouseleave', () => {
    resetItems();
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add reto-01/src/scripts/dock.ts
git commit -m "feat(reto-01): add dock magnification logic for speakers"
```

---

### Task 4: Rewrite Speakers.astro with dock layout

**Files:**
- Modify: `reto-01/src/components/Speakers.astro` — full rewrite

- [ ] **Step 1: Rewrite Speakers.astro**

Replace entire file content with:

```astro
---
import speakers from '../data/speakers.json';

const gradients = [
  'linear-gradient(135deg, #7c3aed, #3b82f6)',
  'linear-gradient(135deg, #06b6d4, #10b981)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #3b82f6, #06b6d4)',
  'linear-gradient(135deg, #10b981, #7c3aed)',
  'linear-gradient(135deg, #ef4444, #f59e0b)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
];

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}
---

<section id="speakers" class="speakers-section">
  <div class="container">
    <h2
      class="section-title gsap-reveal"
      style="color: var(--color-text-dark); opacity: 0; transform: translateY(60px);"
    >
      Speakers
    </h2>

    <!-- Desktop: Dock -->
    <div class="dock-wrapper">
      <div class="speakers-dock">
        {speakers.map((speaker, i) => (
          <div
            class="dock-item"
            data-name={speaker.name}
            data-role={speaker.role}
            data-company={speaker.company}
            data-tags={speaker.tags.join(',')}
            style="opacity: 0; transform: translateY(30px);"
          >
            <div
              class="dock-avatar"
              style={`background: ${gradients[i % gradients.length]};`}
            >
              {getInitials(speaker.name)}
            </div>
          </div>
        ))}
      </div>

      <!-- Glassmorphism info card (positioned by JS) -->
      <div class="dock-info-card" style="opacity: 0; transform: translateY(8px);">
        <div class="dock-card-name"></div>
        <div class="dock-card-role"></div>
        <div class="dock-card-company"></div>
        <div class="dock-card-tags"></div>
      </div>
    </div>

    <!-- Mobile: Scroll snap carousel -->
    <div class="speakers-carousel">
      {speakers.map((speaker, i) => (
        <div class="carousel-item">
          <div
            class="dock-avatar carousel-avatar"
            style={`background: ${gradients[i % gradients.length]};`}
          >
            {getInitials(speaker.name)}
          </div>
          <div class="carousel-card">
            <div class="dock-card-name">{speaker.name}</div>
            <div class="dock-card-role">{speaker.role}</div>
            <div class="dock-card-company">{speaker.company}</div>
            <div class="dock-card-tags">
              {speaker.tags.map((tag) => (
                <span class="dock-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<script>
  import { initDock } from '../scripts/dock.ts';
  document.addEventListener('DOMContentLoaded', initDock);
</script>

<style>
  .speakers-section {
    padding: var(--section-padding) 0;
    background: var(--color-bg-light);
  }

  .container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--container-padding);
  }

  /* ---- Desktop Dock ---- */
  .dock-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 48px;
  }

  .speakers-dock {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 16px;
    padding: 24px 32px;
    padding-bottom: 80px; /* space for the info card below */
  }

  .dock-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.15s ease-out;
    transform-origin: bottom center;
  }

  .dock-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: white;
    filter: grayscale(100%);
    transition: filter 0.2s ease, box-shadow 0.2s ease;
    user-select: none;
  }

  /* ---- Info Card (glassmorphism) ---- */
  .dock-info-card {
    position: absolute;
    bottom: 0;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px 24px;
    min-width: 200px;
    text-align: center;
    transition: opacity 0.2s ease, transform 0.2s ease;
    pointer-events: none;
  }

  .dock-card-name {
    font-weight: 700;
    font-size: 16px;
    color: var(--color-text-dark);
  }

  .dock-card-role {
    font-size: 13px;
    color: var(--color-accent);
    font-weight: 600;
    margin-top: 4px;
  }

  .dock-card-company {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-top: 2px;
  }

  .dock-card-tags {
    display: flex;
    gap: 6px;
    justify-content: center;
    margin-top: 10px;
    flex-wrap: wrap;
  }

  .dock-tag {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 100px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: var(--color-text-secondary);
    background: rgba(0, 0, 0, 0.03);
  }

  /* ---- Mobile Carousel ---- */
  .speakers-carousel {
    display: none;
  }

  @media (max-width: 767px) {
    .dock-wrapper {
      display: none;
    }

    .speakers-carousel {
      display: flex;
      gap: 20px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      padding: 24px 0;
      margin-top: 32px;
      scrollbar-width: none;
    }

    .speakers-carousel::-webkit-scrollbar {
      display: none;
    }

    .carousel-item {
      flex-shrink: 0;
      width: 80%;
      scroll-snap-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .carousel-avatar {
      width: 100px;
      height: 100px;
      font-size: 32px;
      filter: grayscale(0%);
    }

    .carousel-card {
      background: rgba(0, 0, 0, 0.04);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 16px;
      padding: 20px 24px;
      text-align: center;
      width: 100%;
    }

    .carousel-card .dock-card-name {
      color: var(--color-text-dark);
    }
  }
</style>
```

- [ ] **Step 2: Verify in browser**

```bash
cd reto-01 && npm run dev
```

Expected:
- Desktop: horizontal row of circular avatars. Hovering magnifies nearby avatars. Glassmorphism card appears below the closest avatar showing name/role/company/tags.
- Mobile (< 768px): swipeable horizontal carousel with avatar + card visible per item.

- [ ] **Step 3: Commit**

```bash
git add reto-01/src/components/Speakers.astro
git commit -m "feat(reto-01): rewrite Speakers with iOS dock effect and glassmorphism cards"
```

---

### Task 5: Update gsap-init.ts for new Speakers selectors

**Files:**
- Modify: `reto-01/src/scripts/gsap-init.ts:10,58-72`

- [ ] **Step 1: Update reduced-motion selector on line 10**

Replace:

```typescript
    gsap.set('.section-title, .speaker-card, .timeline-item, .sponsor-logo, .ticket-card', {
```

With:

```typescript
    gsap.set('.section-title, .dock-item, .timeline-item, .sponsor-card, .ticket-card', {
```

- [ ] **Step 2: Replace speaker cards stagger block (lines 58-72)**

Replace the entire `// 4. Speaker cards stagger` block with:

```typescript
  // 4. Speakers dock items stagger (start at opacity:0, translateY(30px))
  const speakersDock = document.querySelector('.speakers-dock');
  if (speakersDock) {
    gsap.to('.dock-item', {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.speakers-dock',
        start: 'top 75%',
      },
    });
  }
```

- [ ] **Step 3: Replace sponsor logos stagger block (lines 118-131)**

Replace the entire `// 7. Sponsor logos stagger` block with:

```typescript
  // 7. Sponsor cards stagger by tier
  const sponsorSection = document.querySelector('#sponsors');
  if (sponsorSection) {
    ['platinum', 'gold', 'silver'].forEach((tier, tierIndex) => {
      gsap.to(`.tier-${tier} .sponsor-card`, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: `.tier-${tier}`,
          start: 'top 80%',
        },
      });
    });
  }
```

- [ ] **Step 4: Update location parallax selector**

Replace `.venue-image-wrapper` (appears twice in lines 93 and 105) with `.venue-image` in both matchMedia blocks.

- [ ] **Step 5: Verify animations in browser**

```bash
cd reto-01 && npm run dev
```

Expected: Scroll through the page — dock items stagger in, section titles reveal, all other animations still work.

- [ ] **Step 6: Commit**

```bash
git add reto-01/src/scripts/gsap-init.ts
git commit -m "feat(reto-01): update GSAP animations for new speakers/sponsors/venue selectors"
```

---

## Chunk 3: Ubicación Split Layout

### Task 6: Download venue image

**Files:**
- Create: `reto-01/src/assets/images/venue.jpg`

- [ ] **Step 1: Create the assets/images directory and download an image**

```bash
mkdir -p reto-01/src/assets/images
curl -L "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80" -o reto-01/src/assets/images/venue.jpg
```

This is a Bogotá cityscape image. If this URL doesn't work, use any high-quality convention center or Bogotá image from Unsplash.

- [ ] **Step 2: Verify the file exists and is a valid image**

```bash
file reto-01/src/assets/images/venue.jpg
```

Expected: `JPEG image data`

- [ ] **Step 3: Commit**

```bash
git add reto-01/src/assets/images/
git commit -m "feat(reto-01): add venue image for ubicación section"
```

---

### Task 7: Rewrite Ubicacion.astro with split layout

**Files:**
- Modify: `reto-01/src/components/Ubicacion.astro` — full rewrite

- [ ] **Step 1: Rewrite Ubicacion.astro**

Replace entire file content with:

```astro
---
// Ubicacion.astro — Venue section with split layout
import { Image } from 'astro:assets';
import venueImg from '../assets/images/venue.jpg';
---

<section id="ubicacion" class="ubicacion-section">
  <div class="ubicacion-split">
    <!-- Left: venue image -->
    <div class="venue-image-side">
      <div class="venue-image-container">
        <Image
          src={venueImg}
          alt="Centro de Convenciones Ágora, Bogotá"
          class="venue-image"
          loading="lazy"
          widths={[600, 900, 1200]}
          sizes="(max-width: 767px) 100vw, 60vw"
        />
        <div class="venue-overlay"></div>
        <div class="venue-text">
          <h2 class="venue-name">Centro de Convenciones Ágora</h2>
          <p class="venue-city">Bogotá, Colombia</p>
        </div>
      </div>
    </div>

    <!-- Right: info panel -->
    <div class="venue-info-panel">
      <div class="info-block" style="opacity: 0; transform: translateY(20px);">
        <span class="info-label">Dirección</span>
        <p class="info-content">
          Carrera 37 No. 24-67<br />
          Bogotá, Colombia
        </p>
      </div>
      <div class="info-block" style="opacity: 0; transform: translateY(20px);">
        <span class="info-label">Cómo Llegar</span>
        <p class="info-content">
          Metro línea 1, estación Ágora.<br />
          Bus Transmilenio ruta 93.<br />
          Parqueadero disponible en sitio.
        </p>
      </div>
      <div class="info-block" style="opacity: 0; transform: translateY(20px);">
        <span class="info-label">Fecha</span>
        <p class="info-content">15–17 Octubre 2026</p>
      </div>
    </div>
  </div>
</section>

<style>
  .ubicacion-section {
    overflow: hidden;
  }

  .ubicacion-split {
    display: flex;
    min-height: 80vh;
  }

  /* ---- Image side (60%) ---- */
  .venue-image-side {
    flex: 0 0 60%;
    position: relative;
    overflow: hidden;
  }

  .venue-image-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .venue-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .venue-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
  }

  .venue-text {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 var(--container-padding);
    z-index: 1;
  }

  .venue-name {
    font-size: var(--text-section-title);
    color: white;
    font-weight: bold;
    margin: 0;
    line-height: 1.1;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
  }

  .venue-city {
    font-size: var(--text-h3);
    color: rgba(255, 255, 255, 0.8);
    margin-top: 12px;
    margin-bottom: 0;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  }

  /* ---- Info panel (40%) ---- */
  .venue-info-panel {
    flex: 0 0 40%;
    background: var(--color-bg-dark);
    padding: 60px 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0;
  }

  .info-block {
    padding: 28px 0;
    border-top: 1px solid var(--color-border);
  }

  .info-block:first-child {
    border-top: none;
    padding-top: 0;
  }

  .info-block:last-child {
    padding-bottom: 0;
  }

  .info-label {
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-accent);
    font-weight: var(--font-weight-semibold);
  }

  .info-content {
    font-size: var(--text-body);
    color: white;
    margin: 8px 0 0;
    line-height: 1.6;
  }

  /* ---- Mobile: stack ---- */
  @media (max-width: 767px) {
    .ubicacion-split {
      flex-direction: column;
      min-height: auto;
    }

    .venue-image-side {
      flex: none;
      height: 50vh;
    }

    .venue-info-panel {
      flex: none;
      padding: 40px var(--container-padding);
    }

    .venue-name {
      font-size: clamp(28px, 7vw, 48px);
    }
  }
</style>
```

- [ ] **Step 2: Verify in browser**

```bash
cd reto-01 && npm run dev
```

Expected:
- Desktop: split layout — venue image with overlay text on left (60%), dark info panel on right (40%).
- Mobile: stacked — image on top (50vh), info panel below.
- Info labels are violet (#7c3aed), separated by subtle borders.

- [ ] **Step 3: Commit**

```bash
git add reto-01/src/components/Ubicacion.astro
git commit -m "feat(reto-01): rewrite Ubicación with split image + info panel layout"
```

---

### Task 8: Add GSAP stagger for venue info blocks

The info blocks are already set with `opacity: 0; transform: translateY(20px)` in the Ubicacion.astro markup. The GSAP animation in gsap-init.ts needs to target them.

**Files:**
- Modify: `reto-01/src/scripts/gsap-init.ts`

- [ ] **Step 1: Add info-block stagger animation**

After the location parallax block (section 6), add:

```typescript
  // 6b. Venue info blocks stagger
  const venueInfoBlocks = document.querySelectorAll('.venue-info-panel .info-block');
  if (venueInfoBlocks.length) {
    gsap.to('.venue-info-panel .info-block', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.venue-info-panel',
        start: 'top 75%',
      },
    });
  }
```

- [ ] **Step 2: Verify animations in browser**

Expected: When scrolling to the venue section, info blocks on the right stagger in from below.

- [ ] **Step 3: Commit**

```bash
git add reto-01/src/scripts/gsap-init.ts
git commit -m "feat(reto-01): add GSAP stagger animation for venue info blocks"
```

---

## Chunk 4: Sponsors Grid Hierarchy

### Task 9: Rewrite Sponsors.astro with hierarchical grid

**Files:**
- Modify: `reto-01/src/components/Sponsors.astro` — full rewrite

- [ ] **Step 1: Rewrite Sponsors.astro**

Replace entire file content with:

```astro
---
import sponsors from '../data/sponsors.json';
---

<section id="sponsors" class="sponsors-section">
  <div class="container">
    <h2
      class="section-title gsap-reveal"
      style="color: white; opacity: 0; transform: translateY(60px);"
    >
      Sponsors
    </h2>

    <!-- Platinum -->
    <div class="tier-group tier-platinum">
      <div class="tier-grid tier-grid--platinum">
        {sponsors.platinum.map((s) => (
          <div class="sponsor-card sponsor-card--platinum" style="opacity: 0; transform: translateY(20px);">
            <div class="card-glow"></div>
            <span class="card-tier-label">Platinum</span>
            <span class="card-name">{s.name}</span>
          </div>
        ))}
      </div>
    </div>

    <!-- Gold -->
    <div class="tier-group tier-gold">
      <div class="tier-grid tier-grid--gold">
        {sponsors.gold.map((s) => (
          <div class="sponsor-card sponsor-card--gold" style="opacity: 0; transform: translateY(20px);">
            <span class="card-tier-label card-tier-label--gold">Gold</span>
            <span class="card-name">{s.name}</span>
          </div>
        ))}
      </div>
    </div>

    <!-- Silver -->
    <div class="tier-group tier-silver">
      <div class="tier-grid tier-grid--silver">
        {sponsors.silver.map((s) => (
          <div class="sponsor-card sponsor-card--silver" style="opacity: 0; transform: translateY(20px);">
            <span class="card-name">{s.name}</span>
          </div>
        ))}
      </div>
    </div>

    <a href="#" class="sponsor-cta">Sé sponsor</a>
  </div>
</section>

<style>
  .sponsors-section {
    padding: var(--section-padding) 0;
    background: var(--color-bg-dark);
  }

  .container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--container-padding);
  }

  .tier-group {
    margin-bottom: 40px;
  }

  /* ---- Grids per tier ---- */
  .tier-grid {
    display: grid;
    gap: 16px;
  }

  .tier-grid--platinum {
    grid-template-columns: repeat(2, 1fr);
  }

  .tier-grid--gold {
    grid-template-columns: repeat(4, 1fr);
  }

  .tier-grid--silver {
    grid-template-columns: repeat(6, 1fr);
  }

  @media (max-width: 1199px) {
    .tier-grid--gold {
      grid-template-columns: repeat(2, 1fr);
    }
    .tier-grid--silver {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 767px) {
    .tier-grid--platinum {
      grid-template-columns: 1fr;
    }
    .tier-grid--gold {
      grid-template-columns: 1fr;
    }
    .tier-grid--silver {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* ---- Base card ---- */
  .sponsor-card {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    cursor: pointer;
  }

  .sponsor-card:hover {
    transform: translateY(-4px);
  }

  .card-tier-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-weight: var(--font-weight-semibold);
  }

  .card-name {
    font-weight: 600;
  }

  /* ---- Platinum ---- */
  .sponsor-card--platinum {
    background: rgba(124, 58, 237, 0.08);
    border: 1px solid rgba(124, 58, 237, 0.25);
    border-radius: 16px;
    min-height: 120px;
    padding: 32px;
  }

  .sponsor-card--platinum .card-tier-label {
    color: var(--color-accent);
  }

  .sponsor-card--platinum .card-name {
    font-size: 18px;
    font-weight: 700;
    color: white;
  }

  .sponsor-card--platinum .card-glow {
    position: absolute;
    top: -30px;
    right: -30px;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.2), transparent);
    border-radius: 50%;
    pointer-events: none;
  }

  .sponsor-card--platinum:hover {
    box-shadow: 0 8px 40px rgba(124, 58, 237, 0.2);
    border-color: rgba(124, 58, 237, 0.5);
  }

  /* ---- Gold ---- */
  .sponsor-card--gold {
    background: rgba(245, 158, 11, 0.06);
    border: 1px solid rgba(245, 158, 11, 0.15);
    padding: 20px 16px;
  }

  .card-tier-label--gold {
    color: #d4a017;
  }

  .sponsor-card--gold .card-name {
    font-size: 14px;
    color: #ccc;
  }

  .sponsor-card--gold:hover {
    box-shadow: 0 6px 30px rgba(245, 158, 11, 0.12);
    border-color: rgba(245, 158, 11, 0.35);
  }

  /* ---- Silver ---- */
  .sponsor-card--silver {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    padding: 14px 10px;
  }

  .sponsor-card--silver .card-name {
    font-size: 12px;
    color: #666;
  }

  .sponsor-card--silver:hover {
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.15);
  }

  /* ---- Animated border on hover (gradient rotation) ---- */
  @property --border-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
  }

  .sponsor-card--platinum:hover,
  .sponsor-card--gold:hover {
    border-image: conic-gradient(
        from var(--border-angle),
        transparent 25%,
        var(--color-accent) 50%,
        transparent 75%
      )
      1;
    animation: border-rotate 3s linear infinite;
  }

  .sponsor-card--gold:hover {
    border-image: conic-gradient(
        from var(--border-angle),
        transparent 25%,
        #f59e0b 50%,
        transparent 75%
      )
      1;
  }

  @keyframes border-rotate {
    to {
      --border-angle: 360deg;
    }
  }

  /* Fallback: browsers that don't support @property get a static brighter border (already set in :hover above) */

  /* ---- CTA ---- */
  .sponsor-cta {
    display: inline-block;
    margin: 24px auto 0;
    padding: 10px 24px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--color-border);
    border-radius: 100px;
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: var(--text-small);
    transition: background 0.2s ease, border-color 0.2s ease;
    text-align: center;
    width: fit-content;
  }

  .sponsor-cta:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--color-accent);
  }

  /* Center the CTA */
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .container > .section-title,
  .container > .tier-group {
    width: 100%;
  }
</style>
```

- [ ] **Step 2: Verify in browser**

```bash
cd reto-01 && npm run dev
```

Expected:
- Platinum: 2 large violet cards with glow, label "PLATINUM", name in white
- Gold: 4 medium amber-tinted cards
- Silver: 6 small subtle grey cards
- Hover on Platinum/Gold: card lifts, border animates with rotating gradient (or static fallback)
- CTA is a pill button at bottom
- All responsive

- [ ] **Step 3: Commit**

```bash
git add reto-01/src/components/Sponsors.astro
git commit -m "feat(reto-01): rewrite Sponsors with hierarchical colored grid and animated borders"
```

---

## Chunk 5: Final Polish

### Task 10: Cross-check all GSAP selectors and verify full page

**Files:**
- Modify: `reto-01/src/scripts/gsap-init.ts` (if needed)

- [ ] **Step 1: Read final gsap-init.ts and verify all selectors match the new DOM**

Selectors that should exist in the DOM:
- `.hero-content` — Hero section (unchanged)
- `nav` — Navbar (unchanged)
- `.section-title` — All section titles (unchanged)
- `.dock-item` — Speakers dock items (new)
- `.timeline-item` — Agenda items (unchanged)
- `.venue-image` — Location image (new, was `.venue-image-wrapper`)
- `.venue-info-panel .info-block` — Venue info blocks (new)
- `.tier-platinum .sponsor-card`, `.tier-gold .sponsor-card`, `.tier-silver .sponsor-card` — Sponsor cards by tier (new)
- `.ticket-card` — Ticket cards (unchanged)

- [ ] **Step 2: Run full page test in browser**

```bash
cd reto-01 && npm run dev
```

Scroll through entire page and verify:
1. Typewriter types slowly with dramatic pause
2. Speakers dock magnifies on hover, card appears below
3. Speakers mobile carousel scrolls with snap
4. Agenda timeline still works
5. Ubicación shows real image on left, info panel on right
6. Sponsors show colored hierarchy, hover lifts and animates border
7. Tickets still work
8. All GSAP animations fire correctly

- [ ] **Step 3: Test prefers-reduced-motion**

In browser DevTools → Rendering → Check "Emulate CSS media feature prefers-reduced-motion". Reload. Verify all elements visible without animation.

- [ ] **Step 4: Run production build**

```bash
cd reto-01 && npm run build
```

Expected: Build completes without errors.

- [ ] **Step 5: Fix any issues found, then commit**

```bash
git add reto-01/src/
git commit -m "fix(reto-01): final polish and cross-browser fixes for 4 improvements"
```
