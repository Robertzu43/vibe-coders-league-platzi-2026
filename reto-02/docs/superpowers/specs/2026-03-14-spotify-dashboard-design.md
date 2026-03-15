# Spotify Stats Dashboard — Design Spec

## Overview

A personal Spotify stats dashboard that displays the user's listening data (top artists, top tracks, genre breakdown, audio features, recently played) in a visually stunning, Wrapped-style interface. Data is pre-fetched from the Spotify API and stored as static JSON files. The dashboard includes a time range toggle (4 weeks / 6 months / all time) and a CTA inviting others to connect their own Spotify.

## Requirements (from Reto 2)

- At least 3 data cards ✓ (artists count, tracks count, genres count + more)
- A chart or visualization ✓ (genre bars, radar chart, top artists visual)
- Side or top navigation ✓ (hybrid: top bar + sidebar)
- Data can be mock/invented ✓ (real Spotify data pre-fetched as static JSON)

## Tech Stack

- **Framework:** Astro 6 (static site generation, same as reto-01)
- **Animation:** GSAP 3 + ScrollTrigger
- **Styling:** CSS vanilla with design tokens (CSS custom properties)
- **Scripting:** TypeScript
- **Charts:** Pure CSS (progress bars) + inline SVG (radar chart), animated with GSAP
- **Data:** Static JSON files pre-fetched from Spotify Web API

## Layout

**Hybrid layout** with three zones:

1. **Top bar** — Spotify logo + app name ("MY STATS"), time range tabs (4 Weeks / 6 Months / All Time), user avatar
2. **Left sidebar** — User profile photo, display name, quick stat cards (total artists / tracks / genres), navigation links (Overview, Artists, Tracks, Analysis)
3. **Main content area** — Grid of data sections that changes based on active nav view

## Visual Style

**Wrapped / Glassmorphism:**

- Dark background with gradient: `linear-gradient(135deg, #0a0014, #0d1b2a, #0a1628)`
- Glassmorphism cards: `rgba(255,255,255,0.04)` background, `backdrop-filter: blur(20px)`, subtle borders `rgba(255,255,255,0.06)`
- Vibrant accent colors:
  - Spotify Green: `#1DB954` (primary)
  - Purple: `#a855f7` / `#7c3aed`
  - Rose: `#f43f5e` / `#e11d48`
  - Blue: `#3b82f6` / `#2563eb`
  - Amber: `#f59e0b` / `#d97706`
- Gradient glows on key elements (artist circles, active states)
- Smooth GSAP entrance animations on load

## Navigation

### Top Bar

- Left: Spotify icon + "MY STATS" text
- Center-right: Time range toggle (pill-style tabs)
  - "4 Weeks" | "6 Months" | "All Time"
  - Active tab: green background, black text
  - Inactive: transparent, muted text
  - Switching tabs updates all data sections with the corresponding time range data
- Right: User avatar (circular)

### Sidebar Navigation

- 4 views:
  - **Overview** (default) — summary of everything
  - **Artists** — expanded top artists grid/list
  - **Tracks** — expanded top tracks list
  - **Analysis** — audio features deep dive
- Active state: green-tinted background, green text
- Inactive: muted text

## Data Sections

### 1. Quick Stats Cards (sidebar)

Three compact cards showing aggregate numbers:
- **Artists:** total unique artists in top list (e.g., "47")
- **Tracks:** total tracks in top list (e.g., "156")
- **Genres:** unique genres across top artists (e.g., "12")

Each card has the number in a distinct accent color and an uppercase label below.

### 2. Top Artists (main content)

