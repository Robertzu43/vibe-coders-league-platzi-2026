# Spotify Stats Dashboard Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal Spotify stats dashboard with top artists, tracks, genre breakdown, audio features radar, time range toggle, and sidebar navigation — all powered by pre-fetched static JSON data.

**Architecture:** Astro 6 static site with vanilla CSS + TypeScript. All Spotify data is pre-fetched and stored as JSON files in `src/data/`. Client-side interactivity (time range toggle, view switching) is handled via vanilla TS scripts. Visualizations use pure CSS progress bars and inline SVG (radar chart), animated with GSAP.

**Tech Stack:** Astro 6, GSAP 3, CSS vanilla (design tokens), TypeScript, SVG

---

## File Map

| File | Responsibility |
|------|---------------|
| `reto-02/package.json` | Dependencies: astro, gsap |
| `reto-02/astro.config.mjs` | Astro configuration |
| `reto-02/tsconfig.json` | TypeScript config extending astro/strict |
| `reto-02/src/styles/global.css` | Design tokens, reset, base styles, dashboard layout grid |
| `reto-02/src/layouts/Layout.astro` | HTML shell, meta tags, font preloads, global script imports |
| `reto-02/src/pages/index.astro` | Page composition — imports and assembles all components |
| `reto-02/src/components/TopBar.astro` | Spotify logo, "MY STATS", time range tabs (includes TimeRangeTabs from spec), user avatar |
| `reto-02/src/components/Sidebar.astro` | Profile photo, display name, quick stats (includes QuickStats from spec), nav links |
| `reto-02/src/components/TopArtists.astro` | Top 5 artists (overview) or top 20 (artists view) as circular images |
| `reto-02/src/components/GenreBreakdown.astro` | Genre progress bars with gradient colors |
| `reto-02/src/components/SoundDNA.astro` | SVG radar/spider chart for audio features |
| `reto-02/src/components/TrackList.astro` | Track list with album art, name, artist, duration |
| `reto-02/src/components/CtaBanner.astro` | Bottom CTA bar |
| `reto-02/src/scripts/gsap-init.ts` | GSAP entrance animations for all sections |
| `reto-02/src/scripts/time-range.ts` | Time range tab switching logic + data swapping |
| `reto-02/src/scripts/view-switch.ts` | Sidebar view switching (overview/artists/tracks/analysis) |
| `reto-02/src/data/*.json` | 11 JSON files with Spotify data (3 artists + 3 tracks + 3 audio + 1 recent + 1 profile) |

**Spec deviations:** The spec lists `TimeRangeTabs.astro` and `QuickStats.astro` as separate components. In this plan, TimeRangeTabs is inlined into `TopBar.astro` and QuickStats is inlined into `Sidebar.astro` to reduce file count without losing any functionality — they are tightly coupled to their parent components and don't need independent reuse.
| `reto-02/public/fonts/` | Inter font files (woff2) |

---

## Chunk 1: Project Scaffold & Static Data

### Task 1: Initialize Astro project

**Files:**
- Create: `reto-02/package.json`
- Create: `reto-02/astro.config.mjs`
- Create: `reto-02/tsconfig.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "spotify-dashboard",
  "type": "module",
  "version": "0.0.1",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^6.0.4",
    "gsap": "^3.14.2"
  }
}
```

- [ ] **Step 2: Create astro.config.mjs**