- Display top 5 artists as circular images arranged horizontally
- Size decreases with rank (#1 is largest, #5 is smallest)
- Each circle has a gradient glow matching a unique color
- Below each: artist name (bold) and primary genre (muted)
- Images come from Spotify API artist data (stored in JSON)

### 3. Genre Breakdown (main content)

- Horizontal progress bars, one per genre
- Each bar has a unique gradient color
- Label on left, percentage on right
- Bars animate in with GSAP (width from 0 to target)
- Percentage calculated client-side: count occurrences of each genre across all artists in the active time range, divide by total genre tags, show top 6 genres

### 4. Sound DNA — Audio Features Radar (main content)

- SVG-based radar/spider chart with 6 axes:
  - Energy, Danceability, Valence, Acousticness, Liveness, Tempo
  - All values 0–1 (Spotify API returns 0–1 natively except tempo, which is normalized by dividing by 200 BPM)
- Concentric grid polygons for scale reference
- Data polygon filled with semi-transparent green, green stroke
- Labels at each vertex
- Values averaged from top tracks' audio features
- Animated with GSAP (polygon morphs from center to final shape)

### 5. Top Tracks / Recently Played (main content)

- Vertical list with rows:
  - Album art thumbnail (rounded square)
  - Track name (white, bold)
  - Artist name (muted)
  - Duration (right-aligned, muted)
- Alternating subtle background for readability
- GSAP stagger animation on load

### 6. CTA Banner (bottom)

- Full-width bar at bottom of dashboard
- Text: "¿Quieres ver tu propio dashboard?"
- Green "Conecta tu Spotify" button (non-functional, decorative)

## Data Architecture

### JSON Files (in `src/data/`)

Data pre-fetched from Spotify API, stored as static files:

- **`top-artists-short.json`** — Top artists, last 4 weeks
- **`top-artists-medium.json`** — Top artists, last 6 months
- **`top-artists-long.json`** — Top artists, all time
- **`top-tracks-short.json`** — Top tracks, last 4 weeks
- **`top-tracks-medium.json`** — Top tracks, last 6 months
- **`top-tracks-long.json`** — Top tracks, all time
- **`recently-played.json`** — Recently played tracks
- **`audio-features-short.json`** — Averaged audio features, last 4 weeks
- **`audio-features-medium.json`** — Averaged audio features, last 6 months
- **`audio-features-long.json`** — Averaged audio features, all time
- **`profile.json`** — User display name, avatar URL

### Data Counts

Each JSON file contains:
- **Top artists:** 20 artists per time range
- **Top tracks:** 30 tracks per time range
- **Recently played:** 20 most recent tracks
- **Audio features:** Pre-averaged values per time range (6 dimensions)

### Data Shape Examples

**Top Artist:**
```json
{
  "name": "Bad Bunny",
  "genres": ["reggaeton", "latin pop"],
  "popularity": 95,
  "image": "https://i.scdn.co/image/...",
  "id": "4q3ewBCX7sLwd24euuV69X"
}
```

**Top Track:**
```json
{
  "name": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "albumImage": "https://i.scdn.co/image/...",
  "duration_ms": 204000,
  "id": "trackId"
}
```

**Audio Features (averaged):**
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

## Time Range Toggle Behavior

- Three tabs: "4 Weeks" (short_term), "6 Months" (medium_term), "All Time" (long_term)
- On tab click:
  - Swap the active JSON data for top artists and top tracks
  - Recalculate genre breakdown client-side from the new artist set's genre tags
  - Swap audio features to the corresponding pre-averaged file
  - Animate transitions with GSAP (fade out old, fade in new)
- Recently Played is not affected by time range (it's always current)
- Default active tab: "4 Weeks"

## Sidebar View Switching

- 4 views controlled by sidebar nav clicks
- **Overview:** Shows all sections in a compact layout (top artists row, genre bars, radar chart, recent tracks)
- **Artists:** Expanded grid of all 20 top artists with larger cards
- **Tracks:** Full list of all 30 top tracks with rank numbers
- **Analysis:** Larger radar chart + individual audio feature breakdowns with explanations
- View switching is client-side (show/hide sections), no page navigation
- Time range toggle applies globally across all sidebar views (except Recently Played, which is always current)
- Interactive behavior is implemented via `<script>` tags in Astro components (vanilla TS), not framework hydration directives

## Animations (GSAP)

- **Page load:** Stagger entrance for sidebar stats, then main content sections
- **Genre bars:** Width animates from 0% to target width
- **Radar chart:** Polygon morphs from center point to final shape
- **Top artists:** Circles scale up from 0 with stagger
- **Track list:** Rows slide in from right with stagger
- **Time range switch:** Crossfade between data sets
- **View switch:** Fade transition between views
- **Reduced motion:** Respect `prefers-reduced-motion`, skip animations and show final state

## Responsive Design

- **Desktop (1024px+):** Full hybrid layout as described
- **Tablet (768px–1023px):** Sidebar collapses to icons only (no text), main content takes more space
- **Mobile (< 768px):** Sidebar becomes a bottom navigation bar (4 icons), top bar simplified, content stacks vertically, artist circles in horizontal scroll

## File Structure

```
reto-02/
├── src/
│   ├── components/
│   │   ├── TopBar.astro
│   │   ├── Sidebar.astro
│   │   ├── QuickStats.astro
│   │   ├── TopArtists.astro
│   │   ├── GenreBreakdown.astro
│   │   ├── SoundDNA.astro
│   │   ├── TrackList.astro
│   │   ├── CtaBanner.astro
│   │   └── TimeRangeTabs.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   ├── data/
│   │   ├── top-artists-short.json
│   │   ├── top-artists-medium.json
│   │   ├── top-artists-long.json
│   │   ├── top-tracks-short.json
│   │   ├── top-tracks-medium.json
│   │   ├── top-tracks-long.json
│   │   ├── recently-played.json
│   │   ├── audio-features-short.json
│   │   ├── audio-features-medium.json
│   │   ├── audio-features-long.json
│   │   └── profile.json
│   ├── styles/
│   │   └── global.css
│   └── scripts/
│       ├── gsap-init.ts
│       ├── time-range.ts
│       └── view-switch.ts
├── public/
├── package.json
├── astro.config.mjs
└── tsconfig.json
```

## Accessibility

- All images have alt text (artist names, album names)
- Navigation links are semantic `<nav>` with `<a>` or `<button>` elements
- Time range tabs use `role="tablist"` / `role="tab"` / `aria-selected`
- Color is not the only indicator (labels accompany all colored elements)
- `prefers-reduced-motion` respected for all GSAP animations
- Keyboard navigable (tab order follows visual layout)

## Edge Cases & Fallbacks

- **Broken artist/album images:** Show a placeholder gradient circle with the first letter of the artist/album name
- **Empty data arrays:** Show a "No data available" message in the corresponding section
- **All-zero audio features:** Render the radar polygon as a small dot at center
- **External images:** Use `loading="lazy"` for images below the fold; rely on Spotify CDN (no local caching)