```js
// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Install dependencies**

Run: `cd reto-02 && npm install`
Expected: node_modules created, lock file generated

- [ ] **Step 5: Copy fonts from reto-01**

Copy `reto-01/public/fonts/` to `reto-02/public/fonts/` (Inter woff2 files).

- [ ] **Step 6: Commit**

```bash
git add reto-02/package.json reto-02/astro.config.mjs reto-02/tsconfig.json reto-02/public/fonts/
git commit -m "feat(reto-02): initialize Astro project with dependencies"
```

---

### Task 2: Create mock Spotify JSON data

**Files:**
- Create: `reto-02/src/data/profile.json`
- Create: `reto-02/src/data/top-artists-short.json`
- Create: `reto-02/src/data/top-artists-medium.json`
- Create: `reto-02/src/data/top-artists-long.json`
- Create: `reto-02/src/data/top-tracks-short.json`
- Create: `reto-02/src/data/top-tracks-medium.json`
- Create: `reto-02/src/data/top-tracks-long.json`
- Create: `reto-02/src/data/recently-played.json`
- Create: `reto-02/src/data/audio-features-short.json`
- Create: `reto-02/src/data/audio-features-medium.json`
- Create: `reto-02/src/data/audio-features-long.json`

**Context:** Create realistic mock data for all 13 JSON files. Use real artist/track names and Spotify CDN image URLs where possible. Each artist file has 20 entries, each track file has 30 entries, recently-played has 20 entries. Audio features files have 6 pre-averaged values (0–1 range). The data should vary across time ranges to make the time toggle meaningful.

- [ ] **Step 1: Create profile.json**

```json
{
  "displayName": "Roberto",
  "avatar": "https://i.scdn.co/image/ab6775700000ee85placeholder",
  "followers": 42
}
```

- [ ] **Step 2: Create top-artists-short.json (20 artists)**

Array of 20 artist objects each with: `name`, `genres` (array), `popularity` (number), `image` (Spotify CDN URL), `id`. Use varied genres (reggaeton, pop, rock, indie, electronic, r&b, hip-hop, latin, etc.). The first 5 artists should be the most "impactful" ones (high popularity, clear genres).

- [ ] **Step 3: Create top-artists-medium.json and top-artists-long.json**

Same shape but with different artist ordering and some different artists to make time range switching visible.

- [ ] **Step 4: Create top-tracks-short.json (30 tracks)**

Array of 30 track objects each with: `name`, `artist`, `album`, `albumImage` (Spotify CDN URL), `duration_ms`, `id`.

- [ ] **Step 5: Create top-tracks-medium.json and top-tracks-long.json**

Same shape, different track ordering and some different tracks.

- [ ] **Step 6: Create recently-played.json (20 tracks)**

Same track shape as top-tracks but with an additional `played_at` field (ISO date string).

- [ ] **Step 7: Create audio-features files**

Three files, each containing:
```json
{
  "energy": 0.72,
  "danceability": 0.65,
  "valence": 0.58,
  "acousticness": 0.23,
  "liveness": 0.15,
  "tempo": 0.68
}
```

Use different values per time range so the radar chart visibly changes.

- [ ] **Step 8: Commit**

```bash
git add reto-02/src/data/
git commit -m "feat(reto-02): add mock Spotify data JSON files"
```

---

### Task 3: Global styles and design tokens

**Files:**
- Create: `reto-02/src/styles/global.css`

- [ ] **Step 1: Create global.css with design tokens, reset, and dashboard layout**

Design tokens to define:
```css
:root {
  /* Colors */
  --color-bg: #0a0014;
  --color-bg-gradient: linear-gradient(135deg, #0a0014, #0d1b2a, #0a1628);
  --color-surface: rgba(255, 255, 255, 0.04);
  --color-surface-hover: rgba(255, 255, 255, 0.08);
  --color-border: rgba(255, 255, 255, 0.06);
  --color-border-hover: rgba(255, 255, 255, 0.12);
  --color-text-primary: #ffffff;
  --color-text-secondary: rgba(255, 255, 255, 0.5);
  --color-text-muted: rgba(255, 255, 255, 0.3);

  /* Spotify brand */
  --color-spotify: #1DB954;
  --color-spotify-light: #1ed760;

  /* Accent palette */
  --color-accent-purple: #a855f7;
  --color-accent-purple-dark: #7c3aed;
  --color-accent-rose: #f43f5e;
  --color-accent-rose-dark: #e11d48;
  --color-accent-blue: #3b82f6;
  --color-accent-blue-dark: #2563eb;
  --color-accent-amber: #f59e0b;
  --color-accent-amber-dark: #d97706;

  /* Typography */
  --font-family: 'Inter', system-ui, -apple-system, sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --text-xs: 10px;
  --text-sm: 12px;
  --text-base: 14px;
  --text-lg: 16px;
  --text-xl: 20px;
  --text-2xl: 28px;

  /* Spacing */
  --sidebar-width: 220px;
  --topbar-height: 56px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-medium: 0.4s ease;
}
```

CSS reset (same pattern as reto-01: `*, *::before, *::after { box-sizing: border-box; }`, `* { margin: 0; }`, `img { max-width: 100%; display: block; }`).

`@font-face` declarations for Inter (Regular 400, Medium 500, SemiBold 600, Bold 700) using `/fonts/*.woff2`.

Body base styles:
```css
body {
  font-family: var(--font-family);
  background: var(--color-bg);
  background: var(--color-bg-gradient);
  color: var(--color-text-primary);
  overflow: hidden;
  height: 100vh;
  font-size: var(--text-base);
  line-height: 1.5;
}
```

Dashboard grid layout:
```css
.dashboard {
  display: grid;
  grid-template-areas:
    "topbar topbar"
    "sidebar main";
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: var(--topbar-height) 1fr;
  height: 100vh;
}

.dashboard-topbar { grid-area: topbar; }
.dashboard-sidebar { grid-area: sidebar; }
.dashboard-main {
  grid-area: main;
  overflow-y: auto;
  padding: 24px;
}
```

Glassmorphism card utility:
```css
.glass-card {
  background: var(--color-surface);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}
```

Responsive breakpoints:
```css
/* Tablet: sidebar icons only */
@media (max-width: 1023px) {
  :root { --sidebar-width: 72px; }
}

/* Mobile: bottom nav */
@media (max-width: 767px) {
  .dashboard {
    grid-template-areas:
      "topbar"
      "main"
      "sidebar";
    grid-template-columns: 1fr;
    grid-template-rows: var(--topbar-height) 1fr 64px;
  }
}
```

Focus-visible styles:
```css
a:focus-visible, button:focus-visible {
  outline: 2px solid var(--color-spotify);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Verify syntax**

Run: `cd reto-02 && npx astro check` (or just verify the CSS parses)
Expected: No CSS errors

- [ ] **Step 3: Commit**

```bash
git add reto-02/src/styles/global.css
git commit -m "feat(reto-02): add global styles and design tokens"
```

---

### Task 4: Layout shell and page composition

**Files:**
- Create: `reto-02/src/layouts/Layout.astro`
- Create: `reto-02/src/pages/index.astro`

- [ ] **Step 1: Create Layout.astro**

HTML shell with:
- `<html lang="es">`
- Meta tags (charset, viewport, title, description, OG tags)
- Font preloads for Inter-Bold.woff2 and Inter-Regular.woff2
- Favicon SVG link
- Import of `../styles/global.css`
- `<body>` with `<slot />` for page content
- `<script>` tag importing `../scripts/gsap-init.ts`

Props interface: `{ title?: string }`
Default title: `"Spotify Stats Dashboard — My Music DNA"`

- [ ] **Step 2: Create index.astro**

Import all components and compose the dashboard layout:

```astro
---
import Layout from '../layouts/Layout.astro';
import TopBar from '../components/TopBar.astro';
import Sidebar from '../components/Sidebar.astro';
import TopArtists from '../components/TopArtists.astro';
import GenreBreakdown from '../components/GenreBreakdown.astro';
import SoundDNA from '../components/SoundDNA.astro';
import TrackList from '../components/TrackList.astro';
import CtaBanner from '../components/CtaBanner.astro';
---

<Layout>
  <div class="dashboard">
    <TopBar />
    <Sidebar />
    <main class="dashboard-main">
      <div class="view-content" data-view="overview">
        <TopArtists variant="compact" />
        <div class="main-grid">
          <GenreBreakdown />
          <SoundDNA />
        </div>
        <TrackList variant="recent" />
      </div>
      <div class="view-content" data-view="artists" style="display:none;">
        <TopArtists variant="expanded" />
      </div>
      <div class="view-content" data-view="tracks" style="display:none;">
        <TrackList variant="full" />
      </div>
      <div class="view-content" data-view="analysis" style="display:none;">
        <SoundDNA variant="expanded" />
      </div>
      <CtaBanner />
    </main>
  </div>
</Layout>
```

Add scoped styles for `.main-grid` (2-column grid for genre + radar side by side):
```css
.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 767px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Create placeholder components**

Create minimal placeholder files for each component so the page renders without errors:
- `TopBar.astro` — `<header class="dashboard-topbar">TopBar</header>`
- `Sidebar.astro` — `<aside class="dashboard-sidebar">Sidebar</aside>`
- `TopArtists.astro` — `<section>TopArtists</section>`
- `GenreBreakdown.astro` — `<section>GenreBreakdown</section>`
- `SoundDNA.astro` — `<section>SoundDNA</section>`
- `TrackList.astro` — `<section>TrackList</section>`
- `CtaBanner.astro` — `<div>CTA</div>`

Each placeholder should accept the props it will eventually use (e.g., `variant`) so imports don't break later.

- [ ] **Step 4: Create placeholder gsap-init.ts**

```ts
// Placeholder — animations added in Task 10
export {};
```

- [ ] **Step 5: Verify the dev server runs**

Run: `cd reto-02 && npm run dev`
Expected: Page loads at localhost showing placeholder text in the dashboard grid layout

- [ ] **Step 6: Commit**

```bash
git add reto-02/src/
git commit -m "feat(reto-02): add Layout, page composition, and placeholder components"
```

---

## Chunk 2: Core Components

### Task 5: TopBar component

**Files:**
- Modify: `reto-02/src/components/TopBar.astro`

- [ ] **Step 1: Implement TopBar**

Structure:
```html
<header class="dashboard-topbar">
  <div class="topbar-left">
    <!-- Spotify SVG icon (green circle + sound waves) -->
    <span class="topbar-brand">MY STATS</span>
  </div>
  <div class="topbar-tabs" role="tablist" aria-label="Time range">
    <button class="tab active" role="tab" aria-selected="true" data-range="short">4 Weeks</button>
    <button class="tab" role="tab" aria-selected="false" data-range="medium">6 Months</button>
    <button class="tab" role="tab" aria-selected="false" data-range="long">All Time</button>
  </div>
  <div class="topbar-avatar">
    <img src={profile.avatar} alt={profile.displayName} />
  </div>
</header>
```

Import `profile.json` in frontmatter.

Scoped CSS:
- `.dashboard-topbar`: flex, align-items center, padding 0 24px, border-bottom 1px solid var(--color-border), background rgba(0,0,0,0.4), backdrop-filter blur(20px), z-index 10
- `.topbar-left`: flex, align-items center, gap 8px
- `.topbar-brand`: color white, font-weight 600, font-size var(--text-base), letter-spacing 0.05em
- `.topbar-tabs`: flex, gap 4px, background rgba(255,255,255,0.06), border-radius var(--radius-sm), padding 3px, margin-left auto
- `.tab`: padding 6px 14px, border-radius 6px, border none, background transparent, color var(--color-text-secondary), font-size 11px, font-weight 600, cursor pointer, transition all var(--transition-fast)
- `.tab.active`: background var(--color-spotify), color #000
- `.topbar-avatar img`: width 32px, height 32px, border-radius 50%, border 1px solid var(--color-border)

Inline `<script>` tag importing `../scripts/time-range.ts`.

- [ ] **Step 2: Verify TopBar renders**

Run: `cd reto-02 && npm run dev`
Expected: Top bar visible with Spotify icon, "MY STATS", three tabs (first active in green), and avatar

- [ ] **Step 3: Commit**

```bash
git add reto-02/src/components/TopBar.astro
git commit -m "feat(reto-02): implement TopBar with time range tabs"
```

---

### Task 6: Sidebar component

**Files:**
- Modify: `reto-02/src/components/Sidebar.astro`

- [ ] **Step 1: Implement Sidebar**

Import `profile.json` in frontmatter.

Structure:
```html
<aside class="dashboard-sidebar">
  <div class="sidebar-profile">
    <div class="profile-avatar-ring">
      <img src={profile.avatar} alt={profile.displayName} class="profile-avatar" />
    </div>
    <span class="profile-name">{profile.displayName}</span>
    <span class="profile-subtitle">Spotify User</span>
  </div>

  <div class="sidebar-stats" id="sidebar-stats">
    <!-- 3 quick stat cards, values filled by JS based on active time range -->
    <div class="stat-card">
      <span class="stat-value" data-stat="artists" style="color: var(--color-spotify);">--</span>
      <span class="stat-label">Artists</span>
    </div>
    <div class="stat-card">
      <span class="stat-value" data-stat="tracks" style="color: var(--color-accent-purple);">--</span>
      <span class="stat-label">Tracks</span>
    </div>
    <div class="stat-card">
      <span class="stat-value" data-stat="genres" style="color: var(--color-accent-rose);">--</span>
      <span class="stat-label">Genres</span>
    </div>
  </div>

  <nav class="sidebar-nav" aria-label="Dashboard views">
    <button class="nav-link active" data-view="overview">
      <span class="nav-icon">🏠</span>
      <span class="nav-text">Overview</span>
    </button>
    <button class="nav-link" data-view="artists">
      <span class="nav-icon">🎤</span>
      <span class="nav-text">Artists</span>
    </button>
    <button class="nav-link" data-view="tracks">
      <span class="nav-icon">🎵</span>
      <span class="nav-text">Tracks</span>
    </button>
    <button class="nav-link" data-view="analysis">
      <span class="nav-icon">📊</span>
      <span class="nav-text">Analysis</span>
    </button>
  </nav>
</aside>
```

Scoped CSS:
- `.dashboard-sidebar`: flex column, padding 24px 20px, border-right 1px solid var(--color-border), overflow-y auto, background rgba(0,0,0,0.2)
- `.sidebar-profile`: flex column, align-items center, gap 8px
- `.profile-avatar-ring`: width 100px, height 100px, border-radius 50%, background linear-gradient(135deg, var(--color-spotify), var(--color-accent-purple)), display flex, align-items center, justify-content center, padding 4px
- `.profile-avatar`: width 100%, height 100%, border-radius 50%, object-fit cover
- `.profile-name`: color white, font-weight 600, font-size var(--text-base)
- `.profile-subtitle`: color var(--color-text-secondary), font-size var(--text-xs)
- `.sidebar-stats`: display flex, flex-direction column, gap 8px, margin-top 20px, width 100%
- `.stat-card`: glass-card styles, padding 12px, text-align center
- `.stat-value`: font-size var(--text-xl), font-weight 700, display block
- `.stat-label`: font-size var(--text-xs), text-transform uppercase, letter-spacing 0.1em, color var(--color-text-secondary), display block
- `.sidebar-nav`: margin-top auto, display flex, flex-direction column, gap 4px
- `.nav-link`: flex, align-items center, gap 10px, padding 8px 12px, border-radius var(--radius-sm), border none, background transparent, color var(--color-text-secondary), font-size var(--text-sm), cursor pointer, width 100%, text-align left, transition all var(--transition-fast)
- `.nav-link.active`: background rgba(29,185,84,0.15), color var(--color-spotify)
- `.nav-link:hover`: background var(--color-surface-hover)

Tablet responsive (max-width 1023px):
- `.sidebar-profile .profile-name, .profile-subtitle`: display none
- `.nav-text`: display none
- `.sidebar-stats`: display none (or keep compact)
- Center everything

Mobile responsive (max-width 767px):
- `.dashboard-sidebar`: flex-direction row, padding 0, border-right none, border-top 1px solid var(--color-border), background rgba(0,0,0,0.6), backdrop-filter blur(20px)
- `.sidebar-profile`: display none
- `.sidebar-stats`: display none
- `.sidebar-nav`: flex-direction row, width 100%, justify-content space-around
- `.nav-link`: flex-direction column, gap 2px, padding 8px, font-size 10px

Inline `<script>` importing `../scripts/view-switch.ts`.

- [ ] **Step 2: Verify Sidebar renders**

Run: `cd reto-02 && npm run dev`
Expected: Sidebar visible with profile photo, 3 stat cards (showing "--"), 4 nav links with Overview active

- [ ] **Step 3: Commit**

```bash
git add reto-02/src/components/Sidebar.astro
git commit -m "feat(reto-02): implement Sidebar with profile, stats, and navigation"
```

---

### Task 7: TopArtists component

**Files:**
- Modify: `reto-02/src/components/TopArtists.astro`

- [ ] **Step 1: Implement TopArtists**

Props: `{ variant: 'compact' | 'expanded' }` — compact shows top 5, expanded shows all 20.

Import `top-artists-short.json` in frontmatter (default time range). The component renders all data into the HTML; the time-range script will swap the DOM content.

**Compact variant (overview):**
```html
<section class="top-artists" data-section="artists">
  <h2 class="section-heading">Top Artists</h2>
  <div class="artists-row" id="artists-compact">
    {artists.slice(0, 5).map((artist, i) => (
      <div class="artist-circle" data-rank={i + 1} style={`--glow-color: ${glowColors[i]}`}>
        <img src={artist.image} alt={artist.name} loading={i < 3 ? 'eager' : 'lazy'} />
        <span class="artist-name">{artist.name}</span>
        <span class="artist-genre">{artist.genres[0]}</span>
      </div>
    ))}
  </div>
</section>
```

**Expanded variant (artists view):**
```html
<section class="top-artists-expanded" data-section="artists-expanded">
  <h2 class="section-heading">Top Artists</h2>
  <div class="artists-grid" id="artists-expanded">
    {artists.map((artist, i) => (
      <div class="artist-card glass-card">
        <span class="artist-rank">#{i + 1}</span>
        <img src={artist.image} alt={artist.name} class="artist-card-img" loading="lazy" />
        <span class="artist-name">{artist.name}</span>
        <span class="artist-genre">{artist.genres[0]}</span>
      </div>
    ))}
  </div>
</section>
```

Both variants import and render `top-artists-short.json` at build time (the `time-range.ts` script updates them client-side on tab switch).

Glow colors array: `['#e11d48', '#7c3aed', '#2563eb', '#f59e0b', '#1DB954']` — one per top 5 rank.

Scoped CSS:
- `.section-heading`: color white, font-size var(--text-lg), font-weight 600, margin-bottom 16px
- `.artists-row`: display flex, gap 16px, align-items flex-end
- `.artist-circle`: text-align center, flex-shrink 0
- `.artist-circle img`: border-radius 50%, object-fit cover, box-shadow 0 0 30px var(--glow-color, rgba(255,255,255,0.1))
- Size by rank: `[data-rank="1"] img` → 100x100, `[data-rank="2"]` → 80x80, `[data-rank="3"]` → 70x70, `[data-rank="4"], [data-rank="5"]` → 60x60
- `.artist-name`: color white, font-size var(--text-sm), font-weight 600, display block, margin-top 8px
- `.artist-genre`: color var(--color-text-secondary), font-size var(--text-xs), display block

Expanded grid CSS:
- `.artists-grid`: display grid, grid-template-columns repeat(auto-fill, minmax(140px, 1fr)), gap 20px
- Each card: glass-card, padding 20px, text-align center

Mobile: `.artists-row` → overflow-x auto, scroll-snap-type x mandatory

- [ ] **Step 2: Verify artists render**

Run: `cd reto-02 && npm run dev`
Expected: Top 5 artists visible as circular images with names and genres below

- [ ] **Step 3: Commit**

```bash
git add reto-02/src/components/TopArtists.astro
git commit -m "feat(reto-02): implement TopArtists with compact and expanded variants"
```

---

### Task 8: GenreBreakdown component

**Files:**
- Modify: `reto-02/src/components/GenreBreakdown.astro`

- [ ] **Step 1: Implement GenreBreakdown**

Import `top-artists-short.json` in frontmatter. Compute genre percentages at build time for the initial render:

```ts
// Frontmatter
import artists from '../data/top-artists-short.json';

const genreCounts: Record<string, number> = {};
let totalTags = 0;
artists.forEach(a => {
  a.genres.forEach(g => {
    genreCounts[g] = (genreCounts[g] || 0) + 1;
    totalTags++;
  });
});
const topGenres = Object.entries(genreCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 6)
  .map(([name, count]) => ({ name, percent: Math.round((count / totalTags) * 100) }));
```

Gradient colors per genre bar (array of 6): `['#1DB954,#1ed760', '#a855f7,#7c3aed', '#f43f5e,#e11d48', '#3b82f6,#2563eb', '#f59e0b,#d97706', '#06b6d4,#0891b2']`.

Structure:
```html
<section class="genre-breakdown glass-card" data-section="genres">
  <h2 class="section-heading">Genre Breakdown</h2>
  <div class="genre-bars" id="genre-bars">
    {topGenres.map((genre, i) => (
      <div class="genre-row">
        <span class="genre-name">{genre.name}</span>
        <div class="genre-track">
          <div
            class="genre-fill"
            style={`--target-width: ${genre.percent}%; background: linear-gradient(90deg, ${gradientColors[i]});`}
          ></div>
        </div>
        <span class="genre-percent" style={`color: ${gradientColors[i].split(',')[0]}`}>{genre.percent}%</span>
      </div>
    ))}
  </div>
</section>
```

Scoped CSS:
- `.genre-breakdown`: padding 20px
- `.genre-row`: display flex, align-items center, gap 8px
- `.genre-name`: color var(--color-text-secondary), font-size 11px, width 70px, text-align right, flex-shrink 0
- `.genre-track`: flex 1, height 20px, background rgba(255,255,255,0.06), border-radius 10px, overflow hidden
- `.genre-fill`: height 100%, border-radius 10px, width 0 (animated to var(--target-width) by GSAP)
- `.genre-percent`: font-size 11px, font-weight 600, width 40px

- [ ] **Step 2: Verify genre bars render**

Run: `cd reto-02 && npm run dev`
Expected: 6 genre bars with labels and percentages (bars at 0 width, waiting for GSAP)

- [ ] **Step 3: Commit**

```bash
git add reto-02/src/components/GenreBreakdown.astro
git commit -m "feat(reto-02): implement GenreBreakdown with progress bars"
```

---

### Task 9: SoundDNA radar chart component

**Files:**
- Modify: `reto-02/src/components/SoundDNA.astro`

- [ ] **Step 1: Implement SoundDNA**

Props: `{ variant?: 'compact' | 'expanded' }` — compact is default (overview), expanded shows larger chart + per-feature breakdowns.

Import `audio-features-short.json` in frontmatter.

The radar chart is a pure SVG with:
- 3 concentric hexagonal grid lines (25%, 50%, 75% scale)
- 6 axis lines from center to each vertex
- 6 labels at each vertex: Energy, Dance, Valence, Acoustic, Liveness, Tempo
- A data polygon computed from the 6 feature values

SVG math helper (in frontmatter):
```ts
const features = ['energy', 'danceability', 'valence', 'acousticness', 'liveness', 'tempo'];
const labels = ['Energy', 'Dance', 'Valence', 'Acoustic', 'Liveness', 'Tempo'];
const cx = 90, cy = 80, r = 65; // center and max radius

function polarToXY(angle: number, radius: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function makePolygon(values: number[], maxR: number) {
  return values.map((v, i) => {
    const angle = (360 / 6) * i;
    const { x, y } = polarToXY(angle, v * maxR);
    return `${x},${y}`;
  }).join(' ');
}

const gridScales = [0.25, 0.5, 0.75, 1.0];
const dataPoints = features.map(f => audioFeatures[f as keyof typeof audioFeatures]);
```

Structure:
```html
<section class="sound-dna glass-card" data-section="radar">
  <h2 class="section-heading">Your Sound DNA</h2>
  <div class="radar-container">
    <svg viewBox="0 0 180 160" class="radar-svg" id="radar-svg">
      <!-- Grid polygons -->
      {gridScales.map(scale => (
        <polygon
          points={makePolygon(Array(6).fill(scale), r)}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          stroke-width="1"
        />
      ))}
      <!-- Axis lines -->
      {features.map((_, i) => {
        const angle = (360 / 6) * i;
        const { x, y } = polarToXY(angle, r);
        return <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.06)" stroke-width="1" />;
      })}
      <!-- Data polygon -->
      <polygon
        id="radar-polygon"
        points={makePolygon(dataPoints, r)}
        fill="rgba(29,185,84,0.15)"
        stroke="#1DB954"
        stroke-width="2"
      />
      <!-- Labels -->
      {labels.map((label, i) => {
        const angle = (360 / 6) * i;
        const { x, y } = polarToXY(angle, r + 14);
        return <text x={x} y={y} text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="9">{label}</text>;
      })}
    </svg>
  </div>
</section>
```

**Expanded variant (analysis view):**

Uses the same radar SVG but larger (`max-width: 320px`), plus 6 individual feature bars below:

```html
{variant === 'expanded' && (
  <div class="feature-details">
    {features.map((f, i) => (
      <div class="feature-row">
        <span class="feature-label">{labels[i]}</span>
        <div class="feature-track">
          <div class="feature-fill" style={`width: ${Math.round(audioFeatures[f as keyof typeof audioFeatures] * 100)}%; background: linear-gradient(90deg, var(--color-spotify), var(--color-spotify-light));`}></div>
        </div>
        <span class="feature-value">{Math.round(audioFeatures[f as keyof typeof audioFeatures] * 100)}%</span>
      </div>
    ))}
  </div>
)}
```

CSS for `.feature-details`: same layout as genre bars (flex column, gap 10px, margin-top 20px). The expanded variant shares the same SVG center/radius constants as compact — it just renders at a larger display size via CSS `max-width`.

Scoped CSS:
- `.sound-dna`: padding 20px
- `.radar-container`: display flex, justify-content center
- `.radar-svg`: max-width 200px (compact), max-width 320px (expanded)

- [ ] **Step 2: Verify radar renders**

Run: `cd reto-02 && npm run dev`
Expected: SVG radar chart visible with hexagonal grid, green data polygon, and 6 labels

- [ ] **Step 3: Commit**

```bash
git add reto-02/src/components/SoundDNA.astro
git commit -m "feat(reto-02): implement SoundDNA radar chart with SVG"
```

---

## Chunk 3: Remaining Components & Interactivity

### Task 10: TrackList component

**Files:**
- Modify: `reto-02/src/components/TrackList.astro`

- [ ] **Step 1: Implement TrackList**

Props: `{ variant: 'recent' | 'full' }`

Import `recently-played.json` and `top-tracks-short.json` in frontmatter.

- `recent` variant: shows recently played tracks (used in overview)
- `full` variant: shows top 30 tracks with rank numbers (used in tracks view)

Helper function for duration formatting:
```ts
function formatDuration(ms: number): string {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
```

Structure:
```html
<section class="track-list" data-section="tracks">
  <h2 class="section-heading">{variant === 'recent' ? 'Recently Played' : 'Top Tracks'}</h2>
  <div class="tracks" id={variant === 'recent' ? 'recent-tracks' : 'top-tracks'}>
    {tracks.map((track, i) => (
      <div class="track-row">
        {variant === 'full' && <span class="track-rank">{i + 1}</span>}
        <img
          src={track.albumImage}
          alt={`${track.album} album art`}
          class="track-album-art"
          loading="lazy"
          onerror="this.style.display='none'"
        />
        <div class="track-info">
          <span class="track-name">{track.name}</span>
          <span class="track-artist">{track.artist}</span>
        </div>
        <span class="track-duration">{formatDuration(track.duration_ms)}</span>
      </div>
    ))}
  </div>
</section>
```

Scoped CSS:
- `.track-row`: display flex, align-items center, gap 12px, padding 8px, border-radius var(--radius-sm)
- `.track-row:nth-child(odd)`: background rgba(255,255,255,0.02)
- `.track-row:hover`: background var(--color-surface-hover)
- `.track-rank`: color var(--color-text-muted), font-size var(--text-sm), width 24px, text-align center, flex-shrink 0
- `.track-album-art`: width 40px, height 40px, border-radius 6px, flex-shrink 0, object-fit cover
- `.track-info`: flex 1, min-width 0, overflow hidden
- `.track-name`: color white, font-size var(--text-sm), font-weight 600, display block, white-space nowrap, text-overflow ellipsis, overflow hidden
- `.track-artist`: color var(--color-text-secondary), font-size var(--text-xs), display block
- `.track-duration`: color var(--color-text-muted), font-size var(--text-xs), flex-shrink 0

- [ ] **Step 2: Verify tracks render**

Run: `cd reto-02 && npm run dev`
Expected: Track list with album art thumbnails, track names, artist names, and durations

- [ ] **Step 3: Commit**

```bash
git add reto-02/src/components/TrackList.astro
git commit -m "feat(reto-02): implement TrackList with recent and full variants"
```

---

### Task 11: CtaBanner component

**Files:**
- Modify: `reto-02/src/components/CtaBanner.astro`

- [ ] **Step 1: Implement CtaBanner**

```html
<div class="cta-banner">
  <span class="cta-text">¿Quieres ver tu propio dashboard?</span>
  <button class="cta-button">Conecta tu Spotify</button>
</div>
```

Scoped CSS:
- `.cta-banner`: padding 16px 24px, border-top 1px solid var(--color-border), display flex, align-items center, justify-content center, gap 12px, margin-top 24px
- `.cta-text`: color var(--color-text-secondary), font-size var(--text-sm)
- `.cta-button`: padding 6px 16px, background var(--color-spotify), border none, border-radius 6px, color #000, font-size 11px, font-weight 600, cursor pointer, transition transform var(--transition-fast)
- `.cta-button:hover`: transform scale(1.05)

Mobile: stack vertically.

- [ ] **Step 2: Commit**

```bash
git add reto-02/src/components/CtaBanner.astro
git commit -m "feat(reto-02): implement CTA banner"
```

---

### Task 12: View switching script

**Files:**
- Create: `reto-02/src/scripts/view-switch.ts`

- [ ] **Step 1: Implement view-switch.ts**

```ts
import { gsap } from 'gsap';

function initViewSwitch() {
  const navLinks = document.querySelectorAll<HTMLButtonElement>('.nav-link');
  const viewContents = document.querySelectorAll<HTMLElement>('.view-content');
  let isAnimating = false;

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetView = link.dataset.view;
      if (!targetView || isAnimating) return;

      const currentView = document.querySelector<HTMLElement>('.view-content:not([style*="display: none"])');
      const nextView = document.querySelector<HTMLElement>(`.view-content[data-view="${targetView}"]`);
      if (!currentView || !nextView || currentView === nextView) return;

      isAnimating = true;

      // Update active nav link
      navLinks.forEach(l => {
        l.classList.remove('active');
        l.setAttribute('aria-selected', 'false');
      });
      link.classList.add('active');
      link.setAttribute('aria-selected', 'true');

      // GSAP crossfade transition
      gsap.to(currentView, {
        opacity: 0, duration: 0.2, ease: 'power2.in',
        onComplete: () => {
          currentView.style.display = 'none';
          currentView.style.opacity = '1';
          nextView.style.display = '';
          nextView.style.opacity = '0';
          gsap.to(nextView, {
            opacity: 1, duration: 0.3, ease: 'power2.out',
            onComplete: () => { isAnimating = false; }
          });
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initViewSwitch);
```

- [ ] **Step 2: Verify view switching works**

Run: `cd reto-02 && npm run dev`
Click each sidebar nav link. Expected: The main content area changes to show the correct view (overview, artists, tracks, analysis).

- [ ] **Step 3: Commit**

```bash
git add reto-02/src/scripts/view-switch.ts
git commit -m "feat(reto-02): implement sidebar view switching"
```

---

### Task 13: Time range switching script

**Files:**
- Create: `reto-02/src/scripts/time-range.ts`

- [ ] **Step 1: Implement time-range.ts**

This is the most complex script. It needs to:
1. Listen for tab clicks
2. Load the corresponding JSON data (all JSON is imported at build time by Astro, but we need client-side access)
3. Update the DOM: top artists, genre bars, radar chart, track list, sidebar stats

**Approach:** Since this is a static site, we embed all 3 time ranges of data into the page as `<script type="application/json">` blocks in the Astro components, then parse them client-side. Alternatively, we can inline them as JS objects.

The cleanest approach for Astro: In `index.astro`, add a hidden data block:

```html
<script id="spotify-data" type="application/json" set:html={JSON.stringify({
  artists: { short: artistsShort, medium: artistsMedium, long: artistsLong },
  tracks: { short: tracksShort, medium: tracksMedium, long: tracksLong },
  audio: { short: audioShort, medium: audioMedium, long: audioLong },
  recent: recentlyPlayed,
})} />
```

Then `time-range.ts`:

```ts
import { gsap } from 'gsap';

interface SpotifyArtist {
  name: string;
  genres: string[];
  popularity: number;
  image: string;
  id: string;
}

interface SpotifyTrack {
  name: string;
  artist: string;
  album: string;
  albumImage: string;
  duration_ms: number;
  id: string;
  played_at?: string; // Only present in recently-played.json
}

interface AudioFeatures {
  energy: number;
  danceability: number;
  valence: number;
  acousticness: number;
  liveness: number;
  tempo: number;
}

interface SpotifyData {
  artists: { short: SpotifyArtist[]; medium: SpotifyArtist[]; long: SpotifyArtist[] };
  tracks: { short: SpotifyTrack[]; medium: SpotifyTrack[]; long: SpotifyTrack[] };
  audio: { short: AudioFeatures; medium: AudioFeatures; long: AudioFeatures };
  recent: SpotifyTrack[];
}

let data: SpotifyData;

function loadData(): SpotifyData {
  const el = document.getElementById('spotify-data');
  return JSON.parse(el!.textContent!);
}

function formatDuration(ms: number): string {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function computeGenres(artists: SpotifyArtist[]) {
  const counts: Record<string, number> = {};
  let total = 0;
  artists.forEach(a => a.genres.forEach(g => { counts[g] = (counts[g] || 0) + 1; total++; }));
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, percent: Math.round((count / total) * 100) }));
}

function updateArtists(artists: SpotifyArtist[]) {
  // Update compact view (top 5)
  const container = document.getElementById('artists-compact');
  if (!container) return;
  const circles = container.querySelectorAll('.artist-circle');
  artists.slice(0, 5).forEach((artist, i) => {
    const el = circles[i];
    if (!el) return;
    const img = el.querySelector('img');
    const name = el.querySelector('.artist-name');
    const genre = el.querySelector('.artist-genre');
    if (img) { img.src = artist.image; img.alt = artist.name; }
    if (name) name.textContent = artist.name;
    if (genre) genre.textContent = artist.genres[0] || '';
  });
  // Update expanded view
  updateArtistsExpanded(artists);
}

function updateArtistsExpanded(artists: SpotifyArtist[]) {
  const grid = document.getElementById('artists-expanded');
  if (!grid) return;
  grid.innerHTML = artists.map((a, i) => `
    <div class="artist-card glass-card">
      <span class="artist-rank">#${i + 1}</span>
      <img src="${a.image}" alt="${a.name}" class="artist-card-img" loading="lazy" />
      <span class="artist-name">${a.name}</span>
      <span class="artist-genre">${a.genres[0] || ''}</span>
    </div>
  `).join('');
}

function updateGenres(artists: SpotifyArtist[]) {
  const genres = computeGenres(artists);
  const container = document.getElementById('genre-bars');
  if (!container) return;
  const gradients = ['#1DB954,#1ed760', '#a855f7,#7c3aed', '#f43f5e,#e11d48', '#3b82f6,#2563eb', '#f59e0b,#d97706', '#06b6d4,#0891b2'];
  container.innerHTML = genres.map((g, i) => `
    <div class="genre-row">
      <span class="genre-name">${g.name}</span>
      <div class="genre-track">
        <div class="genre-fill" style="--target-width: ${g.percent}%; width: ${g.percent}%; background: linear-gradient(90deg, ${gradients[i]});"></div>
      </div>
      <span class="genre-percent" style="color: ${gradients[i].split(',')[0]}">${g.percent}%</span>
    </div>
  `).join('');
}

function updateRadar(audio: AudioFeatures) {
  const polygon = document.getElementById('radar-polygon');
  if (!polygon) return;
  const features = [audio.energy, audio.danceability, audio.valence, audio.acousticness, audio.liveness, audio.tempo];
  const cx = 90, cy = 80, radius = 65;
  const points = features.map((v, i) => {
    const angle = ((360 / 6) * i - 90) * (Math.PI / 180);
    return `${cx + v * radius * Math.cos(angle)},${cy + v * radius * Math.sin(angle)}`;
  }).join(' ');
  polygon.setAttribute('points', points);
}

function updateTracks(tracks: SpotifyTrack[]) {
  const container = document.getElementById('top-tracks');
  if (!container) return;
  container.innerHTML = tracks.map((t, i) => `
    <div class="track-row">
      <span class="track-rank">${i + 1}</span>
      <img src="${t.albumImage}" alt="${t.album} album art" class="track-album-art" loading="lazy" />
      <div class="track-info">
        <span class="track-name">${t.name}</span>
        <span class="track-artist">${t.artist}</span>
      </div>
      <span class="track-duration">${formatDuration(t.duration_ms)}</span>
    </div>
  `).join('');
}

function updateSidebarStats(artists: SpotifyArtist[], tracks: SpotifyTrack[]) {
  const allGenres = new Set<string>();
  artists.forEach(a => a.genres.forEach(g => allGenres.add(g)));

  const artistStat = document.querySelector('[data-stat="artists"]');
  const trackStat = document.querySelector('[data-stat="tracks"]');
  const genreStat = document.querySelector('[data-stat="genres"]');

  if (artistStat) artistStat.textContent = String(artists.length);
  if (trackStat) trackStat.textContent = String(tracks.length);
  if (genreStat) genreStat.textContent = String(allGenres.size);
}

function switchTimeRange(range: 'short' | 'medium' | 'long', animate = true) {
  const artists = data.artists[range];
  const tracks = data.tracks[range];
  const audio = data.audio[range];

  if (animate) {
    // GSAP crossfade: fade out main content, swap data, fade back in
    const main = document.querySelector('.dashboard-main');
    if (main) {
      gsap.to(main, {
        opacity: 0, duration: 0.15, ease: 'power2.in',
        onComplete: () => {
          updateArtists(artists);
          updateGenres(artists);
          updateRadar(audio);
          updateTracks(tracks);
          updateSidebarStats(artists, tracks);
          gsap.to(main, { opacity: 1, duration: 0.25, ease: 'power2.out' });
        }
      });
    }
  } else {
    updateArtists(artists);
    updateGenres(artists);
    updateRadar(audio);
    updateTracks(tracks);
    updateSidebarStats(artists, tracks);
  }
}

function initTimeRange() {
  data = loadData();

  // Initialize with short_term (4 weeks), no animation on first load
  switchTimeRange('short', false);

  // Listen for tab clicks
  const tabs = document.querySelectorAll<HTMLButtonElement>('.tab[data-range]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      switchTimeRange(tab.dataset.range as 'short' | 'medium' | 'long');
    });
  });
}

document.addEventListener('DOMContentLoaded', initTimeRange);
```

- [ ] **Step 2: Update index.astro to embed all JSON data**

Add these imports to `index.astro` frontmatter:
```ts
import artistsShort from '../data/top-artists-short.json';
import artistsMedium from '../data/top-artists-medium.json';
import artistsLong from '../data/top-artists-long.json';
import tracksShort from '../data/top-tracks-short.json';
import tracksMedium from '../data/top-tracks-medium.json';
import tracksLong from '../data/top-tracks-long.json';
import recentlyPlayed from '../data/recently-played.json';
import audioShort from '../data/audio-features-short.json';
import audioMedium from '../data/audio-features-medium.json';
import audioLong from '../data/audio-features-long.json';
```

Add this hidden data block inside the `<Layout>` before `<div class="dashboard">`:
```html
<script id="spotify-data" type="application/json" set:html={JSON.stringify({
  artists: { short: artistsShort, medium: artistsMedium, long: artistsLong },
  tracks: { short: tracksShort, medium: tracksMedium, long: tracksLong },
  audio: { short: audioShort, medium: audioMedium, long: audioLong },
  recent: recentlyPlayed,
})} />
```

- [ ] **Step 3: Verify time range switching works**

Run: `cd reto-02 && npm run dev`
Click each time range tab. Expected: Artists, genres, radar, tracks, and sidebar stats all update.

- [ ] **Step 4: Commit**

```bash
git add reto-02/src/scripts/time-range.ts reto-02/src/pages/index.astro
git commit -m "feat(reto-02): implement time range switching with data swapping"
```

---

### Task 14: GSAP entrance animations

**Files:**
- Modify: `reto-02/src/scripts/gsap-init.ts`

- [ ] **Step 1: Implement gsap-init.ts**

```ts
import { gsap } from 'gsap';

function initAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show everything immediately
    gsap.set('.stat-card, .artist-circle, .genre-fill, .track-row, .cta-banner', {
      opacity: 1, y: 0, x: 0, scale: 1,
    });
    document.querySelectorAll<HTMLElement>('.genre-fill').forEach(el => {
      el.style.width = el.style.getPropertyValue('--target-width');
    });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  // 1. Sidebar stats stagger
  tl.from('.stat-card', {
    y: 20, opacity: 0, duration: 0.5, stagger: 0.1,
  });

  // 2. Top artists circles scale up
  tl.from('.artist-circle', {
    scale: 0, opacity: 0, duration: 0.5, stagger: 0.08,
  }, '-=0.2');

  // 3. Genre bars animate width
  tl.to('.genre-fill', {
    width: 'var(--target-width)', duration: 0.8, stagger: 0.08, ease: 'power2.out',
  }, '-=0.3');

  // 4. Radar polygon morph from center
  const radarPoly = document.getElementById('radar-polygon');
  if (radarPoly) {
    const finalPoints = radarPoly.getAttribute('points') || '';
    const cx = 90, cy = 80;
    const centerPoint = Array(6).fill(`${cx},${cy}`).join(' ');
    radarPoly.setAttribute('points', centerPoint);
    tl.to(radarPoly, {
      attr: { points: finalPoints },
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.5');
  }

  // 5. Track rows slide in
  tl.from('.track-row', {
    x: 30, opacity: 0, duration: 0.4, stagger: 0.04,
  }, '-=0.4');

  // 6. CTA banner
  tl.from('.cta-banner', {
    y: 20, opacity: 0, duration: 0.4,
  }, '-=0.2');
}

// Use requestAnimationFrame to ensure time-range.ts has populated the DOM first
document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(initAnimations);
});
```

- [ ] **Step 2: Verify animations play**

Run: `cd reto-02 && npm run dev`
Expected: On load, elements animate in with stagger: sidebar stats → artist circles → genre bars → radar → tracks → CTA

- [ ] **Step 3: Commit**

```bash
git add reto-02/src/scripts/gsap-init.ts
git commit -m "feat(reto-02): add GSAP entrance animations"
```

---

## Chunk 4: Polish & Responsive

### Task 15: Responsive design polish

**Files:**
- Modify: `reto-02/src/styles/global.css`
- Modify: Various component files as needed

- [ ] **Step 1: Verify and refine tablet layout (768px–1023px)**

At this breakpoint:
- Sidebar should collapse to icons only (72px wide)
- Profile photo stays, name/subtitle hide
- Nav links show only icons
- Quick stats cards hide
- Main content takes more space

Test by resizing the browser to ~900px.

- [ ] **Step 2: Verify and refine mobile layout (< 768px)**

At this breakpoint:
- Sidebar becomes a bottom navigation bar (64px tall, flex-direction row)
- Profile section hides entirely
- Top bar simplifies (brand text might shrink or hide)
- Main content stacks vertically
- Artist circles become horizontal scroll
- Genre bars and radar stack vertically (1 column)

Test by resizing to ~375px (iPhone).

- [ ] **Step 3: Fix any overflow or spacing issues**

Common issues:
- Track names overflowing on small screens → ensure text-overflow ellipsis
- Radar chart too large on mobile → constrain max-width
- Artists row wrapping weirdly → ensure horizontal scroll on mobile

- [ ] **Step 4: Commit**

```bash
git add reto-02/src/
git commit -m "fix(reto-02): responsive design polish for tablet and mobile"
```

---

### Task 16: Image fallbacks and error handling

**Files:**
- Modify: `reto-02/src/scripts/time-range.ts` (add onerror handling for dynamically created images)
- Modify: Components as needed

- [ ] **Step 1: Add image error fallback**

When an `<img>` fails to load, replace it with a gradient placeholder showing the first letter:

```ts
function handleImageError(img: HTMLImageElement, name: string) {
  const wrapper = document.createElement('div');
  wrapper.className = 'img-placeholder';
  wrapper.textContent = name.charAt(0).toUpperCase();
  img.replaceWith(wrapper);
}
```

Add CSS for `.img-placeholder`:
```css
.img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-accent-purple), var(--color-spotify));
  color: white;
  font-weight: 700;
  border-radius: inherit;
}
```

Apply `onerror` handlers to all artist and track images in static HTML and dynamically generated HTML.

- [ ] **Step 2: Commit**

```bash
git add reto-02/src/
git commit -m "fix(reto-02): add image fallback placeholders"
```

---

### Task 17: Final build verification and README update

**Files:**
- Modify: `reto-02/README.md`

- [ ] **Step 1: Run production build**

Run: `cd reto-02 && npm run build`
Expected: Build completes without errors, `dist/` directory created

- [ ] **Step 2: Preview production build**

Run: `cd reto-02 && npm run preview`
Expected: Site works correctly in preview mode — all interactions (time range, view switch) function, animations play

- [ ] **Step 3: Update README.md**

```markdown
# Reto 2 — Spotify Stats Dashboard

> Vibe Coders League Platzi 2026

Dashboard personal de estadísticas de Spotify con visualización de artistas más escuchados,
géneros favoritos, audio features (radar chart), y canciones recientes.

## Tech Stack

- Astro 6 (Static Site Generation)
- GSAP 3 (Animations)
- CSS vanilla + Design Tokens
- TypeScript
- SVG (Radar chart)

## Features

- Top artists y tracks con imágenes reales de Spotify
- Genre breakdown con barras de progreso animadas
- Sound DNA radar chart (Energy, Dance, Valence, Acoustic, Liveness, Tempo)
- Time range toggle (4 semanas / 6 meses / All time)
- 4 vistas: Overview, Artists, Tracks, Analysis
- Responsive: Desktop, Tablet, Mobile
- Animaciones de entrada con GSAP
- Accesibilidad: prefers-reduced-motion, ARIA roles, keyboard navigation

## Setup

```bash
npm install
npm run dev
```

## Estado

- [x] Completado
```

- [ ] **Step 4: Commit**

```bash
git add reto-02/
git commit -m "docs(reto-02): update README with project info and mark as completed"
```
